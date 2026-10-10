import React, { useState } from 'react';
import {
  Sun,
  Moon,
  CloudSun,
  CloudMoon,
  Cloud,
  CloudRain,
  CloudDrizzle,
  CloudLightning,
  Snowflake,
  CloudFog,
} from 'lucide-react';
import { getOwmIconUrl } from '../services/weatherSimulatorService';

interface OwmWeatherIconProps {
  iconCode: string;
  description: string;
  size?: number;
  className?: string;
}

export const OwmWeatherIcon: React.FC<OwmWeatherIconProps> = ({
  iconCode,
  description,
  size = 64,
  className = '',
}) => {
  const [imgFailed, setImgFailed] = useState(false);
  const url = getOwmIconUrl(iconCode);

  const renderFallbackVector = () => {
    const iconSize = Math.round(size * 0.56);
    const code = iconCode.slice(0, 2);
    const isNight = iconCode.endsWith('n');

    switch (code) {
      case '01':
        return isNight ? (
          <Moon size={iconSize} className="text-indigo-600" />
        ) : (
          <Sun size={iconSize} className="text-amber-500" />
        );
      case '02':
        return isNight ? (
          <CloudMoon size={iconSize} className="text-indigo-500" />
        ) : (
          <CloudSun size={iconSize} className="text-amber-500" />
        );
      case '03':
      case '04':
        return <Cloud size={iconSize} className="text-sky-600" />;
      case '09':
        return <CloudDrizzle size={iconSize} className="text-sky-600" />;
      case '10':
        return <CloudRain size={iconSize} className="text-blue-600" />;
      case '11':
        return <CloudLightning size={iconSize} className="text-amber-600" />;
      case '13':
        return <Snowflake size={iconSize} className="text-cyan-600" />;
      case '50':
        return <CloudFog size={iconSize} className="text-teal-600" />;
      default:
        return <CloudSun size={iconSize} className="text-sky-600" />;
    }
  };

  if (imgFailed) {
    return (
      <div
        style={{ width: size, height: size }}
        className={`inline-flex items-center justify-center rounded-xl border border-sky-200 bg-sky-50 shrink-0 ${className}`}
        title={description}
      >
        {renderFallbackVector()}
      </div>
    );
  }

  return (
    <div
      style={{ width: size, height: size }}
      className={`inline-flex items-center justify-center rounded-xl border border-sky-300/80 bg-gradient-to-br from-sky-400 to-blue-500 shadow-xs shrink-0 ${className}`}
      title={`OpenWeatherMap Pillow Icon: ${url}`}
    >
      <img
        src={url}
        alt={`${description} weather icon`}
        width={size}
        height={size}
        referrerPolicy="no-referrer"
        onError={() => setImgFailed(true)}
        className="w-full h-full object-contain select-none drop-shadow-xs"
      />
    </div>
  );
};
