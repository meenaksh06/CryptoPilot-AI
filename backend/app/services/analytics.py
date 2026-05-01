from __future__ import annotations

from collections import defaultdict
from datetime import datetime, timedelta

from ..models.schemas import Action, AssetHistoryPoint, PortfolioAnalytics, PortfolioSummary, Position, StrategyInsight, StrategyType, Trade


def _parse_datetime(value: str | datetime) -> datetime:
    if isinstance(value, datetime):
        return value
    return datetime.fromisoformat(value)


def hydrate_positions(raw_positions: list[dict], price_map: dict[str, float]) -> list[Position]:
    total_value = 0.0
    hydrated = []
    for item in raw_positions:
        current_price = price_map.get(item["id"], item.get("current_price") or item["entry_price"])
        position = Position(
            id=item["id"],
            symbol=item["symbol"],
            name=item["name"],
            amount=float(item["amount"]),
            entry_price=float(item["entry_price"]),
            current_price=float(current_price),
            allocation=float(item.get("allocation", 0.0)),
            timestamp=_parse_datetime(item["timestamp"]),
        )
        total_value += position.amount * position.current_price
        hydrated.append(position)

    if total_value > 0:
        for position in hydrated:
            value = position.amount * position.current_price
            position.allocation = round((value / total_value) * 100, 2)
    return hydrated


def hydrate_trades(raw_trades: list[dict], price_map: dict[str, float]) -> list[Trade]:
    trades = []
    for item in raw_trades:
        current_price = price_map.get(item["asset_id"], item.get("current_price") or item["price"])
        pnl = float(item["pnl"])
        if item["action"] == Action.BUY.value and item.get("status") == "open":
            pnl = (current_price - float(item["price"])) * float(item["amount"])
        pnl_pct = 0.0
        base = float(item["price"]) * float(item["amount"])
        if base:
            pnl_pct = (pnl / base) * 100
        trades.append(
            Trade(
                id=item["id"],
                symbol=item["symbol"],
                asset_id=item["asset_id"],
                asset_name=item["asset_name"],
                action=item["action"],
                amount=float(item["amount"]),
                price=float(item["price"]),
                current_price=float(current_price),
                pnl=round(pnl, 2),
                pnl_pct=round(pnl_pct, 2),
                timestamp=_parse_datetime(item["timestamp"]),
                strategy=item["strategy"],
                reason=item["reason"],
                status=item.get("status", "closed"),
            )
        )
    return sorted(trades, key=lambda trade: trade.timestamp, reverse=True)


def build_strategy_insights(raw_stats: dict, trades: list[Trade]) -> list[StrategyInsight]:
    trade_map: dict[str, list[Trade]] = defaultdict(list)
    for trade in trades:
        trade_map[trade.strategy].append(trade)

    insights = []
    for strategy in StrategyType:
        stats = raw_stats.get(strategy.value, {})
        strategy_trades = trade_map.get(strategy.value, [])
        wins = len([trade for trade in strategy_trades if trade.pnl > 0])
        trade_count = stats.get("trade_count", len(strategy_trades))
        win_rate = stats.get("win_rate", wins / trade_count if trade_count else 0.0)
        realized_pnl = stats.get("realized_pnl", sum(trade.pnl for trade in strategy_trades))
        recent_streak = stats.get("recent_streak", 0)

        if trade_count == 0:
            state = "watch"
            summary = f"{strategy.value} has no completed trades yet, but it remains available when conditions align."
        elif win_rate >= 0.65 and realized_pnl > 0:
            state = "promising"
            summary = f"{strategy.value} is compounding well with a {win_rate:.0%} win rate."
        elif win_rate < 0.45 or realized_pnl < 0:
            state = "failing"
            summary = f"{strategy.value} is underperforming and should be used selectively."
        else:
            state = "stable"
            summary = f"{strategy.value} is stable but waiting for a cleaner edge."

        insights.append(
            StrategyInsight(
                strategy=strategy,
                trade_count=trade_count,
                win_rate=round(win_rate, 2),
                realized_pnl=round(realized_pnl, 2),
                recent_streak=recent_streak,
                state=state,
                summary=summary,
            )
        )
    return insights


def build_portfolio_analytics(document: dict, price_map: dict[str, float]) -> PortfolioAnalytics:
    portfolio = document["portfolio"]
    cash_balance = float(portfolio.get("cash_balance", 0.0))
    holdings = hydrate_positions(portfolio.get("positions", []), price_map)
    history = hydrate_trades(portfolio.get("trade_history", []), price_map)

    invested = sum(position.amount * position.entry_price for position in holdings)
    current_value = sum(position.amount * position.current_price for position in holdings)
    unrealized_pnl = current_value - invested
    realized_pnl = sum(trade.pnl for trade in history if trade.status == "closed")
    total_pnl = realized_pnl + unrealized_pnl
    total_value = cash_balance + current_value
    total_pnl_pct = (total_pnl / invested * 100) if invested else 0.0
    winning_trades = [trade for trade in history if trade.pnl > 0]
    win_rate = len(winning_trades) / len(history) if history else 0.0
    best_trade = max((trade.pnl for trade in history), default=0.0)
    worst_trade = min((trade.pnl for trade in history), default=0.0)

    summary = PortfolioSummary(
        total_value=round(total_value, 2),
        invested=round(invested, 2),
        realized_pnl=round(realized_pnl, 2),
        unrealized_pnl=round(unrealized_pnl, 2),
        total_pnl=round(total_pnl, 2),
        total_pnl_pct=round(total_pnl_pct, 2),
        win_rate=round(win_rate * 100, 2),
        best_trade=round(best_trade, 2),
        worst_trade=round(worst_trade, 2),
        cash_balance=round(cash_balance, 2),
    )

    equity_curve = []
    baseline = cash_balance + invested
    for index in range(12):
        timestamp = datetime.utcnow() - timedelta(days=11 - index)
        drift = total_pnl * ((index + 1) / 12)
        equity_curve.append(AssetHistoryPoint(timestamp=timestamp, price=round(baseline + drift, 2)))

    allocation = [
        {
            "symbol": position.symbol,
            "name": position.name,
            "value": round(position.amount * position.current_price, 2),
            "allocation": position.allocation,
        }
        for position in holdings
    ]

    strategy_performance = build_strategy_insights(portfolio.get("strategy_stats", {}), history)
    future_opportunities = [
        {
            "title": "RSI reload window",
            "summary": "Oversold majors are approaching disciplined entry zones for staged buys.",
            "score": 0.81,
        },
        {
            "title": "DCA on market leaders",
            "summary": "Large-cap pullbacks remain attractive when volatility compresses and breadth stabilizes.",
            "score": 0.74,
        },
        {
            "title": "Momentum caution",
            "summary": "Breakout strategies are weaker right now and should wait for cleaner confirmation.",
            "score": 0.39,
        },
    ]

    return PortfolioAnalytics(
        summary=summary,
        holdings=holdings,
        history=history,
        equity_curve=equity_curve,
        allocation=allocation,
        strategy_performance=strategy_performance,
        future_opportunities=future_opportunities,
    )
