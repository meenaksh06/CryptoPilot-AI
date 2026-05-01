from __future__ import annotations

from ..models.schemas import AssetDetail, MarketData
from .coingecko import market_service


class MarketDataService:
    def __init__(self, default_asset_id: str = "bitcoin"):
        self.default_asset_id = default_asset_id

    def get_default_asset(self) -> AssetDetail:
        return market_service.get_asset(self.default_asset_id)

    def get_market_data(self, asset_id: str | None = None) -> MarketData:
        detail = market_service.get_asset(asset_id or self.default_asset_id)
        return detail.market_data


live_market_service = MarketDataService()
market_data_service = live_market_service
market_service = market_service
