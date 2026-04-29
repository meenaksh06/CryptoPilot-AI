from ..models.schemas import Action, MarketData, StrategyType

class BaseStrategy:
    def evaluate(self, data: MarketData) -> tuple[Action, float, str]:
        raise NotImplementedError

class RSIStrategy(BaseStrategy):
    def evaluate(self, data: MarketData) -> tuple[Action, float, str]:
        if data.rsi is None:
            return Action.HOLD, 0.0, "Insufficient RSI data"
        
        if data.rsi < 30:
            return Action.BUY, 0.8, f"RSI is {data.rsi} (Oversold)"
        elif data.rsi > 70:
            return Action.SELL, 0.8, f"RSI is {data.rsi} (Overbought)"
        
        return Action.HOLD, 0.5, f"RSI is {data.rsi} (Neutral)"

class DCAStrategy(BaseStrategy):
    def evaluate(self, data: MarketData) -> tuple[Action, float, str]:
        # Simple DCA: Buy every X intervals (simulated here by probability)
        # In a real app, this would check the timestamp
        import random
        if random.random() < 0.1: # 10% chance each tick to "DCA"
            return Action.BUY, 1.0, "Scheduled DCA Buy"
        return Action.HOLD, 0.0, "DCA Wait"

class HoldStrategy(BaseStrategy):
    def evaluate(self, data: MarketData) -> tuple[Action, float, str]:
        return Action.HOLD, 1.0, "Strategic Hold"
