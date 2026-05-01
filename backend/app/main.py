import asyncio
import json

from fastapi import Depends, FastAPI, HTTPException, Query, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

from .agent.pipeline import pipeline
from .config.settings import get_settings
from .models.schemas import DashboardOverview, SettingsPayload
from .services.analytics import build_portfolio_analytics
from .services.coingecko import market_service
from .services.firebase_auth import get_current_user
from .services.persistence import user_repository

settings = get_settings()
app = FastAPI(title=settings.app_name)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"] if settings.frontend_origin == "*" else [settings.frontend_origin],
    allow_methods=["*"],
    allow_headers=["*"],
)

active_connections: list[WebSocket] = []


def _price_map_for_user(document: dict) -> dict[str, float]:
    asset_ids = [item["id"] for item in document["portfolio"].get("positions", [])]
    asset_ids.extend(item["asset_id"] for item in document["portfolio"].get("trade_history", []))
    unique_ids = list(dict.fromkeys(asset_ids))
    if not unique_ids:
        return {}
    markets = market_service.get_markets(asset_ids=unique_ids, per_page=len(unique_ids))
    return {asset.id: asset.price for asset in markets}


async def broadcast_agent_update(payload):
    def datetime_handler(value):
        if hasattr(value, "isoformat"):
            return value.isoformat()
        return str(value)

    message = json.dumps(payload, default=datetime_handler)
    stale = []
    for connection in active_connections:
        try:
            await connection.send_text(message)
        except Exception:
            stale.append(connection)
    for connection in stale:
        if connection in active_connections:
            active_connections.remove(connection)


@app.on_event("startup")
async def startup_event():
    pipeline.register_callback(broadcast_agent_update)
    asyncio.create_task(pipeline.run())


@app.get("/health")
async def health():
    return {"status": "alive"}


@app.get("/auth/me")
async def auth_me(user: dict = Depends(get_current_user)):
    document = user_repository.ensure_user(user)
    return document["profile"]


@app.get("/markets")
async def get_markets(
    search: str | None = None,
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=25, ge=1, le=100),
    sort: str = Query(default="market_cap_desc"),
    _: dict = Depends(get_current_user),
):
    global_data = market_service.get_global()
    assets = market_service.get_markets(page=page, per_page=limit, search=search, sort=sort)
    gainers = sorted(assets, key=lambda asset: asset.change_24h, reverse=True)[:5]
    losers = sorted(assets, key=lambda asset: asset.change_24h)[:5]
    return {
        "assets": assets,
        "page": page,
        "limit": limit,
        "search": search or "",
        "sort": sort,
        "global": {
            "market_cap_usd": global_data.get("total_market_cap", {}).get("usd", 0),
            "volume_usd": global_data.get("total_volume", {}).get("usd", 0),
            "btc_dominance": global_data.get("market_cap_percentage", {}).get("btc", 0),
            "active_cryptocurrencies": global_data.get("active_cryptocurrencies", 0),
            "markets": global_data.get("markets", 0),
        },
        "top_gainers": gainers,
        "top_losers": losers,
    }


@app.get("/markets/{asset_id}")
async def get_market_detail(asset_id: str, _: dict = Depends(get_current_user)):
    return market_service.get_asset(asset_id)


@app.get("/markets/{asset_id}/history")
async def get_market_history(asset_id: str, range: str = Query(default="7d", pattern="^(7d|30d)$"), _: dict = Depends(get_current_user)):
    return {
        "asset_id": asset_id,
        "range": range,
        "points": market_service.get_history(asset_id, range),
    }


@app.get("/dashboard/overview", response_model=DashboardOverview)
async def get_dashboard_overview(
    asset_id: str = Query(default="bitcoin"),
    range: str = Query(default="7d", pattern="^(7d|30d)$"),
    user: dict = Depends(get_current_user),
):
    document = user_repository.ensure_user(user)
    price_map = _price_map_for_user(document)
    analytics = build_portfolio_analytics(document, price_map)
    featured_assets = market_service.get_markets(page=1, per_page=8)
    top_movers = sorted(featured_assets, key=lambda asset: abs(asset.change_24h), reverse=True)[:4]
    selected_asset = market_service.get_asset(asset_id)
    selected_history = market_service.get_history(asset_id, range)
    return DashboardOverview(
        featured_assets=featured_assets,
        selected_asset=selected_asset,
        selected_history=selected_history,
        portfolio=analytics.summary,
        strategy_insights=analytics.strategy_performance,
        top_movers=top_movers,
    )


@app.get("/portfolio")
async def get_portfolio(user: dict = Depends(get_current_user)):
    document = user_repository.ensure_user(user)
    price_map = _price_map_for_user(document)
    analytics = build_portfolio_analytics(document, price_map)
    return {
        "summary": analytics.summary,
        "holdings": analytics.holdings,
        "history": analytics.history,
    }


@app.get("/portfolio/analytics")
async def get_portfolio_analytics(user: dict = Depends(get_current_user)):
    document = user_repository.ensure_user(user)
    price_map = _price_map_for_user(document)
    return build_portfolio_analytics(document, price_map)


@app.get("/portfolio/history")
async def get_portfolio_history(user: dict = Depends(get_current_user)):
    document = user_repository.ensure_user(user)
    price_map = _price_map_for_user(document)
    return build_portfolio_analytics(document, price_map).history


@app.get("/portfolio/strategies")
async def get_portfolio_strategies(user: dict = Depends(get_current_user)):
    document = user_repository.ensure_user(user)
    price_map = _price_map_for_user(document)
    analytics = build_portfolio_analytics(document, price_map)
    return {
        "strategy_performance": analytics.strategy_performance,
        "future_opportunities": analytics.future_opportunities,
    }


@app.get("/settings")
async def get_settings_payload(user: dict = Depends(get_current_user)):
    document = user_repository.ensure_user(user)
    return document["settings"]


@app.patch("/settings")
async def patch_settings(payload: SettingsPayload, user: dict = Depends(get_current_user)):
    return user_repository.update_settings(user, payload)


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    active_connections.append(websocket)
    try:
        while True:
            try:
                message = await websocket.receive_text()
                if message == "ping":
                    await websocket.send_text(json.dumps({"type": "pong"}))
            except RuntimeError:
                break
    except WebSocketDisconnect:
        pass
    finally:
        if websocket in active_connections:
            active_connections.remove(websocket)
