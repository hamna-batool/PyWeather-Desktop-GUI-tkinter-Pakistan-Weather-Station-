/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { TkinterWindowSimulator } from './components/TkinterWindowSimulator';
import { SetupGuidePanel } from './components/SetupGuidePanel';
import { PythonCodeViewer } from './components/PythonCodeViewer';

export default function App() {
  return (
    <div className="min-h-screen bg-[#F4F7FB] text-slate-900 py-6 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* 1. Interactive Tkinter Desktop Weather GUI */}
        <TkinterWindowSimulator />

        {/* 2. Setup Instructions, How to Get a Free OpenWeatherMap API Key & requirements.txt */}
        <SetupGuidePanel />

        {/* 3. Clean, Commented Python Source Code (main.py, weather_service.py, config.py, requirements.txt, .env.example) */}
        <PythonCodeViewer />
      </div>
    </div>
  );
}
