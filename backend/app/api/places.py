from fastapi import APIRouter, HTTPException
from app.schemas.places import NearbyPlacesRequest, NearbyPlacesResponse, Place
from app.core.redis import redis_client
from app.core.geoapify import nearby_places
from app.core.category_map import CATEGORY_MAP
from app.core.config import settings

import json
import hashlib
from typing import List

router = APIRouter(prefix="/places", tags=["Places"])

# ----------------------------
# Helpers
# ----------------------------

def build_cache_key(payload: NearbyPlacesRequest) -> str:
    """
    Generate a stable Redis cache key for this request
    """
    raw = f"{payload.lat}:{payload.lng}:{sorted(payload.categories)}:{payload.radiusKm}:{payload.limit}:{payload.sortBy}:{payload.openNow}"
    return "places:" + hashlib.md5(raw.encode()).hexdigest()


def safe_get(key: str):
    if not redis_client:
        return None
    try:
        val = redis_client.get(key)
        if val:
            return json.loads(val)
    except Exception:
        return None
    return None


def safe_set(key: str, value: dict):
    if not redis_client:
        return
    try:
        redis_client.setex(
            key,
            settings.CACHE_TTL_SECONDS,
            json.dumps(value)
        )
    except Exception:
        pass


# ----------------------------
# Route
# ----------------------------

@router.post("/nearby", response_model=NearbyPlacesResponse)
async def get_nearby_places(payload: NearbyPlacesRequest):
    """
    Returns nearby places using Geoapify + Redis caching
    """

    # ----------------------------
    # 1. Map UI categories -> Geoapify categories
    # ----------------------------
    geo_categories: List[str] = []

    for cat in payload.categories:
        if cat not in CATEGORY_MAP:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid category: {cat}"
            )
        geo_categories.extend(CATEGORY_MAP[cat])

    # Fallback categories if nothing selected
    if not geo_categories:
        geo_categories = [
            "commercial.supermarket",
            "healthcare.hospital",
            "transport.bus_station",
            "service"
        ]

    # ----------------------------
    # 2. Cache lookup
    # ----------------------------
    cache_key = build_cache_key(payload)
    cached = safe_get(cache_key)

    if cached:
        print("⚡ Redis cache hit")
        return cached

    print("🌍 Geoapify call")

    # ----------------------------
    # 3. Call Geoapify
    # ----------------------------
    try:
        data = await nearby_places(
            lat=payload.lat,
            lng=payload.lng,
            categories=geo_categories,
            radius_m=payload.radiusKm * 1000,
            limit=payload.limit or 20
        )
    except Exception as e:
        print("❌ Geoapify error:", e)
        raise HTTPException(
            status_code=502,
            detail="Geoapify service failed"
        )

    # ----------------------------
    # 4. Normalize response
    # ----------------------------
    results: List[Place] = []

    for feature in data.get("features", []):
        props = feature.get("properties", {})
        coords = feature.get("geometry", {}).get("coordinates", [None, None])

        # Skip invalid locations
        if coords[0] is None or coords[1] is None:
            continue

        # Open now filter
        if payload.openNow:
            if not props.get("opening_hours"):
                continue

        place = Place(
            id=str(props.get("place_id", "")),
            name=props.get("name", "Unknown"),
            category=(props.get("categories") or ["service"])[0],
            lat=coords[1],
            lng=coords[0],
            address=props.get("formatted", "Unknown address"),
            distance=props.get("distance", 0)
        )

        results.append(place)

    response = NearbyPlacesResponse(results=results)

    # ----------------------------
    # 5. Cache result
    # ----------------------------
    safe_set(cache_key, response.dict())

    return response
