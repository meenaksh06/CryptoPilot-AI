from __future__ import annotations

from copy import deepcopy
from datetime import datetime, timedelta
from typing import Any

from ..models.schemas import Action, SettingsPayload, StrategyType
from .firebase_auth import initialize_firebase

try:
    from firebase_admin import firestore
except ImportError:  # pragma: no cover
    firestore = None


def _default_user_document(user: dict[str, str]) -> dict[str, Any]:
    now = datetime.utcnow()
    settings = SettingsPayload().dict()
    positions = [
        {
            "id": "bitcoin",
            "symbol": "BTC",
            "name": "Bitcoin",
            "amount": 0.118,
            "entry_price": 61200.0,
            "current_price": 0.0,
            "allocation": 42,
            "timestamp": now.isoformat(),
        },
        {
            "id": "ethereum",
            "symbol": "ETH",
            "name": "Ethereum",
            "amount": 1.84,
            "entry_price": 3210.0,
            "current_price": 0.0,
            "allocation": 28,
            "timestamp": (now - timedelta(days=4)).isoformat(),
        },
        {
            "id": "solana",
            "symbol": "SOL",
            "name": "Solana",
            "amount": 14.5,
            "entry_price": 141.0,
            "current_price": 0.0,
            "allocation": 18,
            "timestamp": (now - timedelta(days=7)).isoformat(),
        },
        {
            "id": "chainlink",
            "symbol": "LINK",
            "name": "Chainlink",
            "amount": 42.0,
            "entry_price": 12.9,
            "current_price": 0.0,
            "allocation": 12,
            "timestamp": (now - timedelta(days=9)).isoformat(),
        },
    ]
    trades = [
        {
            "id": "trade-1",
            "symbol": "BTC",
            "asset_id": "bitcoin",
            "asset_name": "Bitcoin",
            "action": Action.BUY.value,
            "amount": 0.042,
            "price": 61200.0,
            "current_price": 0.0,
            "pnl": 92.94,
            "pnl_pct": 3.61,
            "timestamp": (now - timedelta(hours=2)).isoformat(),
            "strategy": StrategyType.RSI.value,
            "reason": "RSI oversold with recovering momentum.",
            "status": "closed",
        },
        {
            "id": "trade-2",
            "symbol": "ETH",
            "asset_id": "ethereum",
            "asset_name": "Ethereum",
            "action": Action.SELL.value,
            "amount": 1.2,
            "price": 3280.0,
            "current_price": 0.0,
            "pnl": 141.5,
            "pnl_pct": 4.32,
            "timestamp": (now - timedelta(hours=6)).isoformat(),
            "strategy": StrategyType.RSI.value,
            "reason": "Profit protection near resistance band.",
            "status": "closed",
        },
        {
            "id": "trade-3",
            "symbol": "SOL",
            "asset_id": "solana",
            "asset_name": "Solana",
            "action": Action.BUY.value,
            "amount": 8.0,
            "price": 138.5,
            "current_price": 0.0,
            "pnl": 104.2,
            "pnl_pct": 7.52,
            "timestamp": (now - timedelta(days=1)).isoformat(),
            "strategy": StrategyType.DCA.value,
            "reason": "Scheduled DCA entry during pullback.",
            "status": "closed",
        },
        {
            "id": "trade-4",
            "symbol": "ADA",
            "asset_id": "cardano",
            "asset_name": "Cardano",
            "action": Action.SELL.value,
            "amount": 1500.0,
            "price": 0.448,
            "current_price": 0.0,
            "pnl": -54.0,
            "pnl_pct": -8.04,
            "timestamp": (now - timedelta(days=3)).isoformat(),
            "strategy": StrategyType.MOMENTUM.value,
            "reason": "Breakdown below support invalidated thesis.",
            "status": "closed",
        },
        {
            "id": "trade-5",
            "symbol": "LINK",
            "asset_id": "chainlink",
            "asset_name": "Chainlink",
            "action": Action.BUY.value,
            "amount": 40.0,
            "price": 13.4,
            "current_price": 0.0,
            "pnl": 38.4,
            "pnl_pct": 6.83,
            "timestamp": (now - timedelta(days=5)).isoformat(),
            "strategy": StrategyType.DCA.value,
            "reason": "Accumulation zone held with improving breadth.",
            "status": "open",
        },
    ]
    strategy_stats = {
        StrategyType.RSI.value: {"trade_count": 2, "win_rate": 1.0, "realized_pnl": 234.44, "recent_streak": 2},
        StrategyType.DCA.value: {"trade_count": 2, "win_rate": 1.0, "realized_pnl": 142.6, "recent_streak": 2},
        StrategyType.MOMENTUM.value: {"trade_count": 1, "win_rate": 0.0, "realized_pnl": -54.0, "recent_streak": -1},
        StrategyType.HOLD.value: {"trade_count": 0, "win_rate": 0.0, "realized_pnl": 0.0, "recent_streak": 0},
        StrategyType.HYBRID.value: {"trade_count": 0, "win_rate": 0.0, "realized_pnl": 0.0, "recent_streak": 0},
    }

    return {
        "profile": {
            "uid": user["uid"],
            "email": user.get("email", ""),
            "name": user.get("name", "Trader"),
        },
        "settings": settings,
        "portfolio": {
            "cash_balance": 12500.0,
            "positions": positions,
            "trade_history": trades,
            "strategy_stats": strategy_stats,
        },
    }


class InMemoryPersistence:
    def __init__(self):
        self._users: dict[str, dict[str, Any]] = {}

    def ensure_user(self, user: dict[str, str]) -> dict[str, Any]:
        if user["uid"] not in self._users:
            self._users[user["uid"]] = _default_user_document(user)
        return deepcopy(self._users[user["uid"]])

    def save_user(self, uid: str, document: dict[str, Any]) -> None:
        self._users[uid] = deepcopy(document)


class FirestorePersistence:
    def __init__(self):
        self._db = firestore.client()

    def ensure_user(self, user: dict[str, str]) -> dict[str, Any]:
        ref = self._db.collection("users").document(user["uid"])
        snapshot = ref.get()
        if not snapshot.exists:
            document = _default_user_document(user)
            ref.set(document)
            return document
        return snapshot.to_dict()

    def save_user(self, uid: str, document: dict[str, Any]) -> None:
        self._db.collection("users").document(uid).set(document, merge=True)


class UserRepository:
    def __init__(self):
        self._fallback = InMemoryPersistence()
        self._firestore = None
        if initialize_firebase() and firestore is not None:
            self._firestore = FirestorePersistence()

    @property
    def backend(self):
        return self._firestore or self._fallback

    def ensure_user(self, user: dict[str, str]) -> dict[str, Any]:
        return self.backend.ensure_user(user)

    def update_settings(self, user: dict[str, str], payload: SettingsPayload) -> dict[str, Any]:
        document = self.ensure_user(user)
        document["settings"] = payload.dict()
        self.backend.save_user(user["uid"], document)
        return document["settings"]


user_repository = UserRepository()
