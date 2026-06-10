import React, { useState } from 'react';

interface AppLogoProps {
  className?: string;
  iconClassName?: string;
  size?: 'sm' | 'md' | 'lg' | number;
  textColor?: string;
}

/**
 * AppLogo now prefers an uploaded raster logo at `/assets/images/brand-logo.png`.
 * If that file isn't present or fails to load, we fall back to the original SVG emblem.
 * - To use the uploaded logo: place the image at `src/assets/images/brand-logo.png`
 *   (Vite will serve it at `/assets/images/brand-logo.png`), or put it in `public/brand-logo.png`
 */
export const AppLogo: React.FC<AppLogoProps> = ({
  className = '',
  iconClassName = '',
  size = 'md',
  textColor,
}) => {
  // Determine width and height based on the size prop
  let iconSize = 22;
  let containerSizeClass = 'w-9 h-9';
  let textSizeClass = 'text-[15px]';
  if (size === 'sm') {
    iconSize = 18;
    containerSizeClass = 'w-8 h-8';
    textSizeClass = 'text-sm';
  } else if (size === 'md') {
    iconSize = 22;
    containerSizeClass = 'w-9 h-9';
    textSizeClass = 'text-[15px]';
  } else if (size === 'lg') {
    iconSize = 28;
    containerSizeClass = 'w-10 h-10';
    textSizeClass = 'text-lg';
  } else if (typeof size === 'number') {
    iconSize = size;
  }

  const [imageOk, setImageOk] = useState(true);

  // Build candidate image URL: prefer assets folder (Vite serves from /assets when imported from src)
  const candidatePaths = [
    '/assets/images/brand-logo.png', // expected when placed under src/assets/images and built by Vite
    '/brand-logo.png', // fall back to public folder
  ];

  const imgStyle: React.CSSProperties = {
    width: iconSize,
    height: iconSize,
    objectFit: 'contain',
  };

  return (
    <div className={`flex items-center space-x-2.5 select-none ${className}`}>
      {/* Icon: try raster image first, fallback to SVG */}
      <div
        className={`flex items-center justify-center text-white transition-colors duration-300 shadow-sm ${containerSizeClass} ${iconClassName} bg-transparent overflow-hidden`}
      >
        {imageOk ? (
          // Render first candidate that loads successfully; onError will switch to fallback SVG
          <img
            src={candidatePaths[0]}
            alt="StudentShield"
            style={imgStyle}
            onError={() => setImageOk(false)}
            referrerPolicy="no-referrer"
          />
        ) : (
          // SVG fallback (original emblem)
          <svg
            width={iconSize}
            height={iconSize}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M21.362 10.329l-9.068-10c-.394-.439-1.079-.241-1.197.346L9.897 6.44H3.83c-.808 0-1.285.89-.785 1.523l9.068 10c.394.439 1.079.241 1.197-.346l1.2-5.765h6.067c.808 0 1.285-.89.785-1.523z"
              fill="currentColor"
            />
          </svg>
        )}
      </div>

      <div>
        <span
          className={`font-bold tracking-tight block leading-none font-sans ${textSizeClass} ${textColor ? textColor : 'text-[#00183D]'}`}
        >
          Student<span className="text-royal">Shield</span>
        </span>
      </div>
    </div>
  );
};
