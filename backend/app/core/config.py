import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    GEOAPIFY_KEY: str = os.getenv("GEOAPIFY_API_KEY", "")
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379")
    CACHE_TTL_SECONDS: int = int(os.getenv("CACHE_TTL_SECONDS", "300"))

settings = Settings()

print("CONFIG LOADED FROM:", __file__)
print("HAS SETTINGS:", "settings" in globals())
