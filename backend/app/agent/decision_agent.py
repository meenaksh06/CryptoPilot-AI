from datetime import datetime
from ..models.schemas import MarketData, AgentDecision, Action, StrategyType
from ..strategies.base import RSIStrategy, DCAStrategy, HoldStrategy
from ..memory.store import memory_store

class DecisionAgent:
    def __init__(self):
        self.strategies = {
            StrategyType.RSI: RSIStrategy(),
            StrategyType.DCA: DCAStrategy(),
            StrategyType.HOLD: HoldStrategy()
        }
        self.current_strategy = StrategyType.RSI

    def select_strategy(self, data: MarketData) -> StrategyType:
        if data.volatility and data.volatility > 0.035:
            return StrategyType.RSI
        stats = memory_store.get_strategy_stats()
        rsi_stats = stats["performance"].get(StrategyType.RSI.value, 0)
        dca_stats = stats["performance"].get(StrategyType.DCA.value, 0)
        if data.sentiment is not None and data.sentiment < -0.03 and dca_stats >= rsi_stats:
            return StrategyType.DCA
        return StrategyType.RSI

    async def decide(self, data: MarketData) -> AgentDecision:
        strategy_type = self.select_strategy(data)
        strategy = self.strategies[strategy_type]
        
        action, confidence, reason = strategy.evaluate(data)
        
        return AgentDecision(
            action=action,
            strategy=strategy_type,
            confidence=confidence,
            reason=reason,
            timestamp=datetime.now()
        )

# Singleton
decision_agent = DecisionAgent()
