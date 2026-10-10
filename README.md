# PyWeather Pakistan — Python Tkinter Desktop Weather Application

## Project Description

**PyWeather Pakistan** is a multi-threaded Python desktop weather application built with **`tkinter`**, **`requests`**, **`Pillow` (`PIL`)**, and **`python-dotenv`**, powered by the **OpenWeatherMap Free Tier API** and **`ipinfo.io`** geolocation.

Designed specifically for **Pakistan (`PK`)** — covering **Layyah** and **120+ cities, districts, and towns** across Punjab, Sindh, Khyber Pakhtunkhwa, Balochistan, Gilgit-Baltistan, Azad Jammu & Kashmir, and Islamabad Capital Territory — the application provides real-time meteorological telemetry, remote weather icon rendering via Pillow, a next-6-hours progression strip, a 5-day forecast grid, instant Celsius/Fahrenheit (`°C` ↔ `°F`) unit conversion, automatic IP-based city detection, and graceful in-GUI error handling without ever freezing the main Tkinter event loop.

---

## Key Features

1. **Searchable City Input & "Get Weather" GUI (`tkinter`)**:
   - Interactive city search bar, quick-select city buttons, and province-by-province directory for **Layyah** (`Karor Lal Esan`, `Chaubara`, `Chowk Azam`, `Fatehpur`, `Kot Sultan`) and **120+ cities across Pakistan**.
2. **Comprehensive Current Weather Telemetry**:
   - Displays current temperature, feels-like temperature, daily high/low, humidity (`%`), cloud cover (`%`), wind speed (`m/s` or `mph`), wind gusts, cardinal wind bearing, Beaufort wind scale, atmospheric pressure (`hPa`), dew point, visibility (`km`), UV index, Air Quality Index (`AQI`), sunrise/sunset (`PKT`), and a tailored regional agricultural/weather advisory.
3. **Live Weather Icons via Pillow (`PIL`)**:
   - Downloads official condition icons dynamically from `https://openweathermap.org/img/wn/{icon}@2x.png`, resizes them with `Image.Resampling.LANCZOS`, caches them in memory, and renders them inside Tkinter labels using `ImageTk.PhotoImage`.
4. **Hourly Forecast Panel (Next 6 Hours)**:
   - Displays hour-by-hour (`+1h` to `+6h`) temperature progression, condition descriptions, wind speeds, humidity, precipitation probability (`%`), and weather icons.
5. **Daily Forecast Panel (Next 5 Days)**:
   - Aggregates OpenWeatherMap's 5-day / 3-hour forecast stream into daily high/low summaries with midday condition icons, average humidity, and rain probability.
6. **Instant Celsius / Fahrenheit (`°C` ↔ `°F`) Toggle**:
   - Converts all displayed temperatures (`°C` ↔ `°F`) and wind speeds (`m/s` ↔ `mph`) immediately in memory without redundant network calls.
7. **Auto-Detect Location via IP (`ipinfo.io` Bonus)**:
   - Queries `https://ipinfo.io/json` in a background thread to detect the user's city and country automatically.
8. **Graceful In-GUI Error Handling**:
   - Displays user-friendly error banners directly inside the GUI (never crashing or dumping stack traces to the terminal) for:
     - **Empty Input**
     - **City Not Found (`HTTP 404`)**
     - **Invalid or Unactivated API Key (`HTTP 401`)**
     - **Network Timeout / Offline (`requests.exceptions.Timeout`)**
9. **Secure `.env` API Key Management**:
   - Loads `OPENWEATHER_API_KEY` from a `.env` file via `config.py` using `python-dotenv` — never hardcoded in the main logic.
10. **Non-Blocking Multi-Threading (`threading.Thread`)**:
    - Executes all HTTP API calls and Pillow image downloads inside daemon worker threads (`threading.Thread(..., daemon=True)`) and schedules GUI updates safely on the main thread via `root.after(0, ...)`.

---

## Tech Stack

- **Language**: Python 3.10+
- **GUI Framework**: `tkinter` (`tk`, `ttk`)
- **HTTP Client**: `requests`
- **Image Processing**: `Pillow` (`PIL.Image`, `PIL.ImageTk`)
- **Environment Configuration**: `python-dotenv`
- **APIs Used**:
  - **OpenWeatherMap Free Tier API v2.5** (`/data/2.5/weather`, `/data/2.5/forecast`, `/img/wn/{icon}@2x.png`)
  - **ipinfo.io Geolocation API** (`https://ipinfo.io/json`)

---

## Project Structure

```text
python_weather_app/
├── main.py              # Tkinter GUI controller, layout panels, unit toggle, error banner & worker threads
├── weather_service.py   # OpenWeatherMap REST client, ipinfo.io geolocation & Pillow ImageTk icon cache
├── config.py            # Loads OPENWEATHER_API_KEY from .env file and defines app constants
├── requirements.txt     # Python dependencies (requests, Pillow, python-dotenv)
├── .env.example         # Environment variable template for OPENWEATHER_API_KEY
└── README.md            # Project documentation and setup instructions
