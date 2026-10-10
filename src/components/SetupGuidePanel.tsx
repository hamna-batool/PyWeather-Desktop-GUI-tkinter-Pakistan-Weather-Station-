import React, { useState } from 'react';
import { Check, Copy, ExternalLink, Terminal, Cpu } from 'lucide-react';

export const SetupGuidePanel: React.FC = () => {
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  const copyCommand = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCmd(id);
      setTimeout(() => setCopiedCmd(null), 1800);
    } catch {
      // Ignore
    }
  };

  const requirementsContent = `requests>=2.31.0
Pillow>=10.2.0
python-dotenv>=1.0.1`;

  const envContent = `# .env file (Loaded by config.py — never hardcoded in main.py)
OPENWEATHER_API_KEY=your_free_openweathermap_api_key_here
IPINFO_TOKEN=`;

  const terminalSetupCommands = `# 1. Navigate to the project folder
cd python_weather_app

# 2. Install required dependencies (requests, Pillow, python-dotenv)
pip install -r requirements.txt

# 3. Create .env file and paste your OpenWeatherMap API key
cp .env.example .env

# 4. Run the Python Tkinter Desktop App
python main.py`;

  return (
    <div className="rounded-2xl border border-sky-200/90 bg-white text-slate-800 p-6 space-y-6 shadow-xs">
      <div className="border-b border-slate-200 pb-4 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-xl font-display font-extrabold tracking-tight text-slate-900">
            Setup Instructions & How to Get a Free OpenWeatherMap API Key
          </h2>
          <p className="text-xs text-slate-600 mt-1">
            Complete guide for configuring your free API key at openweathermap.org, installing requirements.txt, and running the Python Tkinter desktop app.
          </p>
        </div>
        <a
          href="https://home.openweathermap.org/users/sign_up"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-display font-bold rounded-xl bg-sky-600 text-white hover:bg-sky-500 transition-colors whitespace-nowrap shrink-0"
        >
          <span>Get Free Key at openweathermap.org</span>
          <ExternalLink size={13} />
        </a>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: How to get Free API Key + requirements.txt & .env */}
        <div className="lg:col-span-6 space-y-5">
          <div className="rounded-xl border border-sky-200 bg-sky-50/40 p-4 space-y-3">
            <h3 className="text-sm font-display font-bold text-sky-900">
              Step 1: How to Get a Free API Key at OpenWeatherMap.org
            </h3>
            <ol className="space-y-2.5 text-xs text-slate-700 list-decimal list-inside leading-relaxed">
              <li>
                Go to{' '}
                <a
                  href="https://openweathermap.org/"
                  target="_blank"
                  rel="noreferrer"
                  className="font-mono font-bold text-sky-700 underline"
                >
                  https://openweathermap.org/
                </a>{' '}
                and click <strong>Sign In</strong> → <strong>Create an Account</strong>.
              </li>
              <li>
                Verify your email address by clicking the confirmation link sent to your inbox.
              </li>
              <li>
                Log in and open your profile menu →{' '}
                <a
                  href="https://home.openweathermap.org/api_keys"
                  target="_blank"
                  rel="noreferrer"
                  className="font-mono font-bold text-sky-700 underline"
                >
                  My API keys
                </a>{' '}
                (or generate a new key under <strong>Create key</strong>).
              </li>
              <li>
                Copy your 32-character API key and paste it into your <code className="font-mono font-bold text-sky-800">.env</code> file as{' '}
                <code className="font-mono font-bold text-emerald-700">OPENWEATHER_API_KEY=your_key</code>.
              </li>
              <li>
                <strong>Note:</strong> Newly generated free-tier keys take <strong>10 to 30 minutes</strong> to activate on OpenWeatherMap servers.
              </li>
            </ol>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-display font-bold text-slate-800">requirements.txt</span>
                <button
                  type="button"
                  onClick={() => copyCommand('req', requirementsContent)}
                  className="inline-flex items-center gap-1 text-[11px] font-mono font-semibold rounded-md border border-sky-200 px-2 py-0.5 bg-white text-sky-700 hover:bg-sky-50 cursor-pointer"
                >
                  {copiedCmd === 'req' ? <Check size={11} /> : <Copy size={11} />}
                  <span>{copiedCmd === 'req' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <pre className="rounded-lg bg-white border border-slate-200 text-slate-800 p-3 text-xs font-mono overflow-x-auto">
                {requirementsContent}
              </pre>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-display font-bold text-slate-800">.env (Requirement #9)</span>
                <button
                  type="button"
                  onClick={() => copyCommand('env', envContent)}
                  className="inline-flex items-center gap-1 text-[11px] font-mono font-semibold rounded-md border border-sky-200 px-2 py-0.5 bg-white text-sky-700 hover:bg-sky-50 cursor-pointer"
                >
                  {copiedCmd === 'env' ? <Check size={11} /> : <Copy size={11} />}
                  <span>{copiedCmd === 'env' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <pre className="rounded-lg bg-white border border-slate-200 text-slate-800 p-3 text-xs font-mono overflow-x-auto">
                {envContent}
              </pre>
            </div>
          </div>
        </div>

        {/* Right Column: Terminal Setup Commands & Architecture Checklist */}
        <div className="lg:col-span-6 space-y-5">
          <div className="rounded-xl border border-indigo-200 bg-indigo-50/30 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-indigo-900">
                <Terminal size={15} className="text-indigo-600" />
                <h3 className="text-sm font-display font-bold">
                  Step 2: Install Dependencies & Run App
                </h3>
              </div>
              <button
                type="button"
                onClick={() => copyCommand('setup', terminalSetupCommands)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg bg-white text-indigo-700 border border-indigo-200 hover:bg-indigo-50 cursor-pointer"
              >
                {copiedCmd === 'setup' ? <Check size={12} /> : <Copy size={12} />}
                <span>{copiedCmd === 'setup' ? 'Copied' : 'Copy Commands'}</span>
              </button>
            </div>
            <pre className="rounded-lg bg-white border border-indigo-100 text-slate-800 p-3.5 text-xs font-mono overflow-x-auto leading-relaxed">
              {terminalSetupCommands}
            </pre>
          </div>

          <div className="rounded-xl border border-emerald-200 bg-emerald-50/30 p-4 space-y-2.5">
            <div className="flex items-center gap-2 text-emerald-900">
              <Cpu size={15} className="text-emerald-600" />
              <h3 className="text-sm font-display font-bold">
                All 10 Technical Requirements Implemented
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
              <div className="rounded-lg border border-emerald-200/80 bg-white p-2.5">
                <strong className="text-slate-900">1–2. Tkinter GUI & Metrics:</strong> City input, Get Weather button, temp, humidity, wind, description.
              </div>
              <div className="rounded-lg border border-emerald-200/80 bg-white p-2.5">
                <strong className="text-slate-900">3. Pillow Icons:</strong> Loaded from <code className="font-mono text-sky-700">/img/wn/&#123;icon&#125;@2x.png</code> via <code className="font-mono">PIL.ImageTk</code>.
              </div>
              <div className="rounded-lg border border-emerald-200/80 bg-white p-2.5">
                <strong className="text-slate-900">4–5. Forecasts:</strong> Next 6 Hours progression & 5-Day Forecast panels.
              </div>
              <div className="rounded-lg border border-emerald-200/80 bg-white p-2.5">
                <strong className="text-slate-900">6–7. °C/°F & IP Geo:</strong> Instant unit toggle + <code className="font-mono text-emerald-700">ipinfo.io/json</code> auto-detect.
              </div>
              <div className="rounded-lg border border-emerald-200/80 bg-white p-2.5">
                <strong className="text-slate-900">8. In-GUI Errors:</strong> 404, 401, Timeout, and Empty Input shown inside GUI banner.
              </div>
              <div className="rounded-lg border border-emerald-200/80 bg-white p-2.5">
                <strong className="text-slate-900">9–10. .env & Threading:</strong> Key in <code className="font-mono">.env</code> + <code className="font-mono">threading.Thread</code> worker.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
