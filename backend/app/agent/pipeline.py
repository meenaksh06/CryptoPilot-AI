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
                detail = market_service.get_asset("bitcoin")
                data = detail.market_data
                decision = await decision_agent.decide(data)
                trade = None
                if decision.action != Action.HOLD:
                    trade = execution_engine.execute_trade(
                        symbol=data.symbol,
                        action=decision.action,
                        price=data.price,
                        strategy=decision.strategy,
                        reason=decision.reason
                    )
                if trade:
                    memory_store.update_memory(trade)
                portfolio = execution_engine.get_portfolio({data.symbol: data.price})
                payload = {
                    "market_data": data.dict(),
                    "decision": decision.dict(),
                    "trade": trade.dict() if trade else None,
                    "portfolio": portfolio.dict(),
                    "tracked_assets": [detail.asset.dict()],
                    "signal_state": {key: value.value for key, value in detail.signal_state.items()},
                }
                for callback in self.callbacks:
                    await callback(payload)
                await asyncio.sleep(20)
            except Exception as e:
                print(f"Error in pipeline: {e}")
                await asyncio.sleep(15)

    def stop(self):
        self.is_running = False

# Singleton
pipeline = AgentPipeline()
