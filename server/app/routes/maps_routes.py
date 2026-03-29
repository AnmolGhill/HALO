from fastapi import APIRouter, HTTPException, Query
from typing import Optional
import httpx
from app.config import settings

router = APIRouter(prefix="/api/maps", tags=["🗺️ Google Maps"])


@router.get("/geocode")
async def geocode(query: str = Query(..., description="Address or place to geocode"),
                  region: Optional[str] = Query(None, description="Region bias e.g. 'in' for India")):
    """
    Proxy to Google Geocoding API to keep the server key private.
    """
    if not settings.GOOGLE_MAPS_API_KEY:
        raise HTTPException(status_code=500, detail="GOOGLE_MAPS_API_KEY is not configured on the server")

    params = {
        "address": query,
        "key": settings.GOOGLE_MAPS_API_KEY,
    }
    if region:
        params["region"] = region

    url = "https://maps.googleapis.com/maps/api/geocode/json"

    async with httpx.AsyncClient(timeout=10) as client:
        try:
            resp = await client.get(url, params=params)
            data = resp.json()
        except httpx.HTTPError as e:
            raise HTTPException(status_code=502, detail=f"Error contacting Google Geocoding API: {e}")

    if data.get("status") not in ("OK", "ZERO_RESULTS"):
        raise HTTPException(status_code=502, detail=data.get("error_message", data.get("status", "Geocoding failed")))

    return data
