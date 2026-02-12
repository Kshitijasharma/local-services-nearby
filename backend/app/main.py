from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import places, location

app = FastAPI(title="LocalFind Backend")

# --------------------------------------------------
# CORS CONFIG
# --------------------------------------------------

import os

# Get allowed origins from env var (comma-separated), default to "*" if not set
# In production, you should set this to your Vercel frontend URL
allowed_origins_env = os.getenv("ALLOWED_ORIGINS")
if allowed_origins_env:
    origins = [origin.strip() for origin in allowed_origins_env.split(",")]
else:
    origins = ["*"] # Default to allow all if not specified (for dev/testing)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --------------------------------------------------
# ROUTES
# --------------------------------------------------
# Routers already define their own prefixes
# DO NOT add them again here

app.include_router(places.router)
app.include_router(location.router)

# --------------------------------------------------
# HEALTH CHECK
# --------------------------------------------------

@app.get("/health")
def health():
    return {
        "status": "backend running",
        "cors": "enabled"
    }
