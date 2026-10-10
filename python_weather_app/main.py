"""
PyWeather Pakistan — Python Tkinter Desktop Weather Application
Scoped exclusively to Pakistan (PK) cities with a Beige, Black, and White interface.
Uses the OpenWeatherMap Free Tier API, Pillow (PIL) for remote weather icon rendering,
ipinfo.io for automatic IP-based location detection, and background threading to keep
the Tkinter event loop responsive at all times.
"""

from __future__ import annotations

import threading
import tkinter as tk
from tkinter import ttk
from typing import Dict, List, Optional

from config import AppConfig
from weather_service import (
    PAKISTAN_CITIES,
    CompleteWeatherReport,
    WeatherAppError,
    WeatherService,
)


class WeatherDesktopApp:
    """Main Tkinter GUI Controller and View for PyWeather Pakistan (Pure Black & White)."""

    # Color Palette (Pure Black and White Theme)
    BG_MAIN = "#FFFFFF"          # Pure White Canvas
    BG_PANEL = "#FFFFFF"         # Pure White Bar
    BG_CARD = "#FFFFFF"          # Pure White Card Surface
    BG_ERROR = "#000000"         # High-Contrast Black Alert Banner
    BORDER_BLACK = "#000000"     # Crisp Black Border
    TEXT_PRIMARY = "#000000"     # Crisp Black Typography
    TEXT_SECONDARY = "#000000"   # Black Metadata
    BTN_PRIMARY = "#000000"      # Solid Black Primary Button
    BTN_PRIMARY_ACTIVE = "#222222"
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
        """Set the Pakistan city in the entry field and fetch its weather report."""
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

        # 1. Current Weather Hero Panel (Pure White Card with 1px Black Border)
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

        # Right-side telemetry metrics (Humidity, Wind Speed, Feels Like, Pressure)
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

        # 2. Hourly Forecast Panel (Next 6 Hours)
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

        # 3. Daily Forecast Panel (Next 5 Days)
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

    def _build_status_bar(self) -> None:
        """Bottom status bar showing background thread activity and last updated time."""
        status_bar = tk.Frame(
            self.root,
            bg=self.BG_PANEL,
            padx=20,
            pady=6,
            highlightbackground=self.BORDER_BLACK,
            highlightthickness=1,
        )
        status_bar.pack(fill=tk.X, side=tk.BOTTOM)
        tk.Label(
            status_bar,
            textvariable=self.status_var,
            font=("Courier", 9),
            fg=self.TEXT_PRIMARY,
            bg=self.BG_PANEL,
            anchor="w",
        ).pack(side=tk.LEFT)

    def on_get_weather(self) -> None:
        """Trigger a non-blocking background thread to fetch weather for a Pakistani city."""
        if self.is_loading:
            return

        city_query = self.city_var.get().strip()
        if not city_query:
            self._show_error(
                title="Empty Input",
                message="Please enter a Pakistan city name (e.g., 'Islamabad', 'Karachi', 'Lahore') before clicking 'Get Weather'.",
            )
            return

        self._hide_error()
        self._set_loading_state(True, f"Fetching Pakistan weather for '{city_query}, PK'...")

        worker = threading.Thread(
            target=self._worker_fetch_weather,
            args=(city_query,),
            daemon=True,
        )
        worker.start()

    def on_detect_ip_location(self) -> None:
        """Trigger a non-blocking background thread to auto-detect Pakistan city via ipinfo.io."""
        if self.is_loading:
            return

        self._hide_error()
        self._set_loading_state(True, "Auto-detecting Pakistan location via ipinfo.io...")

        worker = threading.Thread(
            target=self._worker_detect_ip_and_weather,
            daemon=True,
        )
        worker.start()

    def on_toggle_units(self) -> None:
        """Toggle instantly between Celsius (m/s) and Fahrenheit (mph) and refresh labels."""
        if self.unit_system == "C":
            self.unit_system = "F"
            self.unit_btn_var.set("Switch to °C / m/s")
        else:
            self.unit_system = "C"
            self.unit_btn_var.set("Switch to °F / mph")

        if self.current_report is not None:
            self._render_report(self.current_report)

    def _worker_fetch_weather(self, city_query: str) -> None:
        """Runs in a daemon thread: fetches JSON + Pillow icons, then schedules GUI update."""
        try:
            report = self.service.fetch_weather_report(city_query)
            self._prefetch_report_icons(report)
            self.root.after(0, self._on_weather_success, report)
        except WeatherAppError as err:
            self.root.after(0, self._on_weather_error, err)
        except Exception as exc:
            fallback_err = WeatherAppError(
                title="Unexpected Application Error",
                message=str(exc),
                code="UNKNOWN",
            )
            self.root.after(0, self._on_weather_error, fallback_err)

    def _worker_detect_ip_and_weather(self) -> None:
        """Runs in a daemon thread: queries ipinfo.io, then fetches OpenWeatherMap data."""
        try:
            detected_city = self.service.detect_location_by_ip()
            self.root.after(0, lambda: self.city_var.set(detected_city))
            report = self.service.fetch_weather_report(detected_city)
            self._prefetch_report_icons(report)
            self.root.after(0, self._on_weather_success, report)
        except WeatherAppError as err:
            self.root.after(0, self._on_weather_error, err)

    def _prefetch_report_icons(self, report: CompleteWeatherReport) -> None:
        """Pre-download PIL images in the worker thread so the UI thread never blocks."""
        self.service.fetch_pil_icon(report.current.icon_code, size=72)
        for item in report.hourly_6h:
            self.service.fetch_pil_icon(item.icon_code, size=44)
        for item in report.daily_5d:
            self.service.fetch_pil_icon(item.icon_code, size=48)

    def _on_weather_success(self, report: CompleteWeatherReport) -> None:
        """Main-thread callback executed via root.after() when data is ready."""
        self.current_report = report
        self._hide_error()
        self._render_report(report)
        updated_str = report.current.updated_at.strftime("%H:%M PKT")
        self._set_loading_state(
            False,
            f"Updated {report.current.city}, Pakistan (PK) at {updated_str}",
        )

    def _on_weather_error(self, error: WeatherAppError) -> None:
        """Main-thread callback executed via root.after() when an API/input error occurs."""
        self._set_loading_state(False, f"Error: {error.title}")
        self._show_error(error.title, error.message)

    def _render_report(self, report: CompleteWeatherReport) -> None:
        """Render current weather, 6-hour forecast, and 5-day forecast in active units."""
        self._icon_refs.clear()
        cur = report.current

        self.city_title_lbl.configure(text=f"{cur.city}, Pakistan (PK)")
        self.desc_lbl.configure(
            text=(
                f"{cur.description}  ·  High {self._fmt_temp(cur.temp_max_c)} / "
                f"Low {self._fmt_temp(cur.temp_min_c)}  ·  Visibility {cur.visibility_m // 1000} km"
            )
        )
        self.temp_lbl.configure(text=self._fmt_temp(cur.temp_c))

        hero_icon = self.service.get_tk_icon(cur.icon_code, size=72)
        if hero_icon:
            self._icon_refs.append(hero_icon)
            self.current_icon_lbl.configure(image=hero_icon)

        self.metric_labels["humidity"].configure(text=f"{cur.humidity}%")
        self.metric_labels["wind"].configure(text=self._fmt_wind(cur.wind_speed_ms))
        self.metric_labels["feels_like"].configure(text=self._fmt_temp(cur.feels_like_c))
        self.metric_labels["pressure"].configure(text=f"{cur.pressure_hpa} hPa")

        for child in self.hourly_container.winfo_children():
            child.destroy()

        for col, h_item in enumerate(report.hourly_6h):
            card = tk.Frame(
                self.hourly_container,
                bg=self.BG_CARD,
                padx=10,
                pady=10,
                highlightbackground=self.BORDER_BLACK,
                highlightthickness=1,
            )
            card.grid(row=0, column=col, padx=4, sticky="nsew")

            tk.Label(
                card,
                text=h_item.time_label,
                font=("Courier", 10, "bold"),
                fg=self.TEXT_PRIMARY,
                bg=self.BG_CARD,
            ).pack()

            tk_icon = self.service.get_tk_icon(h_item.icon_code, size=44)
            if tk_icon:
                self._icon_refs.append(tk_icon)
                tk.Label(card, image=tk_icon, bg="#1C1B18").pack(pady=4)

            tk.Label(
                card,
                text=self._fmt_temp(h_item.temp_c),
                font=("Courier", 13, "bold"),
                fg=self.TEXT_PRIMARY,
                bg=self.BG_CARD,
            ).pack()

            tk.Label(
                card,
                text=h_item.description,
                font=("Helvetica", 8),
                fg=self.TEXT_SECONDARY,
                bg=self.BG_CARD,
                wraplength=110,
            ).pack(pady=(2, 0))

        for child in self.daily_container.winfo_children():
            child.destroy()

        for col, d_item in enumerate(report.daily_5d):
            card = tk.Frame(
                self.daily_container,
                bg=self.BG_CARD,
                padx=12,
                pady=12,
                highlightbackground=self.BORDER_BLACK,
                highlightthickness=1,
            )
            card.grid(row=0, column=col, padx=4, sticky="nsew")

            tk.Label(
                card,
                text=f"{d_item.day_label} · {d_item.date_str}",
                font=("Helvetica", 10, "bold"),
                fg=self.TEXT_PRIMARY,
                bg=self.BG_CARD,
            ).pack()

            tk_icon = self.service.get_tk_icon(d_item.icon_code, size=48)
            if tk_icon:
                self._icon_refs.append(tk_icon)
                tk.Label(card, image=tk_icon, bg="#1C1B18").pack(pady=4)

            tk.Label(
                card,
                text=f"{self._fmt_temp(d_item.temp_max_c)} / {self._fmt_temp(d_item.temp_min_c)}",
                font=("Courier", 11, "bold"),
                fg=self.TEXT_PRIMARY,
                bg=self.BG_CARD,
            ).pack()

            tk.Label(
                card,
                text=d_item.description,
                font=("Helvetica", 9),
                fg=self.TEXT_SECONDARY,
                bg=self.BG_CARD,
                wraplength=130,
            ).pack(pady=(3, 0))

    def _fmt_temp(self, temp_c: float) -> str:
        """Convert Celsius temperature to active unit system (°C or °F)."""
        if self.unit_system == "F":
            temp_f = (temp_c * 9.0 / 5.0) + 32.0
            return f"{round(temp_f)}°F"
        return f"{round(temp_c)}°C"

    def _fmt_wind(self, speed_ms: float) -> str:
        """Convert wind speed from m/s to mph when Fahrenheit/Imperial mode is active."""
        if self.unit_system == "F":
            speed_mph = speed_ms * 2.23694
            return f"{speed_mph:.1f} mph"
        return f"{speed_ms:.1f} m/s"

    def _set_loading_state(self, loading: bool, status_text: str) -> None:
        """Enable/disable buttons while background threads are active."""
        self.is_loading = loading
        self.status_var.set(status_text)
        state = tk.DISABLED if loading else tk.NORMAL
        self.search_btn.configure(state=state)
        self.geo_btn.configure(state=state)

    def _show_error(self, title: str, message: str) -> None:
        """Display an error banner inside the GUI without crashing or printing to stdout."""
        self.error_title_lbl.configure(text=f"⚠ {title}")
        self.error_msg_lbl.configure(text=message)
        self.error_frame.pack(
            fill=tk.X, padx=20, pady=(10, 0), before=self.main_container
        )

    def _hide_error(self) -> None:
        """Hide the in-GUI error banner."""
        self.error_frame.pack_forget()


def main() -> None:
    """Entry point for the PyWeather Pakistan Tkinter Desktop Application."""
    root = tk.Tk()
    app = WeatherDesktopApp(root)
    root.mainloop()


if __name__ == "__main__":
    main()
