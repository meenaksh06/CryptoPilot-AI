import asyncio
import json
from ..services.market_data import market_service
from ..agent.decision_agent import decision_agent
from ..execution.engine import execution_engine
from ..memory.store import memory_store
from ..models.schemas import Action

class AgentPipeline:
    def __init__(self):
        self.is_running = False
        self.callbacks = []

    def register_callback(self, callback):
        self.callbacks.append(callback)

    async def run(self):
        self.is_running = True
        while self.is_running:
            try:
                # 1. Fetch Market Data
                data = market_service.generate_next_price()
                
                # 2. Agent Decision
                decision = await decision_agent.decide(data)
                
                # 3. Execution (if action is BUY/SELL)
                trade = None
                if decision.action != Action.HOLD:
                    trade = execution_engine.execute_trade(
                        symbol=data.symbol,
                        action=decision.action,
                        price=data.price,
                        strategy=decision.strategy,
                        reason=decision.reason
                    )
                
                # 4. Memory Update
                if trade:
                    memory_store.update_memory(trade)
                
                # 5. Notify Callbacks (e.g., WebSocket)
                portfolio = execution_engine.get_portfolio({data.symbol: data.price})
                
                payload = {
                    "market_data": data.dict(),
                    "decision": decision.dict(),
                    "trade": trade.dict() if trade else None,
                    "portfolio": portfolio.dict()
                }
                
                for callback in self.callbacks:
                    await callback(payload)
                
                await asyncio.sleep(2) # Tick every 2 seconds
                
            except Exception as e:
                print(f"Error in pipeline: {e}")
                await asyncio.sleep(5)

    def stop(self):
        self.is_running = False

# Singleton
pipeline = AgentPipeline()
