import asyncio
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from .agent.pipeline import pipeline
from .execution.engine import execution_engine
from .services.market_data import market_service
import json

app = FastAPI(title="CryptoPilot AI API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

active_connections = []

async def broadcast_agent_update(payload):
    # Convert datetime to string for JSON serialization
    def datetime_handler(x):
        if hasattr(x, 'isoformat'):
            return x.isoformat()
        return str(x)
        
    message = json.dumps(payload, default=datetime_handler)
    for connection in active_connections:
        try:
            await connection.send_text(message)
        except:
            active_connections.remove(connection)

@app.on_event("startup")
async def startup_event():
    pipeline.register_callback(broadcast_agent_update)
    asyncio.create_task(pipeline.run())

@app.get("/health")
async def health():
    return {"status": "alive"}

@app.get("/portfolio")
async def get_portfolio():
    # Use the last known price from service
    data = market_service.generate_next_price()
    return execution_engine.get_portfolio({data.symbol: data.price})

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    active_connections.append(websocket)
    try:
        while True:
            # Just keep the connection open
            await websocket.receive_text()
    except WebSocketDisconnect:
        active_connections.remove(websocket)
