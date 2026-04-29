from pydantic import BaseModel
from typing import List, Optional, Dict
from datetime import datetime
from enum import Enum

class Action(str, Enum):
    BUY = "BUY"
    SELL = "SELL"
    HOLD = "HOLD"

class StrategyType(str, Enum):
    RSI = "RSI"
    DCA = "DCA"
    HOLD = "HOLD"

class MarketData(BaseModel):
    symbol: str
    price: float
    timestamp: datetime
    rsi: Optional[float] = None
    volatility: Optional[float] = None

class AgentDecision(BaseModel):
    action: Action
    strategy: StrategyType
    confidence: float
    reason: str
    timestamp: datetime = datetime.now()

class Position(BaseModel):
    symbol: str
    amount: float
    entry_price: float
    timestamp: datetime

class Trade(BaseModel):
    id: str
    symbol: str
    action: Action
    amount: float
    price: float
    timestamp: datetime
    strategy: StrategyType
    reason: str

class Portfolio(BaseModel):
    balance: float
    positions: Dict[str, Position]
    total_value: float
    history: List[Trade]
