import httpx
from app.core.config import settings

BASE_URL = "https://api.geoapify.com/v2"

# ----------------------------
# City -> Coordinates
# ----------------------------
async def geocode_city(city: str):
    url = f"{BASE_URL}/geocode/search"
    params = {
        "text": city,
        "limit": 1,
        "apiKey": settings.GEOAPIFY_KEY
    }

    async with httpx.AsyncClient(timeout=10) as client:
        response = await client.get(url, params=params)
        response.raise_for_status()
        return response.json()

# ----------------------------
# Coordinates -> City
# ----------------------------
async def reverse_geocode(lat: float, lng: float):
    url = f"{BASE_URL}/geocode/reverse"
    params = {
        "lat": lat,
        "lon": lng,
        "apiKey": settings.GEOAPIFY_KEY
    }

    async with httpx.AsyncClient(timeout=10) as client:
        response = await client.get(url, params=params)
        response.raise_for_status()
        return response.json()

# ----------------------------
# Nearby Places
# ----------------------------
async def nearby_places(lat: float, lng: float, categories: list[str], radius_m: int, limit: int):
    url = f"{BASE_URL}/places"
    params = {
        "categories": ",".join(categories),
        "filter": f"circle:{lng},{lat},{radius_m}",
        "bias": f"proximity:{lng},{lat}",
        "limit": limit,
        "apiKey": settings.GEOAPIFY_KEY
    }

    async with httpx.AsyncClient(timeout=15) as client:
        response = await client.get(url, params=params)
        response.raise_for_status()
        return response.json()
