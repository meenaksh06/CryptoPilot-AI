import random
import asyncio
from datetime import datetime
from typing import List
import numpy as np
from ..models.schemas import MarketData
from ..utils.indicators import calculate_rsi, calculate_sma, calculate_ema, calculate_volatility

class MarketDataService:
    def __init__(self, symbol: str = "BTC/USDT"):
        self.symbol = symbol
        self.current_price = 65000.0
        self.prices: List[float] = [self.current_price]
        self.window_size = 14

    def generate_next_price(self) -> MarketData:
        # Simple random walk with a bit of trend
        change = random.uniform(-0.005, 0.005)
        self.current_price *= (1 + change)
        self.prices.append(self.current_price)
        
        if len(self.prices) > 200:
            self.prices = self.prices[-200:]
            
        rsi = calculate_rsi(self.prices)
        sma = calculate_sma(self.prices, 20)
        ema = calculate_ema(self.prices, 20)
        vol = calculate_volatility(self.prices)
        sentiment = random.uniform(-0.5, 0.5) # Mock AI sentiment
        
        return MarketData(
            symbol=self.symbol,
            price=round(self.current_price, 2),
            timestamp=datetime.now(),
            rsi=round(rsi, 2),
            volatility=round(vol, 4),
            sma=round(sma, 2) if sma else None,
            ema=round(ema, 2) if ema else None,
            sentiment=round(sentiment, 2)
        )

# Singleton instance
market_service = MarketDataService()
