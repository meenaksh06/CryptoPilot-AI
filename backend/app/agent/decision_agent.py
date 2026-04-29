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
        # Dynamic selection logic
        # If volatility is high, maybe use RSI
        # If neutral, use HOLD
        if data.volatility and data.volatility > 0.02:
            return StrategyType.RSI
        
        # Check memory - if RSI has been failing, maybe try DCA?
        stats = memory_store.get_strategy_stats()
        # (Simplified logic for now)
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
