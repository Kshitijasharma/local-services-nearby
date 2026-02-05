from pydantic import BaseModel, Field
from typing import List, Optional

class NearbyPlacesRequest(BaseModel):
    lat: float = Field(..., ge=-90, le=90)
    lng: float = Field(..., ge=-180, le=180)
    categories: List[str] = Field(..., min_items=1)
    radiusKm: int = Field(..., ge=1, le=20)
    limit: Optional[int] = Field(20, ge=1, le=50)
    sortBy: Optional[str] = "distance"
    openNow: Optional[bool] = False

class Place(BaseModel):
    id: str
    name: str
    category: str
    lat: float
    lng: float
    address: Optional[str]
    distance: Optional[int]

class NearbyPlacesResponse(BaseModel):
    results: List[Place]
