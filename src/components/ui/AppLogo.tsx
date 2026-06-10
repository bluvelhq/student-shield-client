import React from 'react';

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
  if (size === 'sm') iconSize = 18;
  else if (size === 'md') iconSize = 22;
  else if (size === 'lg') iconSize = 28;
  else if (typeof size === 'number') iconSize = size;

  return (
    <div className={`flex items-center space-x-2.5 select-none ${className}`}>
      {/* Precision styled container to match the high-end geometric brand feeling */}
      <div 
        className={`bg-royal flex items-center justify-center text-white transition-colors duration-300 shadow-sm ${
          size === 'lg' ? 'w-10 h-10' : size === 'sm' ? 'w-8 h-8' : 'w-9 h-9'
        } ${iconClassName}`}
      >
        <svg 
          width={iconSize} 
          height={iconSize} 
          viewBox="0 0 24 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* S-shaped lightning double bar structure resembling the uploaded logo */}
          <path 
            d="M21.362 10.329l-9.068-10c-.394-.439-1.079-.241-1.197.346L9.897 6.44H3.83c-.808 0-1.285.89-.785 1.523l9.068 10c.394.439 1.079.241 1.197-.346l1.2-5.765h6.067c.808 0 1.285-.89.785-1.523z" 
            fill="currentColor"
          />
        </svg>
      </div>
      <div>
        <span 
          className={`font-bold tracking-tight block leading-none font-sans ${
            size === 'lg' ? 'text-lg' : size === 'sm' ? 'text-sm' : 'text-[15px]'
          } ${textColor ? textColor : 'text-[#00183D]'}`}
        >
          Student<span className="text-royal">Shield</span>
        </span>
      </div>
    </div>
  );
};
