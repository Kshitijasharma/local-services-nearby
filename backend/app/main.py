from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import places, location

app = FastAPI(title="LocalFind Backend")

# --------------------------------------------------
# CORS CONFIG (Temporary Debug Version)
# --------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],          # allow all origins temporarily
    allow_credentials=False,      # must be False when using "*"
    allow_methods=["*"],
    allow_headers=["*"],
)

# --------------------------------------------------
# ROUTES
# --------------------------------------------------

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

# backend running at '/'

@app.get("/")
def root():
    return {
        "status": "backend running at root endpoint",
        
    }