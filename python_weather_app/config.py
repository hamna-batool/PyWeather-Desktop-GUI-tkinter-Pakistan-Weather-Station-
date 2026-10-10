"""
Configuration module for the Python Tkinter Weather Application.
Loads environment variables from a .env file or system environment,
keeping sensitive API keys out of the main application logic.
"""

import os
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables from .env in the project directory (if present)
ENV_PATH = Path(__file__).resolve().parent / ".env"
load_dotenv(dotenv_path=ENV_PATH)


class AppConfig:
    """Centralized configuration and API endpoint settings."""

    # API Keys loaded strictly from environment variables / .env file
    OPENWEATHER_API_KEY: str = os.getenv("OPENWEATHER_API_KEY", "").strip()
    IPINFO_TOKEN: str = os.getenv("IPINFO_TOKEN", "").strip()

    # OpenWeatherMap Free Tier Endpoints (v2.5)
    CURRENT_WEATHER_URL: str = "https://api.openweathermap.org/data/2.5/weather"
    FORECAST_URL: str = "https://api.openweathermap.org/data/2.5/forecast"
    ICON_URL_TEMPLATE: str = "https://openweathermap.org/img/wn/{icon}@2x.png"

    # IP Geolocation Endpoint (ipinfo.io)
    IPINFO_URL: str = "https://ipinfo.io/json"

    # Network & UI Constants
    REQUEST_TIMEOUT_SECONDS: int = 8
    WINDOW_TITLE: str = "PyWeather Desktop — OpenWeatherMap Monitor"
    WINDOW_GEOMETRY: str = "920x740"
    MIN_WIDTH: int = 840
    MIN_HEIGHT: int = 680

    @classmethod
    def is_api_key_configured(cls) -> bool:
        """Return True if a plausible OpenWeatherMap API key is configured."""
        return bool(
            cls.OPENWEATHER_API_KEY
            and cls.OPENWEATHER_API_KEY != "your_openweathermap_api_key_here"
        )
