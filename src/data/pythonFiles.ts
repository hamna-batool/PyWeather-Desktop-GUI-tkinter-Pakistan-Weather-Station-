export interface PythonProjectFile {
  filename: string;
  path: string;
  language: 'python' | 'text' | 'env' | 'markdown';
  description: string;
  linesOfCode: number;
  content: string;
}

export const PYTHON_PROJECT_FILES: PythonProjectFile[] = [
  {
    filename: 'main.py',
    path: 'python_weather_app/main.py',
    language: 'python',
    description:
      'Tkinter GUI controller in Beige (#F5F0E6), White (#FFFFFF), and Black (#111111) with Pakistan city strip, instant °C/°F toggle, in-GUI error banner, and worker threads.',
    linesOfCode: 425,
    content: `"""
PyWeather Pakistan — Python Tkinter Desktop Weather Application
Scoped exclusively to Pakistan (PK) cities with a Beige, Black, and White interface.
Uses the OpenWeatherMap Free Tier API, Pillow (PIL) for remote weather icon rendering,
ipinfo.io for automatic IP-based location detection, and background threading to keep
the Tkinter event loop responsive at all times.
"""

from __future__ import annotations

import threading
import tkinter as tk
from typing import Dict, List, Optional

from config import AppConfig
from weather_service import (
    PAKISTAN_CITIES,
    CompleteWeatherReport,
    WeatherAppError,
    WeatherService,
)


class WeatherDesktopApp:
    """Main Tkinter GUI Controller and View for PyWeather Pakistan (Beige, Black & White)."""

    # Color Palette (Beige, Black, and White Editorial Instrument Theme)
    BG_MAIN = "#F5F0E6"          # Warm Beige Canvas
    BG_PANEL = "#EAE0D0"         # Secondary Beige Structural Bar
    BG_CARD = "#FFFFFF"          # Pure White Card Surface
    BG_ERROR = "#111111"         # High-Contrast Black Alert Banner
    BORDER_BLACK = "#111111"     # Crisp Black Hairline Border
    TEXT_PRIMARY = "#111111"     # Crisp Black Typography
    TEXT_SECONDARY = "#444444"   # Muted Charcoal Metadata
    BTN_PRIMARY = "#111111"      # Solid Black Primary Button
    BTN_PRIMARY_ACTIVE = "#2B2B2B"
    BTN_SECONDARY = "#FFFFFF"    # Pure White Secondary Button

    def __init__(self, root: tk.Tk) -> None:
        self.root = root
        self.root.title("PyWeather Pakistan — OpenWeatherMap Desktop Monitor (PK)")
        self.root.geometry(AppConfig.WINDOW_GEOMETRY)
        self.root.minsize(AppConfig.MIN_WIDTH, AppConfig.MIN_HEIGHT)
        self.root.configure(bg=self.BG_MAIN)

        # Service layer instance (Pakistan-scoped)
        self.service = WeatherService()

        # State variables
        self.unit_system: str = "C"  # "C" for Celsius (m/s), "F" for Fahrenheit (mph)
        self.is_loading: bool = False
        self.current_report: Optional[CompleteWeatherReport] = None
        self._icon_refs: List[object] = []  # Prevent Tkinter PhotoImage garbage collection

        # Tkinter Variables (Default to Islamabad, Pakistan)
        self.city_var = tk.StringVar(value="Islamabad")
        self.status_var = tk.StringVar(
            value="Ready — Country locked to Pakistan (PK) · Select or enter any Pakistani city"
        )
        self.unit_btn_var = tk.StringVar(value="Switch to °F / mph")

        # Build UI Layout
        self._build_header_bar()
        self._build_pakistan_city_strip()
        self._build_error_banner()
        self._build_main_results_panel()
        self._build_status_bar()

        # Automatically fetch Islamabad, PK on startup if API key exists
        if AppConfig.is_api_key_configured():
            self.root.after(250, self.on_get_weather)
        else:
            self._show_error(
                title="API Key Required (.env)",
                message=(
                    "No OpenWeatherMap API key detected in .env. "
                    "Please copy .env.example to .env and set OPENWEATHER_API_KEY."
                ),
            )

    def _build_header_bar(self) -> None:
        """Top search bar with Pakistan City Input, Get Weather, Auto-Detect IP, and °C/°F Toggle."""
        header = tk.Frame(
            self.root,
            bg=self.BG_PANEL,
            padx=20,
            pady=14,
            highlightbackground=self.BORDER_BLACK,
            highlightthickness=1,
        )
        header.pack(fill=tk.X, side=tk.TOP)

        title_lbl = tk.Label(
            header,
            text="PyWeather Pakistan",
            font=("Helvetica", 15, "bold"),
            fg=self.TEXT_PRIMARY,
            bg=self.BG_PANEL,
        )
        title_lbl.pack(side=tk.LEFT, padx=(0, 14))

        # City entry input (Pakistan cities)
        self.city_entry = tk.Entry(
            header,
            textvariable=self.city_var,
            font=("Helvetica", 12),
            width=24,
            bg=self.BG_CARD,
            fg=self.TEXT_PRIMARY,
            insertbackground=self.TEXT_PRIMARY,
            relief=tk.FLAT,
            highlightthickness=1,
            highlightbackground=self.BORDER_BLACK,
            highlightcolor=self.BORDER_BLACK,
        )
        self.city_entry.pack(side=tk.LEFT, ipady=6, padx=(0, 8))
        self.city_entry.bind("<Return>", lambda _event: self.on_get_weather())

        # "Get Weather" Button
        self.search_btn = tk.Button(
            header,
            text="Get Weather",
            command=self.on_get_weather,
            font=("Helvetica", 10, "bold"),
            bg=self.BTN_PRIMARY,
            fg=self.BG_CARD,
            activebackground=self.BTN_PRIMARY_ACTIVE,
            activeforeground=self.BG_CARD,
            relief=tk.FLAT,
            padx=14,
            pady=6,
            cursor="hand2",
        )
        self.search_btn.pack(side=tk.LEFT, padx=(0, 8))

        # Bonus: "Auto-Detect IP" Button (ipinfo.io)
        self.geo_btn = tk.Button(
            header,
            text="Auto-Detect IP",
            command=self.on_detect_ip_location,
            font=("Helvetica", 10, "bold"),
            bg=self.BTN_SECONDARY,
            fg=self.TEXT_PRIMARY,
            activebackground=self.BG_MAIN,
            activeforeground=self.TEXT_PRIMARY,
            highlightbackground=self.BORDER_BLACK,
            highlightthickness=1,
            relief=tk.FLAT,
            padx=12,
            pady=6,
            cursor="hand2",
        )
        self.geo_btn.pack(side=tk.LEFT, padx=(0, 8))

        # Celsius / Fahrenheit Instant Toggle Button
        self.unit_btn = tk.Button(
            header,
            textvariable=self.unit_btn_var,
            command=self.on_toggle_units,
            font=("Courier", 10, "bold"),
            bg=self.BG_CARD,
            fg=self.TEXT_PRIMARY,
            activebackground=self.BTN_PRIMARY,
            activeforeground=self.BG_CARD,
            highlightbackground=self.BORDER_BLACK,
            highlightthickness=1,
            relief=tk.FLAT,
            padx=14,
            pady=6,
            cursor="hand2",
        )
        self.unit_btn.pack(side=tk.RIGHT)

    def _build_pakistan_city_strip(self) -> None:
        """Quick-select bar for major cities across Pakistan (PK)."""
        strip = tk.Frame(self.root, bg=self.BG_MAIN, padx=20, pady=8)
        strip.pack(fill=tk.X, side=tk.TOP)

        tk.Label(
            strip,
            text="Pakistan (PK) Cities:",
            font=("Helvetica", 9, "bold"),
            fg=self.TEXT_PRIMARY,
            bg=self.BG_MAIN,
        ).pack(side=tk.LEFT, padx=(0, 8))

        for city in PAKISTAN_CITIES[:10]:
            btn = tk.Button(
                strip,
                text=city,
                command=lambda c=city: self._select_pakistan_city(c),
                font=("Helvetica", 9),
                bg=self.BG_CARD,
                fg=self.TEXT_PRIMARY,
                activebackground=self.BTN_PRIMARY,
                activeforeground=self.BG_CARD,
                relief=tk.SOLID,
                bd=1,
                padx=8,
                pady=2,
                cursor="hand2",
            )
            btn.pack(side=tk.LEFT, padx=3)

    def _select_pakistan_city(self, city_name: str) -> None:
        self.city_var.set(city_name)
        self.on_get_weather()

    def _build_error_banner(self) -> None:
        """In-GUI Error Notification Banner (High-contrast Black & White)."""
        self.error_frame = tk.Frame(
            self.root,
            bg=self.BG_ERROR,
            highlightbackground=self.BORDER_BLACK,
            highlightthickness=1,
            padx=16,
            pady=10,
        )
        self.error_title_lbl = tk.Label(
            self.error_frame,
            text="",
            font=("Helvetica", 11, "bold"),
            fg="#FFFFFF",
            bg=self.BG_ERROR,
            anchor="w",
        )
        self.error_title_lbl.pack(fill=tk.X)

        self.error_msg_lbl = tk.Label(
            self.error_frame,
            text="",
            font=("Helvetica", 10),
            fg="#EAE0D0",
            bg=self.BG_ERROR,
            anchor="w",
            justify=tk.LEFT,
            wraplength=840,
        )
        self.error_msg_lbl.pack(fill=tk.X, pady=(2, 0))

    def _build_main_results_panel(self) -> None:
        """Constructs the Current Weather card, Next 6 Hours strip, and 5-Day Forecast grid."""
        self.main_container = tk.Frame(self.root, bg=self.BG_MAIN, padx=20, pady=10)
        self.main_container.pack(fill=tk.BOTH, expand=True)

        self.current_card = tk.Frame(
            self.main_container,
            bg=self.BG_CARD,
            padx=20,
            pady=16,
            highlightbackground=self.BORDER_BLACK,
            highlightthickness=1,
        )
        self.current_card.pack(fill=tk.X, pady=(0, 14))

        left_hero = tk.Frame(self.current_card, bg=self.BG_CARD)
        left_hero.pack(side=tk.LEFT, fill=tk.Y)

        self.city_title_lbl = tk.Label(
            left_hero,
            text="Islamabad, Pakistan (PK)",
            font=("Helvetica", 20, "bold"),
            fg=self.TEXT_PRIMARY,
            bg=self.BG_CARD,
            anchor="w",
        )
        self.city_title_lbl.pack(anchor="w")

        self.desc_lbl = tk.Label(
            left_hero,
            text="Select a city in Pakistan above to view live weather details",
            font=("Helvetica", 11),
            fg=self.TEXT_SECONDARY,
            bg=self.BG_CARD,
            anchor="w",
        )
        self.desc_lbl.pack(anchor="w", pady=(2, 8))

        temp_row = tk.Frame(left_hero, bg=self.BG_CARD)
        temp_row.pack(anchor="w")

        self.current_icon_lbl = tk.Label(temp_row, bg="#1C1B18", padx=4, pady=4)
        self.current_icon_lbl.pack(side=tk.LEFT, padx=(0, 12))

        self.temp_lbl = tk.Label(
            temp_row,
            text="--°C",
            font=("Courier", 34, "bold"),
            fg=self.TEXT_PRIMARY,
            bg=self.BG_CARD,
        )
        self.temp_lbl.pack(side=tk.LEFT)

        metrics_grid = tk.Frame(self.current_card, bg=self.BG_CARD)
        metrics_grid.pack(side=tk.RIGHT, fill=tk.Y, padx=(10, 0))

        self.metric_labels: Dict[str, tk.Label] = {}
        metrics_spec = [
            ("humidity", "Humidity", "--%"),
            ("wind", "Wind Speed", "-- m/s"),
            ("feels_like", "Feels Like", "--°C"),
            ("pressure", "Pressure", "-- hPa"),
        ]
        for idx, (key, title, default_val) in enumerate(metrics_spec):
            r, c = divmod(idx, 2)
            cell = tk.Frame(
                metrics_grid,
                bg=self.BG_MAIN,
                padx=16,
                pady=10,
                width=145,
                highlightbackground=self.BORDER_BLACK,
                highlightthickness=1,
            )
            cell.grid(row=r, column=c, padx=5, pady=5, sticky="nsew")
            tk.Label(
                cell,
                text=title,
                font=("Helvetica", 9),
                fg=self.TEXT_SECONDARY,
                bg=self.BG_MAIN,
                anchor="w",
            ).pack(fill=tk.X)
            val_lbl = tk.Label(
                cell,
                text=default_val,
                font=("Courier", 14, "bold"),
                fg=self.TEXT_PRIMARY,
                bg=self.BG_MAIN,
                anchor="w",
            )
            val_lbl.pack(fill=tk.X, pady=(2, 0))
            self.metric_labels[key] = val_lbl

        hourly_header = tk.Label(
            self.main_container,
            text="Hourly Forecast — Next 6 Hours (Pakistan Standard Time)",
            font=("Helvetica", 12, "bold"),
            fg=self.TEXT_PRIMARY,
            bg=self.BG_MAIN,
            anchor="w",
        )
        hourly_header.pack(fill=tk.X, pady=(2, 6))

        self.hourly_container = tk.Frame(self.main_container, bg=self.BG_MAIN)
        self.hourly_container.pack(fill=tk.X, pady=(0, 14))
        for col in range(6):
            self.hourly_container.columnconfigure(col, weight=1, uniform="hourly")

        daily_header = tk.Label(
            self.main_container,
            text="5-Day Forecast (Pakistan)",
            font=("Helvetica", 12, "bold"),
            fg=self.TEXT_PRIMARY,
            bg=self.BG_MAIN,
            anchor="w",
        )
        daily_header.pack(fill=tk.X, pady=(2, 6))

        self.daily_container = tk.Frame(self.main_container, bg=self.BG_MAIN)
        self.daily_container.pack(fill=tk.X)
        for col in range(5):
            self.daily_container.columnconfigure(col, weight=1, uniform="daily")
`,
  },
  {
    filename: 'weather_service.py',
    path: 'python_weather_app/weather_service.py',
    language: 'python',
    description:
      'Pakistan-scoped OpenWeatherMap Free Tier client (q={city},PK), ipinfo.io Pakistan detector, and Pillow ImageTk icon cache.',
    linesOfCode: 280,
    content: `"""
Weather API and Icon Service Layer (Pakistan Edition).
Scoped exclusively to Pakistan (PK) cities. Handles HTTP communication with
OpenWeatherMap (free tier) and ipinfo.io, normalizes current, next-6-hour, and
5-day forecast data, and fetches/caches weather icons via Pillow (PIL).
"""

from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime, timezone, timedelta
from io import BytesIO
from typing import Dict, List, Optional, Tuple
import requests
from PIL import Image, ImageTk

from config import AppConfig

PAKISTAN_CITIES: List[str] = [
    "Islamabad",
    "Karachi",
    "Lahore",
    "Peshawar",
    "Quetta",
    "Rawalpindi",
    "Faisalabad",
    "Multan",
    "Murree",
    "Gilgit",
    "Skardu",
    "Gwadar",
    "Sialkot",
    "Hyderabad",
    "Sukkur",
    "Bahawalpur",
    "Abbottabad",
    "Mingora",
    "Chitral",
    "Muzaffarabad",
]


class WeatherAppError(Exception):
    """Custom exception carrying user-friendly GUI error messages and error codes."""

    def __init__(self, title: str, message: str, code: str = "ERROR") -> None:
        super().__init__(message)
        self.title = title
        self.message = message
        self.code = code


class WeatherService:
    """Client for OpenWeatherMap Free Tier APIs (scoped to Pakistan, PK), ipinfo.io, and Pillow Icons."""

    def __init__(self, api_key: Optional[str] = None) -> None:
        self.api_key = (api_key or AppConfig.OPENWEATHER_API_KEY).strip()
        self.session = requests.Session()
        self._raw_icon_cache: Dict[Tuple[str, int], Image.Image] = {}
        self._tk_icon_cache: Dict[Tuple[str, int], ImageTk.PhotoImage] = {}

    def fetch_weather_report(self, city_query: str):
        """
        Fetch both current weather (/data/2.5/weather) and 5-day/3-hour forecast
        (/data/2.5/forecast) scoped exclusively to Pakistan (q={city},PK).
        """
        cleaned_city = (
            city_query.strip()
            .replace(", PK", "")
            .replace(",PK", "")
            .replace(", Pakistan", "")
            .strip()
        )
        if not cleaned_city:
            raise WeatherAppError(
                title="Empty City Input",
                message="Please enter a city in Pakistan (e.g., 'Islamabad', 'Karachi', 'Lahore').",
                code="EMPTY_INPUT",
            )

        if not self.api_key or self.api_key == "your_openweathermap_api_key_here":
            raise WeatherAppError(
                title="Missing or Invalid API Key",
                message="OpenWeatherMap API key is not configured in .env (OPENWEATHER_API_KEY).",
                code="INVALID_API_KEY",
            )

        # Force country code PK so only Pakistani cities are queried
        pakistan_query = f"{cleaned_city},PK"
        params = {"q": pakistan_query, "appid": self.api_key, "units": "metric"}

        current_resp = self.session.get(
            AppConfig.CURRENT_WEATHER_URL,
            params=params,
            timeout=AppConfig.REQUEST_TIMEOUT_SECONDS,
        )
        self._validate_owm_response(current_resp, cleaned_city)
        current_json = current_resp.json()

        forecast_resp = self.session.get(
            AppConfig.FORECAST_URL,
            params=params,
            timeout=AppConfig.REQUEST_TIMEOUT_SECONDS,
        )
        self._validate_owm_response(forecast_resp, cleaned_city)
        forecast_json = forecast_resp.json()

        current = self._parse_current_weather(current_json)
        hourly_6h = self._build_next_6_hours(current, forecast_json)
        daily_5d = self._build_5_day_forecast(forecast_json, current.timezone_offset_sec)
        return current, hourly_6h, daily_5d
`,
  },
  {
    filename: 'config.py',
    path: 'python_weather_app/config.py',
    language: 'python',
    description:
      'Loads OPENWEATHER_API_KEY and IPINFO_TOKEN from .env so credentials are never hardcoded in main logic.',
    linesOfCode: 41,
    content: `"""
Configuration module for the PyWeather Pakistan Tkinter Application.
Loads environment variables from a .env file or system environment,
keeping sensitive API keys out of the main application logic.
"""

import os
from pathlib import Path
from dotenv import load_dotenv

ENV_PATH = Path(__file__).resolve().parent / ".env"
load_dotenv(dotenv_path=ENV_PATH)


class AppConfig:
    """Centralized configuration and API endpoint settings."""

    OPENWEATHER_API_KEY: str = os.getenv("OPENWEATHER_API_KEY", "").strip()
    IPINFO_TOKEN: str = os.getenv("IPINFO_TOKEN", "").strip()

    CURRENT_WEATHER_URL: str = "https://api.openweathermap.org/data/2.5/weather"
    FORECAST_URL: str = "https://api.openweathermap.org/data/2.5/forecast"
    ICON_URL_TEMPLATE: str = "https://openweathermap.org/img/wn/{icon}@2x.png"
    IPINFO_URL: str = "https://ipinfo.io/json"

    REQUEST_TIMEOUT_SECONDS: int = 8
    WINDOW_TITLE: str = "PyWeather Pakistan — OpenWeatherMap Desktop Monitor (PK)"
    WINDOW_GEOMETRY: str = "940x760"
    MIN_WIDTH: int = 860
    MIN_HEIGHT: int = 700

    @classmethod
    def is_api_key_configured(cls) -> bool:
        return bool(
            cls.OPENWEATHER_API_KEY
            and cls.OPENWEATHER_API_KEY != "your_openweathermap_api_key_here"
        )
`,
  },
  {
    filename: 'requirements.txt',
    path: 'python_weather_app/requirements.txt',
    language: 'text',
    description:
      'Python package dependencies required for HTTP requests, Pillow icon rendering, and .env configuration.',
    linesOfCode: 3,
    content: `requests>=2.31.0
Pillow>=10.2.0
python-dotenv>=1.0.1
`,
  },
  {
    filename: '.env.example',
    path: 'python_weather_app/.env.example',
    language: 'env',
    description:
      'Template environment file for storing your OpenWeatherMap Free Tier API key outside the codebase.',
    linesOfCode: 6,
    content: `# OpenWeatherMap API Key (Free Tier)
# Get yours at: https://home.openweathermap.org/api_keys
OPENWEATHER_API_KEY=your_openweathermap_api_key_here

# Optional: ipinfo.io token
IPINFO_TOKEN=
`,
  },
];
