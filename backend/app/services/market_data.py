import random
import asyncio
from datetime import datetime
from typing import List
import numpy as np
from ..models.schemas import MarketData

class MarketDataService:
    def __init__(self, symbol: str = "BTC/USDT"):
        self.symbol = symbol
        self.current_price = 65000.0
        self.prices: List[float] = [self.current_price]
        self.window_size = 14

    def calculate_rsi(self, prices: List[float], period: int = 14) -> float:
        if len(prices) < period + 1:
            return 50.0  # Neutral
        
        deltas = np.diff(prices)
        seed = deltas[:period]
        up = seed[seed >= 0].sum() / period
        down = -seed[seed < 0].sum() / period
        rs = up / down if down != 0 else 0
        rsi = 100.0 - (100.0 / (1.0 + rs))

        for i in range(period, len(deltas)):
            delta = deltas[i]
            if delta > 0:
                upval = delta
                downval = 0.0
            else:
                upval = 0.0
                downval = -delta

            up = (up * (period - 1) + upval) / period
            down = (down * (period - 1) + downval) / period
            rs = up / down if down != 0 else 0
            rsi = 100.0 - (100.0 / (1.0 + rs))
            
        return rsi

    def generate_next_price(self) -> MarketData:
        # Simple random walk with a bit of trend
        change = random.uniform(-0.005, 0.005)
        self.current_price *= (1 + change)
        self.prices.append(self.current_price)
        
        if len(self.prices) > 100:
            self.prices = self.prices[-100:]
            
        rsi = self.calculate_rsi(self.prices)
        volatility = np.std(self.prices[-10:]) / np.mean(self.prices[-10:])
        
        return MarketData(
            symbol=self.symbol,
            price=round(self.current_price, 2),
            timestamp=datetime.now(),
            rsi=round(rsi, 2),
            volatility=round(volatility, 4)
        )

# Singleton instance
market_service = MarketDataService()
