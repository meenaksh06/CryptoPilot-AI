from typing import List, Dict, Any
from ..models.schemas import Trade, StrategyType

class MemoryStore:
    def __init__(self):
        self.strategy_performance: Dict[StrategyType, float] = {
            StrategyType.RSI: 0.0,
            StrategyType.DCA: 0.0,
            StrategyType.HOLD: 0.0
        }
        self.total_trades: Dict[StrategyType, int] = {
            StrategyType.RSI: 0,
            StrategyType.DCA: 0,
            StrategyType.HOLD: 0
        }
        self.short_term_memory: List[Dict[str, Any]] = []

    def update_memory(self, trade: Trade):
        if trade:
            self.total_trades[trade.strategy] += 1
            # In a real app, we'd calculate PnL here
            # For now, we'll store the trade in memory
            self.short_term_memory.append({
                "action": trade.action,
                "strategy": trade.strategy,
                "price": trade.price,
                "timestamp": trade.timestamp
            })
            
            if len(self.short_term_memory) > 50:
                self.short_term_memory.pop(0)

    def get_strategy_stats(self) -> Dict[str, Any]:
        return {
            "performance": self.strategy_performance,
            "counts": self.total_trades,
            "recent": self.short_term_memory[-5:]
        }

# Singleton
memory_store = MemoryStore()
