import uuid
from datetime import datetime
from typing import Dict, List
from ..models.schemas import Action, Trade, Position, Portfolio, StrategyType

class ExecutionEngine:
    def __init__(self, initial_balance: float = 10000.0):
        self.balance = initial_balance
        self.positions: Dict[str, Position] = {}
        self.trade_history: List[Trade] = []

    def execute_trade(self, symbol: str, action: Action, price: float, strategy: StrategyType, reason: str):
        if action == Action.BUY:
            amount_to_spend = self.balance * 0.1  # Buy with 10% of balance
            if self.balance < amount_to_spend:
                return None
            
            crypto_amount = amount_to_spend / price
            self.balance -= amount_to_spend
            
            if symbol in self.positions:
                pos = self.positions[symbol]
                new_amount = pos.amount + crypto_amount
                new_entry = (pos.amount * pos.entry_price + amount_to_spend) / new_amount
                self.positions[symbol] = Position(
                    symbol=symbol,
                    amount=new_amount,
                    entry_price=new_entry,
                    timestamp=datetime.now()
                )
            else:
                self.positions[symbol] = Position(
                    symbol=symbol,
                    amount=crypto_amount,
                    entry_price=price,
                    timestamp=datetime.now()
                )
            
            trade = Trade(
                id=str(uuid.uuid4()),
                symbol=symbol,
                action=Action.BUY,
                amount=crypto_amount,
                price=price,
                timestamp=datetime.now(),
                strategy=strategy,
                reason=reason
            )
            self.trade_history.append(trade)
            return trade

        elif action == Action.SELL:
            if symbol not in self.positions:
                return None
            
            pos = self.positions[symbol]
            amount_to_sell = pos.amount # Sell all
            sale_value = amount_to_sell * price
            self.balance += sale_value
            
            trade = Trade(
                id=str(uuid.uuid4()),
                symbol=symbol,
                action=Action.SELL,
                amount=amount_to_sell,
                price=price,
                timestamp=datetime.now(),
                strategy=strategy,
                reason=reason
            )
            
            del self.positions[symbol]
            self.trade_history.append(trade)
            return trade
            
        return None

    def get_portfolio(self, current_prices: Dict[str, float]) -> Portfolio:
        total_value = self.balance
        for symbol, pos in self.positions.items():
            price = current_prices.get(symbol, pos.entry_price)
            total_value += pos.amount * price
            
        return Portfolio(
            balance=round(self.balance, 2),
            positions=self.positions,
            total_value=round(total_value, 2),
            history=self.trade_history[-20:] # Last 20 trades
        )

# Singleton instance
execution_engine = ExecutionEngine()
