from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import places, location

app = FastAPI(title="LocalFind Backend")

# --------------------------------------------------
# CORS CONFIG
# --------------------------------------------------

origins = [
    "http://localhost:8080",
    "http://127.0.0.1:8080",
]

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
