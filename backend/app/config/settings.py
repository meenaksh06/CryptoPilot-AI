import json
import os
from dataclasses import dataclass
from functools import lru_cache
from typing import Any


def _bool_env(name: str, default: bool = False) -> bool:
    value = os.getenv(name)
    if value is None:
        return default
    return value.lower() in {"1", "true", "yes", "on"}


def _json_env(name: str) -> dict[str, Any] | None:
    raw = os.getenv(name)
    if not raw:
        return None
    try:
        return json.loads(raw)
    except json.JSONDecodeError:
        return None


@dataclass(frozen=True)
class Settings:
    app_name: str = os.getenv("APP_NAME", "CryptoPilot AI API")
    coingecko_base_url: str = os.getenv("COINGECKO_BASE_URL", "https://api.coingecko.com/api/v3")
    coingecko_api_key: str | None = os.getenv("COINGECKO_API_KEY")
    frontend_origin: str = os.getenv("FRONTEND_ORIGIN", "*")
    firebase_project_id: str | None = os.getenv("FIREBASE_PROJECT_ID")
    firebase_credentials_path: str | None = os.getenv("FIREBASE_CREDENTIALS_PATH")
    firebase_credentials_json: dict[str, Any] | None = _json_env("FIREBASE_CREDENTIALS_JSON")
    dev_bypass_auth: bool = _bool_env("DEV_BYPASS_AUTH", True)


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    return Settings()
