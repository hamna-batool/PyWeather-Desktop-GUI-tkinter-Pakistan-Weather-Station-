"""
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

# Official directory of Pakistan cities supported in the quick-bar and searchable combobox
PAKISTAN_CITIES: List[str] = [
    "Layyah",
    "Karor Lal Esan",
    "Chaubara",
    "Chowk Azam",
    "Islamabad",
    "Lahore",
    "Karachi",
    "Rawalpindi",
    "Faisalabad",
    "Multan",
    "Peshawar",
    "Quetta",
    "Gujranwala",
    "Sialkot",
    "Bahawalpur",
    "Sargodha",
    "Sukkur",
    "Larkana",
    "Sheikhupura",
    "Rahim Yar Khan",
    "Jhang",
    "Dera Ghazi Khan",
    "Gujrat",
    "Sahiwal",
    "Mardan",
    "Kasur",
    "Okara",
    "Mingora",
    "Nawabshah",
    "Chiniot",
    "Kotri",
    "Kamoke",
    "Hafizabad",
    "Sadiqabad",
    "Mirpur Khas",
    "Burewala",
    "Kohat",
    "Khanewal",
    "Dera Ismail Khan",
    "Turbat",
    "Muzaffargarh",
    "Abbottabad",
    "Mandi Bahauddin",
    "Shikarpur",
    "Jacobabad",
    "Jhelum",
    "Khanpur",
    "Khairpur",
    "Khuzdar",
    "Pakpattan",
    "Hub",
    "Daska",
    "Gojra",
    "Dadu",
    "Muridke",
    "Bahawalnagar",
    "Samundri",
    "Tando Allahyar",
    "Tando Adam",
    "Jaranwala",
    "Chishtian",
    "Muzaffarabad",
    "Attock",
    "Vehari",
    "Kot Abdul Malik",
    "Ferozewala",
    "Chakwal",
    "Kamalia",
    "Umerkot",
    "Ahmedpur East",
    "Kot Addu",
    "Wazirabad",
    "Mansehra",
    "Swabi",
    "Khushab",
    "Mianwali",
    "Bhakkar",
    "Chaman",
    "Gwadar",
    "Gilgit",
    "Skardu",
    "Hunza",
    "Chitral",
    "Murree",
    "Ziarat",
    "Mirpur",
]


class WeatherAppError(Exception):
    """Custom exception carrying user-friendly GUI error messages and error codes."""

    def __init__(self, title: str, message: str, code: str = "ERROR") -> None:
        super().__init__(message)
        self.title = title
        self.message = message
        self.code = code


@dataclass
class CurrentWeather:
    """Normalized current weather reading stored in metric (Celsius, m/s) as baseline."""

    city: str
    country: str
    temp_c: float
    feels_like_c: float
    temp_min_c: float
    temp_max_c: float
    humidity: int
    pressure_hpa: int
    wind_speed_ms: float
    wind_deg: int
    description: str
    condition_main: str
    icon_code: str
    visibility_m: int
    timezone_offset_sec: int
    updated_at: datetime


@dataclass
class HourlyForecastItem:
    """Normalized forecast slot for the Hourly Forecast panel (next 6 hours)."""

    timestamp: datetime
    time_label: str
    temp_c: float
    feels_like_c: float
    humidity: int
    wind_speed_ms: float
    pop_percent: int
    description: str
    icon_code: str


@dataclass
class DailyForecastItem:
    """Normalized daily forecast summary for the 5-Day Forecast panel."""

    date_str: str
    day_label: str
    temp_min_c: float
    temp_max_c: float
    humidity_avg: int
    wind_speed_ms: float
    pop_percent: int
    description: str
    icon_code: str


@dataclass
class CompleteWeatherReport:
    """Complete weather payload returned to the Tkinter GUI."""

    current: CurrentWeather
    hourly_6h: List[HourlyForecastItem]
    daily_5d: List[DailyForecastItem]


class WeatherService:
    """Client for OpenWeatherMap Free Tier APIs (scoped to Pakistan, PK), ipinfo.io, and Pillow Icons."""

    def __init__(self, api_key: Optional[str] = None) -> None:
        self.api_key = (api_key or AppConfig.OPENWEATHER_API_KEY).strip()
        self.session = requests.Session()
        self._raw_icon_cache: Dict[Tuple[str, int], Image.Image] = {}
        self._tk_icon_cache: Dict[Tuple[str, int], ImageTk.PhotoImage] = {}

    def detect_location_by_ip(self) -> str:
        """
        Auto-detect the user's Pakistan city from their IP address using ipinfo.io.
        Defaults to 'Islamabad' if the IP is outside Pakistan.
        """
        headers = {"Accept": "application/json"}
        params = {}
        if AppConfig.IPINFO_TOKEN:
            params["token"] = AppConfig.IPINFO_TOKEN

        try:
            response = self.session.get(
                AppConfig.IPINFO_URL,
                headers=headers,
                params=params,
                timeout=AppConfig.REQUEST_TIMEOUT_SECONDS,
            )
            response.raise_for_status()
            data = response.json()
            city = (data.get("city") or "").strip()
            country = (data.get("country") or "").strip().upper()

            if city and country == "PK":
                return city
            return "Islamabad"

        except requests.exceptions.Timeout as exc:
            raise WeatherAppError(
                title="Network Timeout",
                message="Timed out while contacting ipinfo.io to detect your Pakistan location.",
                code="TIMEOUT",
            ) from exc
        except requests.exceptions.RequestException as exc:
            raise WeatherAppError(
                title="Geolocation Network Error",
                message=f"Unable to reach ipinfo.io geolocation service ({exc.__class__.__name__}).",
                code="NETWORK_ERROR",
            ) from exc

    def fetch_weather_report(self, city_query: str) -> CompleteWeatherReport:
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
                message="Please enter a city in Pakistan (e.g., 'Islamabad', 'Karachi', 'Lahore') before requesting weather data.",
                code="EMPTY_INPUT",
            )

        if not self.api_key or self.api_key == "your_openweathermap_api_key_here":
            raise WeatherAppError(
                title="Missing or Invalid API Key",
                message="OpenWeatherMap API key is not configured. Add OPENWEATHER_API_KEY to your .env file.",
                code="INVALID_API_KEY",
            )

        # Force country code PK so only Pakistani cities are queried
        pakistan_query = f"{cleaned_city},PK"
        params = {
            "q": pakistan_query,
            "appid": self.api_key,
            "units": "metric",
        }

        try:
            current_resp = self.session.get(
                AppConfig.CURRENT_WEATHER_URL,
                params=params,
                timeout=AppConfig.REQUEST_TIMEOUT_SECONDS,
            )
            self._validate_owm_response(current_resp, cleaned_city)
            current_json = current_resp.json()

            # Verify resolved country is strictly PK
            resolved_country = (current_json.get("sys") or {}).get("country", "PK")
            if resolved_country != "PK":
                raise WeatherAppError(
                    title="Only Pakistan (PK) Cities Supported",
                    message=f"'{cleaned_city}' is not located in Pakistan. Please enter a Pakistani city.",
                    code="CITY_NOT_FOUND",
                )

            forecast_resp = self.session.get(
                AppConfig.FORECAST_URL,
                params=params,
                timeout=AppConfig.REQUEST_TIMEOUT_SECONDS,
            )
            self._validate_owm_response(forecast_resp, cleaned_city)
            forecast_json = forecast_resp.json()

        except requests.exceptions.Timeout as exc:
            raise WeatherAppError(
                title="Network Timeout",
                message=f"Request to OpenWeatherMap timed out after {AppConfig.REQUEST_TIMEOUT_SECONDS} seconds.",
                code="TIMEOUT",
            ) from exc
        except requests.exceptions.ConnectionError as exc:
            raise WeatherAppError(
                title="Network Connection Error",
                message="Could not connect to OpenWeatherMap servers. Verify your internet connection.",
                code="NETWORK_ERROR",
            ) from exc
        except requests.exceptions.RequestException as exc:
            raise WeatherAppError(
                title="Request Error",
                message=f"An unexpected network error occurred: {exc}",
                code="NETWORK_ERROR",
            ) from exc

        current = self._parse_current_weather(current_json)
        hourly_6h = self._build_next_6_hours(current, forecast_json)
        daily_5d = self._build_5_day_forecast(forecast_json, current.timezone_offset_sec)

        return CompleteWeatherReport(
            current=current,
            hourly_6h=hourly_6h,
            daily_5d=daily_5d,
        )

    def fetch_pil_icon(self, icon_code: str, size: int = 72) -> Optional[Image.Image]:
        """Download an OpenWeatherMap icon PNG in a background thread and return a PIL.Image."""
        cache_key = (icon_code, size)
        if cache_key in self._raw_icon_cache:
            return self._raw_icon_cache[cache_key]

        url = AppConfig.ICON_URL_TEMPLATE.format(icon=icon_code)
        try:
            resp = self.session.get(url, timeout=5)
            resp.raise_for_status()
            pil_img = Image.open(BytesIO(resp.content)).convert("RGBA")
            pil_img = pil_img.resize((size, size), Image.Resampling.LANCZOS)
            self._raw_icon_cache[cache_key] = pil_img
            return pil_img
        except Exception:
            return None

    def get_tk_icon(self, icon_code: str, size: int = 72) -> Optional[ImageTk.PhotoImage]:
        """Convert a cached PIL image into a Tkinter PhotoImage on the main thread."""
        cache_key = (icon_code, size)
        if cache_key in self._tk_icon_cache:
            return self._tk_icon_cache[cache_key]

        pil_img = self._raw_icon_cache.get(cache_key) or self.fetch_pil_icon(icon_code, size)
        if pil_img is None:
            return None

        tk_img = ImageTk.PhotoImage(pil_img)
        self._tk_icon_cache[cache_key] = tk_img
        return tk_img

    @staticmethod
    def _validate_owm_response(response: requests.Response, query: str) -> None:
        if response.status_code == 200:
            return

        if response.status_code == 401:
            raise WeatherAppError(
                title="Invalid API Key (HTTP 401)",
                message="OpenWeatherMap rejected the API key. Ensure OPENWEATHER_API_KEY in .env is valid.",
                code="INVALID_API_KEY",
            )
        if response.status_code == 404:
            raise WeatherAppError(
                title="Pakistan City Not Found (HTTP 404)",
                message=(
                    f"Could not find '{query}' in Pakistan (PK). "
                    "Try Islamabad, Karachi, Lahore, Peshawar, Quetta, Multan, Faisalabad, Murree, Gilgit, or Skardu."
                ),
                code="CITY_NOT_FOUND",
            )
        raise WeatherAppError(
            title=f"API Error (HTTP {response.status_code})",
            message=f"OpenWeatherMap returned status {response.status_code}.",
            code="API_ERROR",
        )

    @staticmethod
    def _parse_current_weather(data: dict) -> CurrentWeather:
        weather_block = (data.get("weather") or [{}])[0]
        main_block = data.get("main") or {}
        wind_block = data.get("wind") or {}
        tz_offset = int(data.get("timezone", 18000))  # Default PKT UTC+5 (18000s)
        local_tz = timezone(timedelta(seconds=tz_offset))

        dt_unix = int(data.get("dt", datetime.now(timezone.utc).timestamp()))
        local_dt = datetime.fromtimestamp(dt_unix, tz=local_tz)

        return CurrentWeather(
            city=data.get("name") or "Islamabad",
            country="PK",
            temp_c=float(main_block.get("temp", 0.0)),
            feels_like_c=float(main_block.get("feels_like", 0.0)),
            temp_min_c=float(main_block.get("temp_min", 0.0)),
            temp_max_c=float(main_block.get("temp_max", 0.0)),
            humidity=int(main_block.get("humidity", 0)),
            pressure_hpa=int(main_block.get("pressure", 1013)),
            wind_speed_ms=float(wind_block.get("speed", 0.0)),
            wind_deg=int(wind_block.get("deg", 0)),
            description=str(weather_block.get("description", "clear sky")).title(),
            condition_main=str(weather_block.get("main", "Clear")),
            icon_code=str(weather_block.get("icon", "01d")),
            visibility_m=int(data.get("visibility", 10000)),
            timezone_offset_sec=tz_offset,
            updated_at=local_dt,
        )

    @staticmethod
    def _build_next_6_hours(
        current: CurrentWeather, forecast_data: dict
    ) -> List[HourlyForecastItem]:
        raw_list = forecast_data.get("list") or []
        local_tz = timezone(timedelta(seconds=current.timezone_offset_sec))
        now_local = current.updated_at

        anchors = [
            (
                now_local.timestamp(),
                current.temp_c,
                current.feels_like_c,
                current.humidity,
                current.wind_speed_ms,
                0,
                current.description,
                current.icon_code,
            )
        ]

        for slot in raw_list[:4]:
            slot_dt = datetime.fromtimestamp(int(slot.get("dt", 0)), tz=local_tz)
            if slot_dt.timestamp() <= now_local.timestamp():
                continue
            main_b = slot.get("main") or {}
            wind_b = slot.get("wind") or {}
            weath_b = (slot.get("weather") or [{}])[0]
            pop_pct = int(round(float(slot.get("pop", 0.0)) * 100))
            anchors.append(
                (
                    slot_dt.timestamp(),
                    float(main_b.get("temp", current.temp_c)),
                    float(main_b.get("feels_like", current.feels_like_c)),
                    int(main_b.get("humidity", current.humidity)),
                    float(wind_b.get("speed", current.wind_speed_ms)),
                    pop_pct,
                    str(weath_b.get("description", current.description)).title(),
                    str(weath_b.get("icon", current.icon_code)),
                )
            )

        hourly_items: List[HourlyForecastItem] = []
        base_hour = now_local.replace(minute=0, second=0, microsecond=0)

        for offset_hr in range(1, 7):
            target_dt = base_hour + timedelta(hours=offset_hr)
            target_ts = target_dt.timestamp()

            prev_a = anchors[0]
            next_a = anchors[-1]
            for idx in range(len(anchors) - 1):
                if anchors[idx][0] <= target_ts <= anchors[idx + 1][0]:
                    prev_a = anchors[idx]
                    next_a = anchors[idx + 1]
                    break

            span = max(next_a[0] - prev_a[0], 1.0)
            ratio = min(max((target_ts - prev_a[0]) / span, 0.0), 1.0)

            temp_c = prev_a[1] + (next_a[1] - prev_a[1]) * ratio
            feels_c = prev_a[2] + (next_a[2] - prev_a[2]) * ratio
            humidity = int(round(prev_a[3] + (next_a[3] - prev_a[3]) * ratio))
            wind_ms = prev_a[4] + (next_a[4] - prev_a[4]) * ratio
            chosen_anchor = next_a if ratio >= 0.5 else prev_a

            hourly_items.append(
                HourlyForecastItem(
                    timestamp=target_dt,
                    time_label=target_dt.strftime("%H:%M"),
                    temp_c=round(temp_c, 1),
                    feels_like_c=round(feels_c, 1),
                    humidity=humidity,
                    wind_speed_ms=round(wind_ms, 1),
                    pop_percent=chosen_anchor[5],
                    description=chosen_anchor[6],
                    icon_code=chosen_anchor[7],
                )
            )

        return hourly_items

    @staticmethod
    def _build_5_day_forecast(
        forecast_data: dict, tz_offset_sec: int
    ) -> List[DailyForecastItem]:
        raw_list = forecast_data.get("list") or []
        local_tz = timezone(timedelta(seconds=tz_offset_sec))
        grouped: Dict[str, List[dict]] = {}

        for slot in raw_list:
            dt_obj = datetime.fromtimestamp(int(slot.get("dt", 0)), tz=local_tz)
            day_key = dt_obj.strftime("%Y-%m-%d")
            grouped.setdefault(day_key, []).append(slot)

        daily_items: List[DailyForecastItem] = []
        for day_key in sorted(grouped.keys())[:5]:
            slots = grouped[day_key]
            temps_min = [float(s.get("main", {}).get("temp_min", 0.0)) for s in slots]
            temps_max = [float(s.get("main", {}).get("temp_max", 0.0)) for s in slots]
            humidities = [int(s.get("main", {}).get("humidity", 0)) for s in slots]
            winds = [float(s.get("wind", {}).get("speed", 0.0)) for s in slots]
            pops = [int(round(float(s.get("pop", 0.0)) * 100)) for s in slots]

            midday_slot = min(
                slots,
                key=lambda s: abs(
                    datetime.fromtimestamp(int(s.get("dt", 0)), tz=local_tz).hour - 12
                ),
            )
            weather_b = (midday_slot.get("weather") or [{}])[0]
            dt_sample = datetime.fromtimestamp(int(midday_slot.get("dt", 0)), tz=local_tz)
            icon_code = str(weather_b.get("icon", "01d"))
            if icon_code.endswith("n"):
                icon_code = icon_code[:-1] + "d"

            daily_items.append(
                DailyForecastItem(
                    date_str=dt_sample.strftime("%b %d"),
                    day_label=dt_sample.strftime("%a"),
                    temp_min_c=round(min(temps_min), 1),
                    temp_max_c=round(max(temps_max), 1),
                    humidity_avg=int(round(sum(humidities) / max(len(humidities), 1))),
                    wind_speed_ms=round(max(winds), 1),
                    pop_percent=max(pops) if pops else 0,
                    description=str(weather_b.get("description", "Clear")).title(),
                    icon_code=icon_code,
                )
            )

        return daily_items
