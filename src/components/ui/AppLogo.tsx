import React from 'react';
// @ts-expect-error - png asset loaded via vite builder
import logoBlue from '../../assets/images/LOGO BLUE.png';

interface AppLogoProps {
  className?: string;
  iconClassName?: string;
  size?: 'sm' | 'md' | 'lg' | number;
  textColor?: string;
}

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

  const imgStyle: React.CSSProperties = {
    width: iconSize,
    height: iconSize,
    objectFit: 'contain',
  };

  return (
    <div className={`flex items-center space-x-2.5 select-none ${className}`}>
      {/* Icon: use imported Logo Blue */}
      <div
        className={`flex items-center justify-center text-white transition-colors duration-300 shadow-sm ${containerSizeClass} ${iconClassName} bg-transparent overflow-hidden`}
      >
        <img
          src={logoBlue}
          alt="StudentShield"
          style={imgStyle}
          referrerPolicy="no-referrer"
        />
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

