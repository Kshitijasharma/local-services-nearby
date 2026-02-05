from fastapi import APIRouter, Query, HTTPException
from app.core.geoapify import geocode_city, reverse_geocode
from app.core.redis import redis_client
from app.core.config import settings
import json

router = APIRouter(prefix="/location", tags=["Location"])

# ----------------------------
# City -> Coordinates
# ----------------------------
@router.get("/geocode")
async def geocode(city: str = Query(..., min_length=2)):
    cache_key = f"geocode:{city.lower()}"

    if redis_client:
        try:
            cached = redis_client.get(cache_key)
            if cached:
                return json.loads(cached)
        except Exception:
            pass

    try:
        data = await geocode_city(city)
    except Exception:
        raise HTTPException(status_code=502, detail="Geoapify failed")

    features = data.get("features")
    if not features:
        raise HTTPException(status_code=404, detail="City not found")

    coords = features[0]["geometry"]["coordinates"]
    result = {
        "lat": coords[1],
        "lng": coords[0]
    }

    if redis_client:
        try:
            redis_client.setex(
                cache_key,
                settings.CACHE_TTL_SECONDS,
                json.dumps(result)
            )
        except Exception:
            pass

    return result

# ----------------------------
# Coordinates -> City
# ----------------------------
@router.get("/reverse")
async def reverse(lat: float, lng: float):
    cache_key = f"reverse:{lat}:{lng}"

    if redis_client:
        try:
            cached = redis_client.get(cache_key)
            if cached:
                return json.loads(cached)
        except Exception:
            pass

    try:
        data = await reverse_geocode(lat, lng)
    except Exception:
        raise HTTPException(status_code=502, detail="Geoapify failed")

    features = data.get("features")
    if not features:
        raise HTTPException(status_code=404, detail="Location not found")

    props = features[0]["properties"]

    result = {
        "city": props.get("city")
        or props.get("town")
        or props.get("village")
        or props.get("state"),
        "formatted": props.get("formatted")
    }

    if redis_client:
        try:
            redis_client.setex(
                cache_key,
                settings.CACHE_TTL_SECONDS,
                json.dumps(result)
            )
        except Exception:
            pass

    return result
