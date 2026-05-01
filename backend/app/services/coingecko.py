from __future__ import annotations

from datetime import datetime, timedelta
from typing import Any

import requests

from ..config.settings import get_settings
from ..models.schemas import Action, AgentDecision, AssetDetail, AssetHistoryPoint, AssetSnapshot, MarketData, SignalState, StrategyType
from ..utils.indicators import calculate_ema, calculate_rsi, calculate_sma, calculate_volatility

FALLBACK_MARKETS = [
    {"id": "bitcoin", "symbol": "BTC", "name": "Bitcoin", "price": 63412.0, "market_cap": 1248000000000, "rank": 1, "volume": 32100000000, "change_24h": 2.34, "change_7d": 4.8},
    {"id": "ethereum", "symbol": "ETH", "name": "Ethereum", "price": 3128.0, "market_cap": 376000000000, "rank": 2, "volume": 18400000000, "change_24h": -1.12, "change_7d": 2.1},
    {"id": "tether", "symbol": "USDT", "name": "Tether", "price": 1.0, "market_cap": 110000000000, "rank": 3, "volume": 69000000000, "change_24h": 0.01, "change_7d": 0.02},
    {"id": "binancecoin", "symbol": "BNB", "name": "BNB", "price": 584.0, "market_cap": 89800000000, "rank": 4, "volume": 1780000000, "change_24h": 0.87, "change_7d": 1.4},
    {"id": "solana", "symbol": "SOL", "name": "Solana", "price": 148.9, "market_cap": 68800000000, "rank": 5, "volume": 3980000000, "change_24h": 5.61, "change_7d": 11.2},
    {"id": "ripple", "symbol": "XRP", "name": "XRP", "price": 0.58, "market_cap": 32200000000, "rank": 6, "volume": 1240000000, "change_24h": 1.44, "change_7d": -0.8},
    {"id": "cardano", "symbol": "ADA", "name": "Cardano", "price": 0.448, "market_cap": 15800000000, "rank": 9, "volume": 470000000, "change_24h": -3.2, "change_7d": -6.4},
    {"id": "avalanche-2", "symbol": "AVAX", "name": "Avalanche", "price": 32.18, "market_cap": 12400000000, "rank": 11, "volume": 620000000, "change_24h": 4.15, "change_7d": 7.7},
    {"id": "dogecoin", "symbol": "DOGE", "name": "Dogecoin", "price": 0.128, "market_cap": 18400000000, "rank": 8, "volume": 1320000000, "change_24h": 7.88, "change_7d": 14.1},
    {"id": "chainlink", "symbol": "LINK", "name": "Chainlink", "price": 13.42, "market_cap": 7880000000, "rank": 16, "volume": 510000000, "change_24h": 2.9, "change_7d": 5.3},
    {"id": "polkadot", "symbol": "DOT", "name": "Polkadot", "price": 6.82, "market_cap": 9350000000, "rank": 14, "volume": 290000000, "change_24h": -0.44, "change_7d": 1.1},
    {"id": "matic-network", "symbol": "MATIC", "name": "Polygon", "price": 0.548, "market_cap": 5450000000, "rank": 21, "volume": 310000000, "change_24h": 1.23, "change_7d": -2.5},
]


class CoinGeckoService:
    def __init__(self):
        self.settings = get_settings()
        self.session = requests.Session()

    def _headers(self) -> dict[str, str]:
        if not self.settings.coingecko_api_key:
            return {}
        return {"x-cg-demo-api-key": self.settings.coingecko_api_key}

    def _get(self, path: str, params: dict[str, Any] | None = None) -> Any:
        response = self.session.get(
            f"{self.settings.coingecko_base_url}{path}",
            params=params or {},
            headers=self._headers(),
            timeout=20,
        )
        response.raise_for_status()
        return response.json()

    def get_global(self) -> dict[str, Any]:
        try:
            return self._get("/global").get("data", {})
        except requests.RequestException:
            return {
                "total_market_cap": {"usd": sum(item["market_cap"] for item in FALLBACK_MARKETS)},
                "total_volume": {"usd": sum(item["volume"] for item in FALLBACK_MARKETS)},
                "market_cap_percentage": {"btc": 52.4},
                "active_cryptocurrencies": len(FALLBACK_MARKETS),
                "markets": 1,
            }

    def get_markets(
        self,
        page: int = 1,
        per_page: int = 25,
        search: str | None = None,
        sort: str = "market_cap_desc",
        asset_ids: list[str] | None = None,
    ) -> list[AssetSnapshot]:
        params = {
            "vs_currency": "usd",
            "order": sort,
            "per_page": min(per_page, 100),
            "page": page,
            "sparkline": "true",
            "price_change_percentage": "24h,7d",
        }
        fallback_filter = None
        if asset_ids:
            params["ids"] = ",".join(asset_ids)
            fallback_filter = lambda item: item["id"] in asset_ids
        elif search:
            params["ids"] = ",".join(self.search_coin_ids(search))
            needle = search.lower()
            fallback_filter = lambda item: needle in item["id"] or needle in item["name"].lower() or needle in item["symbol"].lower()
            if not params["ids"]:
                return self._fallback_markets(fallback_filter)
        try:
            payload = self._get("/coins/markets", params=params)
            return [self._to_asset_snapshot(item) for item in payload]
        except requests.RequestException:
            return self._fallback_markets(fallback_filter)[:per_page]

    def search_coin_ids(self, query: str) -> list[str]:
        try:
            payload = self._get("/search", params={"query": query})
            coins = payload.get("coins", [])
            return [coin["id"] for coin in coins[:15]]
        except requests.RequestException:
            needle = query.lower()
            return [
                item["id"]
                for item in FALLBACK_MARKETS
                if needle in item["id"] or needle in item["name"].lower() or needle in item["symbol"].lower()
            ][:15]

    def get_asset(self, asset_id: str) -> AssetDetail:
        try:
            market_items = self.get_markets(page=1, per_page=1, search=asset_id)
            market = market_items[0] if market_items else None
            if market is None:
                payload = self._get(
                    f"/coins/{asset_id}",
                    params={
                        "localization": "false",
                        "tickers": "false",
                        "market_data": "true",
                        "community_data": "false",
                        "developer_data": "false",
                        "sparkline": "false",
                    },
                )
                market = AssetSnapshot(
                    id=payload["id"],
                    symbol=payload["symbol"].upper(),
                    name=payload["name"],
                    image=payload.get("image", {}).get("large"),
                    price=payload["market_data"]["current_price"]["usd"],
                    market_cap=payload["market_data"]["market_cap"]["usd"],
                    market_cap_rank=payload.get("market_cap_rank"),
                    total_volume=payload["market_data"]["total_volume"]["usd"],
                    change_24h=payload["market_data"].get("price_change_percentage_24h", 0.0) or 0.0,
                    change_7d=payload["market_data"].get("price_change_percentage_7d", 0.0),
                    high_24h=payload["market_data"].get("high_24h", {}).get("usd"),
                    low_24h=payload["market_data"].get("low_24h", {}).get("usd"),
                )
            payload = self._get(
                f"/coins/{asset_id}",
                params={
                    "localization": "false",
                    "tickers": "false",
                    "market_data": "true",
                    "community_data": "false",
                    "developer_data": "false",
                    "sparkline": "false",
                },
            )
            history = self.get_history(asset_id, "7d")
            prices = [point.price for point in history]
            indicators = self._build_market_data(market.symbol, market.price, prices)
            signal_state = self._signal_state(indicators)
            recommendation = self._recommendation(indicators, market.symbol)
            return AssetDetail(
                asset=market,
                description=(payload.get("description", {}).get("en") or "").strip()[:400],
                homepage=(payload.get("links", {}).get("homepage") or [None])[0],
                categories=payload.get("categories", [])[:5],
                market_data=indicators,
                signal_state=signal_state,
                recommendation=recommendation,
            )
        except requests.RequestException:
            return self._fallback_asset(asset_id)

    def get_history(self, asset_id: str, range_key: str) -> list[AssetHistoryPoint]:
        days = 7 if range_key == "7d" else 30
        try:
            payload = self._get(
                f"/coins/{asset_id}/market_chart",
                params={"vs_currency": "usd", "days": days, "interval": "daily" if days == 30 else ""},
            )
            return [
                AssetHistoryPoint(timestamp=datetime.utcfromtimestamp(item[0] / 1000), price=float(item[1]))
                for item in payload.get("prices", [])
            ]
        except requests.RequestException:
            return self._fallback_history(asset_id, days)

    def _to_asset_snapshot(self, item: dict[str, Any]) -> AssetSnapshot:
        sparkline = item.get("sparkline_in_7d", {}).get("price") or []
        return AssetSnapshot(
            id=item["id"],
            symbol=item["symbol"].upper(),
            name=item["name"],
            image=item.get("image"),
            price=float(item["current_price"]),
            market_cap=float(item.get("market_cap") or 0.0),
            market_cap_rank=item.get("market_cap_rank"),
            total_volume=float(item.get("total_volume") or 0.0),
            change_24h=float(item.get("price_change_percentage_24h") or 0.0),
            change_7d=float(item.get("price_change_percentage_7d_in_currency") or 0.0),
            sparkline=[float(point) for point in sparkline[-20:]],
            high_24h=item.get("high_24h"),
            low_24h=item.get("low_24h"),
        )

    def _fallback_markets(self, item_filter=None) -> list[AssetSnapshot]:
        items = FALLBACK_MARKETS
        if item_filter is not None:
            items = [item for item in items if item_filter(item)]
        return [self._fallback_snapshot(item) for item in items]

    def _fallback_snapshot(self, item: dict[str, Any]) -> AssetSnapshot:
        prices = self._fallback_prices(item, 20)
        return AssetSnapshot(
            id=item["id"],
            symbol=item["symbol"],
            name=item["name"],
            price=float(item["price"]),
            market_cap=float(item["market_cap"]),
            market_cap_rank=item["rank"],
            total_volume=float(item["volume"]),
            change_24h=float(item["change_24h"]),
            change_7d=float(item["change_7d"]),
            sparkline=prices,
            high_24h=round(item["price"] * 1.025, 4),
            low_24h=round(item["price"] * 0.975, 4),
        )

    def _fallback_asset(self, asset_id: str) -> AssetDetail:
        item = next((market for market in FALLBACK_MARKETS if market["id"] == asset_id), FALLBACK_MARKETS[0])
        market = self._fallback_snapshot(item)
        history = self._fallback_history(item["id"], 7)
        prices = [point.price for point in history]
        indicators = self._build_market_data(market.symbol, market.price, prices)
        signal_state = self._signal_state(indicators)
        recommendation = self._recommendation(indicators, market.symbol)
        return AssetDetail(
            asset=market,
            description=f"{market.name} is served from CryptoPilot's local market fallback while the live provider is unavailable.",
            homepage=None,
            categories=["Fallback market data", "Simulation"],
            market_data=indicators,
            signal_state=signal_state,
            recommendation=recommendation,
        )

    def _fallback_history(self, asset_id: str, days: int) -> list[AssetHistoryPoint]:
        item = next((market for market in FALLBACK_MARKETS if market["id"] == asset_id), FALLBACK_MARKETS[0])
        prices = self._fallback_prices(item, days + 1)
        start = datetime.utcnow() - timedelta(days=days)
        return [
            AssetHistoryPoint(timestamp=start + timedelta(days=index), price=price)
            for index, price in enumerate(prices)
        ]

    def _fallback_prices(self, item: dict[str, Any], count: int) -> list[float]:
        count = max(count, 2)
        price = float(item["price"])
        weekly_change = float(item["change_7d"]) / 100
        start = price / (1 + weekly_change) if weekly_change > -0.95 else price
        prices = []
        for index in range(count):
            progress = index / (count - 1)
            wave = ((index % 5) - 2) * 0.004
            prices.append(round(start + ((price - start) * progress) + (price * wave), 6))
        prices[-1] = round(price, 6)
        return prices

    def _build_market_data(self, symbol: str, price: float, prices: list[float]) -> MarketData:
        return MarketData(
            symbol=symbol,
            price=round(price, 4),
            timestamp=datetime.utcnow(),
            rsi=round(calculate_rsi(prices), 2) if prices else 50.0,
            volatility=round(calculate_volatility(prices), 4) if prices else 0.0,
            sma=round(calculate_sma(prices, 14) or price, 4),
            ema=round(calculate_ema(prices, 14) or price, 4),
            sentiment=round((prices[-1] - prices[0]) / prices[0], 4) if len(prices) > 1 else 0.0,
        )

    def _signal_state(self, market_data: MarketData) -> dict[str, SignalState]:
        if market_data.rsi is None:
            rsi_state = SignalState.NEUTRAL
        elif market_data.rsi < 35:
            rsi_state = SignalState.GOOD
        elif market_data.rsi > 70:
            rsi_state = SignalState.BAD
        else:
            rsi_state = SignalState.NEUTRAL

        if market_data.sentiment is None:
            dca_state = SignalState.NEUTRAL
        elif market_data.sentiment < -0.03:
            dca_state = SignalState.GOOD
        elif market_data.sentiment > 0.08:
            dca_state = SignalState.BAD
        else:
            dca_state = SignalState.NEUTRAL

        return {"rsi": rsi_state, "dca": dca_state}

    def _recommendation(self, market_data: MarketData, symbol: str) -> AgentDecision:
        signal_state = self._signal_state(market_data)
        if signal_state["rsi"] == SignalState.GOOD:
            return AgentDecision(
                action=Action.BUY,
                strategy=StrategyType.RSI,
                confidence=0.82,
                reason=f"RSI on {symbol} is {market_data.rsi}, indicating oversold conditions with improving momentum.",
            )
        if signal_state["rsi"] == SignalState.BAD:
            return AgentDecision(
                action=Action.SELL,
                strategy=StrategyType.RSI,
                confidence=0.79,
                reason=f"RSI on {symbol} is {market_data.rsi}, signaling an overheated market.",
            )
        if signal_state["dca"] == SignalState.GOOD:
            return AgentDecision(
                action=Action.BUY,
                strategy=StrategyType.DCA,
                confidence=0.73,
                reason=f"{symbol} has pulled back enough to justify a disciplined DCA entry.",
            )
        return AgentDecision(
            action=Action.HOLD,
            strategy=StrategyType.HOLD,
            confidence=0.58,
            reason=f"{symbol} is in a neutral zone. Waiting for a clearer edge is the disciplined move.",
        )


market_service = CoinGeckoService()
