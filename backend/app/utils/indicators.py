import numpy as np
from typing import List, Optional

def calculate_rsi(prices: List[float], period: int = 14) -> float:
    if len(prices) < period + 1:
        return 50.0
    
    deltas = np.diff(prices)
    seed = deltas[:period]
    up = seed[seed >= 0].sum() / period
    down = -seed[seed < 0].sum() / period
    rs = up / down if down != 0 else 0
    rsi = 100.0 - (100.0 / (1.0 + rs))

    for i in range(period, len(deltas)):
        delta = deltas[i]
        if delta > 0:
            upval, downval = delta, 0.0
        else:
            upval, downval = 0.0, -delta

        up = (up * (period - 1) + upval) / period
        down = (down * (period - 1) + downval) / period
        rs = up / down if down != 0 else 0
        rsi = 100.0 - (100.0 / (1.0 + rs))
        
    return float(rsi)

def calculate_sma(prices: List[float], period: int = 10) -> Optional[float]:
    if len(prices) < period:
        return None
    return float(np.mean(prices[-period:]))

def calculate_ema(prices: List[float], period: int = 10) -> Optional[float]:
    if len(prices) < period:
        return None
    alpha = 2 / (period + 1)
    ema = prices[0]
    for price in prices[1:]:
        ema = (price * alpha) + (ema * (1 - alpha))
    return float(ema)

def calculate_volatility(prices: List[float], period: int = 10) -> float:
    if len(prices) < period:
        return 0.0
    return float(np.std(prices[-period:]) / np.mean(prices[-period:]))
