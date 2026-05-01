from datetime import datetime
from enum import Enum
from typing import Dict, List, Literal, Optional

from pydantic import BaseModel, Field


class Action(str, Enum):
    BUY = "BUY"
    SELL = "SELL"
    HOLD = "HOLD"


class StrategyType(str, Enum):
    RSI = "RSI"
    DCA = "DCA"
    HOLD = "HOLD"
    MOMENTUM = "MOMENTUM"
    HYBRID = "HYBRID"


class SignalState(str, Enum):
    GOOD = "good"
    BAD = "bad"
    NEUTRAL = "neutral"


class MarketData(BaseModel):
    symbol: str
    price: float
    timestamp: datetime
    rsi: Optional[float] = None
    volatility: Optional[float] = None
    sma: Optional[float] = None
    ema: Optional[float] = None
    sentiment: Optional[float] = None


class AgentDecision(BaseModel):
    action: Action
    strategy: StrategyType
    confidence: float
    reason: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class Position(BaseModel):
    id: str
    symbol: str
    name: str
    amount: float
    entry_price: float
    current_price: float
    allocation: float = 0.0
    timestamp: datetime


class Trade(BaseModel):
    id: str
    symbol: str
    asset_id: str
    asset_name: str
    action: Action
    amount: float
    price: float
    current_price: float
    pnl: float
    pnl_pct: float
    timestamp: datetime
    strategy: StrategyType
    reason: str
    status: Literal["open", "closed", "watch"] = "closed"


class SettingsPayload(BaseModel):
    active_strategy: StrategyType = StrategyType.RSI
    rsi_buy_below: int = 30
    rsi_sell_above: int = 70
    dca_interval_hours: int = 24
    stop_loss_pct: int = 5
    take_profit_pct: int = 15
    risk_level: Literal["Conservative", "Moderate", "Aggressive"] = "Moderate"
    notifications: Dict[str, bool] = Field(
        default_factory=lambda: {
            "trades": True,
            "alerts": True,
            "daily": False,
            "weekly": True,
        }
    )


class AssetSnapshot(BaseModel):
    id: str
    symbol: str
    name: str
    image: Optional[str] = None
    price: float
    market_cap: float
    market_cap_rank: Optional[int] = None
    total_volume: float
    change_24h: float
    change_7d: Optional[float] = None
    sparkline: List[float] = Field(default_factory=list)
    high_24h: Optional[float] = None
    low_24h: Optional[float] = None


class AssetHistoryPoint(BaseModel):
    timestamp: datetime
    price: float


class AssetDetail(BaseModel):
    asset: AssetSnapshot
    description: str = ""
    homepage: Optional[str] = None
    categories: List[str] = Field(default_factory=list)
    market_data: MarketData
    signal_state: Dict[str, SignalState]
    recommendation: AgentDecision


class StrategyInsight(BaseModel):
    strategy: StrategyType
    trade_count: int
    win_rate: float
    realized_pnl: float
    recent_streak: int
    state: Literal["failing", "stable", "watch", "promising"]
    summary: str


class PortfolioSummary(BaseModel):
    total_value: float
    invested: float
    realized_pnl: float
    unrealized_pnl: float
    total_pnl: float
    total_pnl_pct: float
    win_rate: float
    best_trade: float
    worst_trade: float
    cash_balance: float


class PortfolioAnalytics(BaseModel):
    summary: PortfolioSummary
    holdings: List[Position]
    history: List[Trade]
    equity_curve: List[AssetHistoryPoint]
    allocation: List[Dict[str, float | str]]
    strategy_performance: List[StrategyInsight]
    future_opportunities: List[Dict[str, str | float]]


class DashboardOverview(BaseModel):
    featured_assets: List[AssetSnapshot]
    selected_asset: AssetDetail
    selected_history: List[AssetHistoryPoint]
    portfolio: PortfolioSummary
    strategy_insights: List[StrategyInsight]
    top_movers: List[AssetSnapshot]


class Portfolio(BaseModel):
    balance: float
    positions: Dict[str, Position]
    total_value: float
    history: List[Trade]
