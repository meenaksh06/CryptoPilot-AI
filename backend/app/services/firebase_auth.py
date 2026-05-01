from __future__ import annotations

from functools import lru_cache

from fastapi import Depends, Header, HTTPException, status

from ..config.settings import Settings, get_settings

try:
    import firebase_admin
    from firebase_admin import auth, credentials
except ImportError:  # pragma: no cover - optional in local setup before install
    firebase_admin = None
    auth = None
    credentials = None


@lru_cache(maxsize=1)
def initialize_firebase() -> bool:
    settings = get_settings()
    if firebase_admin is None:
      return False

    if firebase_admin._apps:
        return True

    credential = None
    if settings.firebase_credentials_json:
        credential = credentials.Certificate(settings.firebase_credentials_json)
    elif settings.firebase_credentials_path:
        credential = credentials.Certificate(settings.firebase_credentials_path)

    if not credential:
        return False

    firebase_admin.initialize_app(
        credential,
        {"projectId": settings.firebase_project_id} if settings.firebase_project_id else None,
    )
    return True


def get_current_user(
    authorization: str | None = Header(default=None),
    settings: Settings = Depends(get_settings),
) -> dict[str, str]:
    configured = initialize_firebase()
    if not authorization:
        if settings.dev_bypass_auth and not configured:
            return {
                "uid": "demo-user",
                "email": "demo@cryptopilot.ai",
                "name": "Demo User",
            }
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing authorization header")

    scheme, _, token = authorization.partition(" ")
    if scheme.lower() != "bearer" or not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid authorization header")

    if not configured:
        if settings.dev_bypass_auth:
            return {
                "uid": "demo-user",
                "email": "demo@cryptopilot.ai",
                "name": "Demo User",
            }
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="Firebase auth is not configured")

    try:
        decoded = auth.verify_id_token(token)
    except Exception as exc:  # pragma: no cover - depends on external Firebase
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token") from exc

    return {
        "uid": decoded["uid"],
        "email": decoded.get("email", ""),
        "name": decoded.get("name", decoded.get("email", "Trader")),
    }
