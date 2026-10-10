# PyWeather Desktop — Python Tkinter Weather App

A clean, multi-threaded Python desktop weather application built with `tkinter`, `requests`, `Pillow` (PIL), `python-dotenv`, and the **OpenWeatherMap Free Tier API**.

---

## Features Implemented

1. **Tkinter Desktop GUI**: Search bar with city input field, **Get Weather** button, **Auto-Detect IP** button, unit toggle button, and structured results panels.
2. **Current Conditions**: Displays temperature, feels-like, high/low, humidity (`%`), atmospheric pressure (`hPa`), wind speed (`m/s` or `mph`), and weather condition description (e.g., `"Partly Cloudy"`).
3. **Pillow (`PIL`) Weather Icons**: Downloads live condition icons from `https://openweathermap.org/img/wn/{icon}@2x.png`, caches them in memory, and renders them via `ImageTk.PhotoImage`.
4. **Next 6 Hours Forecast Panel**: Displays hour-by-hour forecast slots (`+1h` through `+6h`) with icons, temperatures, and descriptions.
5. **5-Day Forecast Panel**: Aggregates the OpenWeatherMap 5-day / 3-hour free tier feed into daily high/low summaries with midday condition icons.
6. **Instant °C / °F Toggle**: Switches all displayed temperatures (`°C` ↔ `°F`) and wind speeds (`m/s` ↔ `mph`) immediately without making redundant API requests.
7. **Auto-Detect Location via IP (Bonus)**: Queries `https://ipinfo.io/json` to detect the user's current city and country automatically.
8. **In-GUI Error Handling**: Displays a structured GUI banner for empty input, city not found (`HTTP 404`), invalid or unactivated API key (`HTTP 401`), and network timeouts (`requests.exceptions.Timeout`).
9. **Secure Configuration**: Reads `OPENWEATHER_API_KEY` from a `.env` file via `config.py` — never hardcoded in application logic.
10. **Non-Blocking Threading**: Runs all HTTP and image download operations in daemon worker threads (`threading.Thread`) and schedules GUI updates safely via `root.after(0, ...)`.

---

## How to Get a Free OpenWeatherMap API Key

1. Visit **[https://openweathermap.org/](https://openweathermap.org/)** and click **Sign In** → **Create an Account**.
2. Verify your email address after signing up.
3. Navigate to your account dashboard → **[My API keys](https://home.openweathermap.org/api_keys)**.
4. Copy your default key or generate a new key under **Create key**.
5. *Note*: Newly created free-tier keys typically take **10 to 30 minutes** to activate on OpenWeatherMap's servers. The free tier includes 60 calls/minute to Current Weather (`/data/2.5/weather`) and 5-Day/3-Hour Forecast (`/data/2.5/forecast`).

---

## Local Setup & Execution Instructions

```bash
# 1. Navigate into the Python project folder
cd python_weather_app

# 2. (Optional) Create and activate a virtual environment
python -m venv .venv
source .venv/bin/activate      # macOS / Linux
# .venv\Scripts\activate       # Windows

# 3. Install required dependencies
pip install -r requirements.txt

# 4. Configure your OpenWeatherMap API key
cp .env.example .env
# Edit .env and paste your real OPENWEATHER_API_KEY

# 5. Launch the Tkinter Desktop App
python main.py
```
