import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Search,
  LocateFixed,
  AlertTriangle,
  RefreshCw,
  X,
  Bookmark,
  ChevronDown,
  Compass,
  Wind,
  Droplets,
  Sun,
  Gauge,
  KeyRound,
  Check,
} from 'lucide-react';
import {
  CompleteWeatherReport,
  WeatherGuiError,
  PAKISTAN_CITIES,
  PakistanCityProfile,
  searchPakistanCities,
  fetchWeatherReport,
  detectIpLocation,
  formatTemp,
  formatWind,
  getOwmIconUrl,
} from '../services/weatherSimulatorService';
import { OwmWeatherIcon } from './OwmWeatherIcon';

const PROVINCE_FILTERS = [
  { id: 'ALL', label: 'All Pakistan' },
  { id: 'Punjab', label: 'Punjab' },
  { id: 'Sindh', label: 'Sindh' },
  { id: 'Khyber Pakhtunkhwa', label: 'KPK' },
  { id: 'Balochistan', label: 'Balochistan' },
  { id: 'Gilgit-Baltistan', label: 'Gilgit-Baltistan' },
  { id: 'Azad Jammu & Kashmir', label: 'Azad Kashmir' },
  { id: 'Islamabad Capital Territory', label: 'Islamabad' },
] as const;

const DEFAULT_PINNED_CITIES = [
  'Layyah',
  'Islamabad',
  'Lahore',
  'Karachi',
  'Multan',
  'Peshawar',
  'Quetta',
  'Gilgit',
];

export const TkinterWindowSimulator: React.FC = () => {
  const [cityInput, setCityInput] = useState<string>('Layyah');
  const [unitSystem, setUnitSystem] = useState<'C' | 'F'>('C');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [report, setReport] = useState<CompleteWeatherReport | null>(null);
  const [guiError, setGuiError] = useState<{
    title: string;
    message: string;
    code?: string;
  } | null>(null);
  const [statusText, setStatusText] = useState<string>(
    'Ready — threading.Thread idle · API key loaded from .env (config.py)'
  );

  // .env API key state (Requirement #9)
  const [owmApiKey, setOwmApiKey] = useState<string>('');
  const [showEnvBar, setShowEnvBar] = useState<boolean>(false);

  // Searchable city autocomplete & province filter states
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [provinceFilter, setProvinceFilter] = useState<string>('ALL');
  const [pinnedCities, setPinnedCities] = useState<string[]>(DEFAULT_PINNED_CITIES);
  const [showAllDirectory, setShowAllDirectory] = useState<boolean>(false);

  const searchContainerRef = useRef<HTMLDivElement>(null);

  const filteredSuggestions: PakistanCityProfile[] = searchPakistanCities(
    cityInput,
    provinceFilter
  );

  const directoryCities: PakistanCityProfile[] =
    provinceFilter === 'ALL'
      ? PAKISTAN_CITIES
      : PAKISTAN_CITIES.filter((c) => c.province === provinceFilter);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const executeWeatherFetch = useCallback(
    async (
      query: string,
      forcedError?: 'EMPTY_INPUT' | 'CITY_NOT_FOUND' | 'INVALID_API_KEY' | 'TIMEOUT'
    ) => {
      if (isLoading) return;

      if (!query.trim() && !forcedError) {
        setGuiError({
          title: 'Empty Input',
          message:
            'Please enter or select a city name in Pakistan (e.g., Layyah, Islamabad, Lahore, Karachi) before clicking Get Weather.',
          code: 'EMPTY_INPUT',
        });
        setStatusText('Error inside GUI: Empty Input (Handled without freezing)');
        return;
      }

      setIsDropdownOpen(false);
      setGuiError(null);
      setIsLoading(true);
      setStatusText(
        `threading.Thread(target=self._worker_fetch_weather, args=('${query.trim()}',), daemon=True).start()`
      );

      try {
        const result = await fetchWeatherReport(query, owmApiKey, forcedError);
        setReport(result);
        setGuiError(null);
        setStatusText(
          `root.after(0, _on_weather_success) · Updated ${result.current.city}, ${result.current.province}, Pakistan (${result.current.updatedAt} · ${result.threadExecutionMs}ms)`
        );
      } catch (err) {
        if (err instanceof WeatherGuiError) {
          setGuiError({
            title: err.title,
            message: err.message,
            code: err.code,
          });
          setStatusText(`root.after(0, _on_weather_error) · ${err.title}`);
        } else {
          setGuiError({
            title: 'Network Error',
            message: 'Unable to fetch weather data. Please check your connection.',
            code: 'NETWORK_ERROR',
          });
          setStatusText('Error: Network Error');
        }
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, owmApiKey]
  );

  useEffect(() => {
    executeWeatherFetch('Layyah');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAutoDetectIp = async () => {
    if (isLoading) return;
    setIsDropdownOpen(false);
    setGuiError(null);
    setIsLoading(true);
    setStatusText(
      'threading.Thread(target=self._worker_detect_ip, daemon=True) -> GET https://ipinfo.io/json'
    );

    try {
      const detected = await detectIpLocation();
      setCityInput(detected.city);
      const result = await fetchWeatherReport(detected.city, owmApiKey);
      setReport(result);
      setStatusText(
        `ipinfo.io auto-detected: ${result.current.city}, Pakistan (${detected.ip})`
      );
    } catch (err) {
      if (err instanceof WeatherGuiError) {
        setGuiError({
          title: err.title,
          message: err.message,
          code: err.code,
        });
        setStatusText(`Error: ${err.title}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const togglePinCity = (cityName: string) => {
    setPinnedCities((prev) =>
      prev.includes(cityName)
        ? prev.filter((c) => c !== cityName)
        : [cityName, ...prev]
    );
  };

  const isCurrentPinned = report
    ? pinnedCities.some(
        (c) => c.toLowerCase() === report.current.city.toLowerCase()
      )
    : false;

  return (
    <div className="space-y-4">
      <div className="rounded-2xl overflow-hidden border border-sky-200/90 bg-white shadow-sm">
        {/* Bright Sky-Tinted Tkinter Window Title Bar */}
        <div className="bg-gradient-to-r from-sky-100 via-blue-50 to-teal-50 px-5 py-3 flex flex-wrap items-center justify-between gap-2 border-b border-sky-200">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-400 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-400 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block" />
            </div>
            <span className="text-base font-display font-bold tracking-tight text-slate-800">
              PyWeather Desktop GUI (tkinter) — Pakistan Weather Station
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowEnvBar((v) => !v)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-white text-sky-700 hover:bg-sky-50 border border-sky-200 transition-colors cursor-pointer"
            >
              <KeyRound size={13} className="text-sky-600" />
              <span>{owmApiKey.trim() ? '.env Key Configured' : '.env Config (API Key)'}</span>
            </button>
          </div>
        </div>

        {/* .env Configuration Drawer (Requirement #9) */}
        {showEnvBar && (
          <div className="p-4 border-b border-sky-100 bg-sky-50/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <div className="text-xs font-bold font-mono text-sky-900">
                config.py · os.getenv(&quot;OPENWEATHER_API_KEY&quot;) from .env
              </div>
              <p className="text-xs text-slate-600">
                Enter your OpenWeatherMap Free Tier API key to test live requests, or leave blank to use the built-in Pakistan meteorological feed.
              </p>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
              <input
                type="password"
                value={owmApiKey}
                onChange={(e) => setOwmApiKey(e.target.value)}
                placeholder="OPENWEATHER_API_KEY=..."
                className="w-full sm:w-64 px-3 py-1.5 text-xs font-mono bg-white text-slate-800 border border-sky-300 rounded-lg focus:outline-none focus:border-sky-500"
              />
              <button
                type="button"
                onClick={() => {
                  setShowEnvBar(false);
                  executeWeatherFetch(cityInput);
                }}
                className="inline-flex items-center gap-1 px-3.5 py-1.5 text-xs font-semibold bg-sky-600 hover:bg-sky-500 text-white rounded-lg cursor-pointer whitespace-nowrap shrink-0"
              >
                <Check size={13} />
                <span>Save to .env</span>
              </button>
            </div>
          </div>
        )}

        {/* PROMINENT CITY INPUT FIELD & "GET WEATHER" BUTTON PANEL (Requirement #1, #6, #7) */}
        <div className="p-5 border-b border-slate-200/80 bg-gradient-to-b from-white to-slate-50/60 space-y-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                executeWeatherFetch(cityInput);
              }}
              className="flex-1 space-y-2"
            >
              <label
                htmlFor="tkinter-city-input"
                className="block text-sm font-display font-bold text-slate-800"
              >
                Enter Pakistan City Name (Searchable City Input Field):
              </label>

              <div className="flex flex-wrap sm:flex-nowrap items-stretch gap-2.5">
                {/* Searchable City Input Field */}
                <div
                  ref={searchContainerRef}
                  className="relative flex-1 min-w-[240px]"
                >
                  <div className="relative flex items-center h-full">
                    <Search
                      size={18}
                      className="absolute left-3.5 text-sky-600 pointer-events-none"
                    />
                    <input
                      id="tkinter-city-input"
                      type="text"
                      value={cityInput}
                      onFocus={() => setIsDropdownOpen(true)}
                      onChange={(e) => {
                        setCityInput(e.target.value);
                        setIsDropdownOpen(true);
                      }}
                      placeholder="Type any city in Pakistan (e.g., Layyah, Islamabad, Lahore, Karachi)..."
                      aria-label="City Input Field"
                      className="w-full h-12 bg-white text-slate-900 text-base font-semibold pl-11 pr-16 rounded-xl border-2 border-sky-200 focus:border-sky-500 focus:outline-none transition-colors"
                    />
                    {cityInput && (
                      <button
                        type="button"
                        onClick={() => {
                          setCityInput('');
                          setIsDropdownOpen(true);
                        }}
                        title="Clear city input"
                        className="absolute right-9 text-slate-400 hover:text-slate-700 cursor-pointer"
                      >
                        <X size={16} />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setIsDropdownOpen((v) => !v)}
                      title="Open Pakistan city list"
                      className="absolute right-3 text-slate-500 hover:text-sky-600 cursor-pointer"
                    >
                      <ChevronDown size={18} />
                    </button>
                  </div>

                  {/* Live Searchable Autocomplete Dropdown */}
                  {isDropdownOpen && (
                    <div className="absolute left-0 right-0 top-full mt-1.5 z-30 bg-white rounded-xl border border-sky-200 max-h-72 overflow-y-auto shadow-xl">
                      <div className="px-3.5 py-2 bg-sky-50 text-sky-900 text-xs font-semibold border-b border-sky-100 flex items-center justify-between">
                        <span>
                          Matching Pakistan Cities ({filteredSuggestions.length})
                        </span>
                        <span className="text-sky-600">Click any city to load</span>
                      </div>
                      {filteredSuggestions.length > 0 ? (
                        filteredSuggestions.map((item) => (
                          <button
                            key={`${item.name}-${item.province}`}
                            type="button"
                            onClick={() => {
                              setCityInput(item.name);
                              setIsDropdownOpen(false);
                              executeWeatherFetch(item.name);
                            }}
                            className="w-full text-left px-3.5 py-2.5 text-sm border-b border-slate-100 hover:bg-sky-50/90 transition-colors flex items-center justify-between gap-2 cursor-pointer"
                          >
                            <div>
                              <span className="font-bold text-slate-800">{item.name}</span>
                              <span className="text-xs text-slate-500">
                                {' '}
                                · {item.province} ({item.climateZone})
                              </span>
                            </div>
                            <span className="font-mono tabular-nums text-xs font-semibold text-sky-700 shrink-0">
                              {formatTemp(item.baseTempC, unitSystem)}
                            </span>
                          </button>
                        ))
                      ) : (
                        <div className="p-3.5 text-xs font-mono text-slate-600">
                          Click &quot;Get Weather&quot; to look up &quot;{cityInput.trim()}, Pakistan&quot;
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Prominent "Get Weather" Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex items-center justify-center gap-2 px-6 h-12 text-sm font-display font-bold rounded-xl bg-sky-600 hover:bg-sky-500 text-white disabled:opacity-50 shadow-xs cursor-pointer whitespace-nowrap shrink-0 transition-colors"
                >
                  {isLoading ? (
                    <RefreshCw size={16} className="animate-spin" />
                  ) : (
                    <Search size={16} />
                  )}
                  <span>Get Weather</span>
                </button>
              </div>
            </form>

            {/* Right Controls: Auto-Detect IP (ipinfo.io) + Instant °C / °F Toggle */}
            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={handleAutoDetectIp}
                disabled={isLoading}
                className="inline-flex items-center gap-1.5 px-4 h-12 text-xs font-semibold rounded-xl bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 disabled:opacity-50 cursor-pointer whitespace-nowrap shrink-0 transition-colors"
              >
                <LocateFixed size={15} className="text-emerald-600" />
                <span>Auto-Detect IP (ipinfo.io)</span>
              </button>

              <button
                type="button"
                onClick={() => setUnitSystem((prev) => (prev === 'C' ? 'F' : 'C'))}
                className="px-4 h-12 text-xs font-mono font-bold rounded-xl bg-indigo-50 text-indigo-800 hover:bg-indigo-100 border border-indigo-200 cursor-pointer whitespace-nowrap shrink-0 transition-colors tabular-nums"
              >
                {unitSystem === 'C' ? '°C / m/s  →  Switch to °F' : '°F / mph  →  Switch to °C'}
              </button>
            </div>
          </div>

          {/* Quick Select Bar + Full Pakistan City Directory Dropdown */}
          <div className="pt-3 border-t border-slate-200/70 flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-display font-bold text-slate-600 mr-1 whitespace-nowrap shrink-0">
                Quick Select Pakistan City:
              </span>
              {pinnedCities.map((city) => {
                const isSelected =
                  cityInput.trim().toLowerCase() === city.toLowerCase();
                return (
                  <button
                    key={city}
                    type="button"
                    disabled={isLoading}
                    onClick={() => {
                      setCityInput(city);
                      executeWeatherFetch(city);
                    }}
                    className={`px-3 py-1 text-xs font-semibold rounded-lg border transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                      isSelected
                        ? 'bg-sky-600 text-white border-sky-600'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-sky-50 hover:border-sky-300 hover:text-sky-700'
                    }`}
                  >
                    {city}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2">
              <select
                aria-label="Select from all Pakistan cities"
                value={
                  PAKISTAN_CITIES.find(
                    (c) => c.name.toLowerCase() === cityInput.trim().toLowerCase()
                  )?.name || ''
                }
                onChange={(e) => {
                  if (e.target.value) {
                    setCityInput(e.target.value);
                    executeWeatherFetch(e.target.value);
                  }
                }}
                disabled={isLoading}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-white text-slate-700 border border-slate-200 hover:border-sky-300 cursor-pointer focus:outline-none"
              >
                <option value="" disabled>
                  Select Any Pakistan City ({PAKISTAN_CITIES.length})...
                </option>
                {PAKISTAN_CITIES.map((c) => (
                  <option key={`${c.name}-${c.province}`} value={c.name}>
                    {c.name} — {c.province}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={() => setShowAllDirectory((v) => !v)}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-sky-200 bg-sky-50 text-sky-700 hover:bg-sky-100 transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                {showAllDirectory ? 'Hide Grid' : 'All Cities Grid'}
              </button>
            </div>
          </div>

          {showAllDirectory && (
            <div className="pt-3 border-t border-slate-200/70 space-y-2.5">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-xs font-bold text-slate-600 mr-1">Province Filter:</span>
                {PROVINCE_FILTERS.map((prov) => (
                  <button
                    key={prov.id}
                    type="button"
                    onClick={() => setProvinceFilter(prov.id)}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-lg border cursor-pointer whitespace-nowrap shrink-0 transition-colors ${
                      provinceFilter === prov.id
                        ? 'bg-sky-600 text-white border-sky-600'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-sky-50 hover:text-sky-700'
                    }`}
                  >
                    {prov.label}
                  </button>
                ))}
              </div>

              <div className="max-h-48 overflow-y-auto rounded-xl border border-slate-200 p-2.5 bg-white grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-1.5">
                {directoryCities.map((c) => {
                  const active =
                    cityInput.trim().toLowerCase() === c.name.toLowerCase();
                  return (
                    <button
                      key={`${c.name}-${c.province}`}
                      type="button"
                      onClick={() => {
                        setCityInput(c.name);
                        executeWeatherFetch(c.name);
                      }}
                      className={`px-2.5 py-1.5 text-left text-xs font-medium rounded-lg border truncate cursor-pointer transition-colors ${
                        active
                          ? 'bg-sky-600 text-white border-sky-600 font-bold'
                          : 'bg-slate-50/70 text-slate-700 border-slate-200/80 hover:bg-sky-50 hover:border-sky-300 hover:text-sky-800'
                      }`}
                    >
                      {c.name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* 8. In-GUI Error Notification Banner (Soft Rose Light-Mode Alert) */}
        {guiError && (
          <div
            role="alert"
            className="mx-5 mt-5 p-4 rounded-xl bg-rose-50 text-rose-900 border border-rose-300 flex items-start justify-between gap-4"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-base font-display font-bold text-rose-800">
                <AlertTriangle size={16} className="text-rose-600 shrink-0" />
                <span>{guiError.title}</span>
                {guiError.code && (
                  <span className="text-xs font-mono font-normal text-rose-600">
                    · {guiError.code}
                  </span>
                )}
              </div>
              <p className="text-xs text-rose-700 leading-relaxed">{guiError.message}</p>
            </div>
            <button
              type="button"
              onClick={() => setGuiError(null)}
              className="px-3 py-1 text-xs font-semibold rounded-lg bg-white text-rose-700 border border-rose-200 hover:bg-rose-100 cursor-pointer shrink-0"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Main Results Panel */}
        <div className="p-5 space-y-6 bg-[#F8FAFC]">
          {report ? (
            <>
              {/* Current Weather Results Panel */}
              <div className="rounded-2xl border border-sky-200/80 p-5 bg-gradient-to-br from-white via-sky-50/30 to-teal-50/20 space-y-5">
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-500">
                      <span className="font-bold text-emerald-700">PAKISTAN (PK)</span>
                      <span>·</span>
                      <span className="text-sky-700 font-semibold">{report.current.province}</span>
                      <span>·</span>
                      <span>Elevation {report.current.elevationM}m</span>
                      <span>·</span>
                      <span>
                        {report.current.lat.toFixed(2)}°N,{' '}
                        {report.current.lon.toFixed(2)}°E
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <h1 className="text-3xl sm:text-4xl font-display font-extrabold tracking-tight text-slate-900">
                        {report.current.city}, Pakistan
                      </h1>
                      <button
                        type="button"
                        onClick={() => togglePinCity(report.current.city)}
                        className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-lg border cursor-pointer transition-colors ${
                          isCurrentPinned
                            ? 'bg-amber-100 text-amber-800 border-amber-300'
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-amber-50 hover:text-amber-700'
                        }`}
                      >
                        <Bookmark size={12} />
                        <span>{isCurrentPinned ? 'Pinned' : 'Pin City'}</span>
                      </button>
                    </div>

                    <p className="text-sm font-medium text-slate-600">
                      Condition:{' '}
                      <span className="font-bold text-sky-700">
                        {report.current.description}
                      </span>{' '}
                      · High{' '}
                      <span className="font-mono tabular-nums font-bold text-amber-600">
                        {formatTemp(report.current.tempMaxC, unitSystem)}
                      </span>{' '}
                      / Low{' '}
                      <span className="font-mono tabular-nums font-bold text-sky-600">
                        {formatTemp(report.current.tempMinC, unitSystem)}
                      </span>{' '}
                      · {report.current.climateZone}
                    </p>

                    <div className="flex items-center gap-4 pt-2">
                      <OwmWeatherIcon
                        iconCode={report.current.iconCode}
                        description={report.current.description}
                        size={76}
                      />
                      <div>
                        <div className="text-5xl sm:text-6xl font-display font-extrabold font-mono tabular-nums tracking-tight text-slate-900">
                          {formatTemp(report.current.tempC, unitSystem)}
                        </div>
                        <div className="text-[11px] font-mono text-slate-500 mt-1">
                          Pillow Icon URL:{' '}
                          <span className="font-semibold text-sky-700">
                            {getOwmIconUrl(report.current.iconCode)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Colorful Light-Toned Key Metrics Grid */}
                  <div className="grid grid-cols-2 gap-3 w-full lg:w-auto shrink-0">
                    <div className="rounded-xl border border-sky-200 px-4 py-3 min-w-[165px] bg-sky-50/70">
                      <div className="flex items-center justify-between text-xs font-bold text-sky-800">
                        <span>Humidity</span>
                        <Droplets size={14} className="text-sky-600" />
                      </div>
                      <div className="text-2xl font-bold font-mono tabular-nums text-sky-950 mt-1">
                        {report.current.humidity}%
                      </div>
                      <div className="text-[11px] font-mono text-sky-700 mt-0.5">
                        Cloud Cover: {report.current.cloudCoverPercent}%
                      </div>
                    </div>

                    <div className="rounded-xl border border-teal-200 px-4 py-3 min-w-[165px] bg-teal-50/70">
                      <div className="flex items-center justify-between text-xs font-bold text-teal-800">
                        <span>Wind ({report.current.windDirectionCardinal})</span>
                        <Wind size={14} className="text-teal-600" />
                      </div>
                      <div className="text-2xl font-bold font-mono tabular-nums text-teal-950 mt-1">
                        {formatWind(report.current.windSpeedMs, unitSystem)}
                      </div>
                      <div className="text-[11px] font-mono text-teal-700 mt-0.5">
                        Gusts: {formatWind(report.current.windGustMs, unitSystem)}
                      </div>
                    </div>

                    <div className="rounded-xl border border-indigo-200 px-4 py-3 min-w-[165px] bg-indigo-50/70">
                      <div className="flex items-center justify-between text-xs font-bold text-indigo-800">
                        <span>Feels Like / Dew</span>
                        <Gauge size={14} className="text-indigo-600" />
                      </div>
                      <div className="text-2xl font-bold font-mono tabular-nums text-indigo-950 mt-1">
                        {formatTemp(report.current.feelsLikeC, unitSystem)}
                      </div>
                      <div className="text-[11px] font-mono text-indigo-700 mt-0.5">
                        Dew Point: {formatTemp(report.current.dewPointC, unitSystem)}
                      </div>
                    </div>

                    <div className="rounded-xl border border-amber-200 px-4 py-3 min-w-[165px] bg-amber-50/70">
                      <div className="flex items-center justify-between text-xs font-bold text-amber-800">
                        <span>Pressure & UV</span>
                        <Sun size={14} className="text-amber-600" />
                      </div>
                      <div className="text-2xl font-bold font-mono tabular-nums text-amber-950 mt-1">
                        {report.current.pressureHpa} hPa
                      </div>
                      <div className="text-[11px] font-mono text-amber-700 mt-0.5">
                        UV {report.current.uvIndex} · AQI {report.current.aqiIndex} (
                        {report.current.aqiCategory})
                      </div>
                    </div>
                  </div>
                </div>

                {/* Detailed Atmospheric Telemetry Strip */}
                <div className="pt-4 border-t border-slate-200/80 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 text-xs font-mono tabular-nums">
                  <div className="rounded-lg border border-slate-200 bg-white p-2.5">
                    <div className="text-[11px] font-sans font-semibold text-slate-500">
                      Beaufort Scale
                    </div>
                    <div className="font-bold text-slate-800 mt-0.5">
                      {report.current.beaufortScale}
                    </div>
                  </div>
                  <div className="rounded-lg border border-slate-200 bg-white p-2.5">
                    <div className="text-[11px] font-sans font-semibold text-slate-500">
                      Wind Bearing
                    </div>
                    <div className="font-bold text-slate-800 mt-0.5 inline-flex items-center gap-1">
                      <Compass size={12} className="text-sky-600" />
                      <span>
                        {report.current.windDeg}° {report.current.windDirectionCardinal}
                      </span>
                    </div>
                  </div>
                  <div className="rounded-lg border border-slate-200 bg-white p-2.5">
                    <div className="text-[11px] font-sans font-semibold text-slate-500">
                      Solar Irradiance
                    </div>
                    <div className="font-bold text-amber-700 mt-0.5">
                      {report.current.solarRadiationWm2} W/m²
                    </div>
                  </div>
                  <div className="rounded-lg border border-slate-200 bg-white p-2.5">
                    <div className="text-[11px] font-sans font-semibold text-slate-500">
                      Visibility
                    </div>
                    <div className="font-bold text-slate-800 mt-0.5">
                      {(report.current.visibilityM / 1000).toFixed(1)} km
                    </div>
                  </div>
                  <div className="rounded-lg border border-slate-200 bg-white p-2.5">
                    <div className="text-[11px] font-sans font-semibold text-slate-500">
                      Sunrise / Sunset
                    </div>
                    <div className="font-bold text-slate-800 mt-0.5">
                      {report.current.sunrise.replace(' PKT', '')} /{' '}
                      {report.current.sunset.replace(' PKT', '')}
                    </div>
                  </div>
                  <div className="rounded-lg border border-slate-200 bg-white p-2.5">
                    <div className="text-[11px] font-sans font-semibold text-slate-500">
                      Daylight Duration
                    </div>
                    <div className="font-bold text-emerald-700 mt-0.5">
                      {report.current.dayLength}
                    </div>
                  </div>
                </div>

                {/* Regional Advisory */}
                <div className="rounded-xl border border-emerald-200/90 p-3.5 bg-emerald-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-emerald-950">
                  <div className="leading-relaxed">
                    <span className="font-display font-bold uppercase tracking-wider text-emerald-800 mr-2">
                      Regional Advisory:
                    </span>
                    <span>{report.current.regionalAdvisory}</span>
                  </div>
                  <span className="font-mono text-[11px] text-emerald-700 shrink-0">
                    {report.current.updatedAt}
                  </span>
                </div>
              </div>

              {/* 4. Hourly Forecast Panel for the Next 6 Hours */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-display font-bold tracking-tight text-slate-800">
                    Hourly Forecast — Next 6 Hours ({report.current.city}, Pakistan)
                  </h2>
                  <span className="text-xs font-mono text-slate-500 tabular-nums">
                    +1h to +6h Progression · Active Unit: °{unitSystem}
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
                  {report.hourly6h.map((slot, idx) => (
                    <div
                      key={`${slot.timeLabel}-${idx}`}
                      className="rounded-xl border border-sky-200/80 p-3.5 bg-white hover:bg-sky-50/40 transition-colors flex flex-col items-center text-center"
                    >
                      <span className="text-xs font-mono font-bold text-sky-700 tabular-nums">
                        {slot.timeLabel}
                      </span>
                      <OwmWeatherIcon
                        iconCode={slot.iconCode}
                        description={slot.description}
                        size={46}
                        className="my-2"
                      />
                      <span className="text-lg font-display font-bold font-mono tabular-nums text-slate-900">
                        {formatTemp(slot.tempC, unitSystem)}
                      </span>
                      <span className="text-xs font-medium text-slate-600 mt-0.5 line-clamp-1">
                        {slot.description}
                      </span>
                      <div className="w-full pt-2 mt-2 border-t border-slate-100 text-[11px] font-mono text-slate-500 tabular-nums space-y-0.5">
                        <div>Wind: {formatWind(slot.windSpeedMs, unitSystem)}</div>
                        <div>
                          Hum: {slot.humidity}% · Rain: {slot.popPercent}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 5. Daily Forecast Panel for the Next 5 Days */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-display font-bold tracking-tight text-slate-800">
                    Daily Forecast — Next 5 Days ({report.current.city}, Pakistan)
                  </h2>
                  <span className="text-xs font-mono text-slate-500 tabular-nums">
                    5-Day High / Low & Icons
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5">
                  {report.daily5d.map((day, idx) => (
                    <div
                      key={`${day.dateStr}-${idx}`}
                      className="rounded-xl border border-indigo-200/80 p-4 bg-white hover:bg-indigo-50/30 transition-colors flex flex-col items-center text-center"
                    >
                      <span className="text-xs font-display font-bold text-indigo-800">
                        {day.dayLabel} · {day.dateStr}
                      </span>
                      <OwmWeatherIcon
                        iconCode={day.iconCode}
                        description={day.description}
                        size={50}
                        className="my-2"
                      />
                      <div className="text-base font-bold font-mono tabular-nums text-slate-900">
                        <span className="text-amber-600">
                          {formatTemp(day.tempMaxC, unitSystem)}
                        </span>{' '}
                        <span className="text-slate-400 font-normal">/</span>{' '}
                        <span className="text-sky-600">
                          {formatTemp(day.tempMinC, unitSystem)}
                        </span>
                      </div>
                      <span className="text-xs font-medium text-slate-600 mt-1 line-clamp-1">
                        {day.description}
                      </span>
                      <div className="w-full pt-2 mt-2 border-t border-slate-100 text-[11px] font-mono text-slate-500 tabular-nums space-y-0.5">
                        <div>Humidity: {day.humidityAvg}%</div>
                        <div>
                          Wind: {formatWind(day.windSpeedMs, unitSystem)} · Rain:{' '}
                          {day.popPercent}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="py-16 text-center text-sm font-mono text-slate-500">
              Loading Pakistan weather data...
            </div>
          )}
        </div>

        {/* 8 & 10: In-GUI Error Handling Test Bar */}
        <div className="px-5 py-3 border-t border-slate-200 bg-white flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div className="text-xs text-slate-600">
            <span className="font-display font-bold text-slate-800">
              Test In-GUI Error Handling (Requirement #8):{' '}
            </span>
            <span>
              Click to verify errors appear inside the GUI banner:
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              disabled={isLoading}
              onClick={() => executeWeatherFetch('', 'EMPTY_INPUT')}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 transition-colors cursor-pointer"
            >
              Empty Input
            </button>
            <button
              type="button"
              disabled={isLoading}
              onClick={() => executeWeatherFetch('UnknownCityXYZ', 'CITY_NOT_FOUND')}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 transition-colors cursor-pointer"
            >
              City Not Found (404)
            </button>
            <button
              type="button"
              disabled={isLoading}
              onClick={() => executeWeatherFetch(cityInput || 'Layyah', 'INVALID_API_KEY')}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 transition-colors cursor-pointer"
            >
              Invalid API Key (401)
            </button>
            <button
              type="button"
              disabled={isLoading}
              onClick={() => executeWeatherFetch(cityInput || 'Layyah', 'TIMEOUT')}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 transition-colors cursor-pointer"
            >
              Network Timeout
            </button>
          </div>
        </div>

        {/* 10. Threading Status Bar (Soft Sky Daylight Bar) */}
        <div className="border-t border-sky-200 px-5 py-2.5 bg-sky-50/90 text-sky-900 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
          <span className="truncate">{statusText}</span>
          <span className="font-semibold text-sky-700">
            Units: °{unitSystem} ({unitSystem === 'C' ? 'Metric m/s' : 'Imperial mph'})
          </span>
        </div>
      </div>
    </div>
  );
};
