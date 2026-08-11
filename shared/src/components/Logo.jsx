import React from 'react';
import { motion } from 'framer-motion';

// Scalable Vector UE Monogram Component
export const UEMark = ({ size = 'md', light = false, className = '' }) => {
  const dimensions = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
    xl: 'w-14 h-14'
  };

  const strokeColor = light ? '#FFFFFF' : '#1F2937';

  return (
    <div className={`shrink-0 flex items-center justify-center ${dimensions[size] || dimensions.md} ${className}`}>
      <svg width="100%" height="100%" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-xs">
        {/* Outer U Contour */}
        <path d="M 28 24 V 72 C 28 89.673 42.327 104 60 104 C 77.673 104 92 89.673 92 72 V 24" stroke={strokeColor} strokeWidth="14" strokeLinecap="round" strokeLinejoin="round"/>
        {/* Inner E Terminal in Primary Metallic Gold */}
        <path d="M 46 38 H 82 M 46 60 H 76 M 46 82 H 82" stroke="#D6A84F" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round"/>
        {/* Precision Energy Node */}
        <circle cx="82" cy="38" r="7" fill="#D6A84F" />
      </svg>
    </div>
  );
};

export const Logo = ({ 
  portal = 'customer', 
  variant = 'full', 
  size = 'md', 
  light = false, 
  iconOnly = false,
  className = '' 
}) => {
  const containerSizes = {
    sm: 'space-x-2',
    md: 'space-x-2.5',
    lg: 'space-x-3',
    xl: 'space-x-3.5'
  };

  const titleSizes = {
    sm: 'text-xs font-black tracking-tight',
    md: 'text-sm sm:text-base font-black tracking-tight',
    lg: 'text-lg sm:text-xl font-black tracking-tight',
    xl: 'text-xl sm:text-2xl font-black tracking-tight'
  };

  const subtitleSizes = {
    sm: 'text-[9px] font-extrabold tracking-wider',
    md: 'text-[10px] font-extrabold tracking-wider',
    lg: 'text-[11px] font-extrabold tracking-wider',
    xl: 'text-[12px] font-extrabold tracking-wider'
  };

  // Portal subtitle mapping
  const getSubTitle = () => {
    switch (portal) {
      case 'management':
        return 'MANAGEMENT PORTAL';
      case 'technician':
        return 'TECHNICIAN PORTAL';
      case 'customer':
      default:
        return 'Electrical Store & Services';
    }
  };

  const getTitlePart = () => {
    if (portal === 'management' || portal === 'technician') {
      return (
        <span className={light ? 'text-white' : 'text-[#171A1F]'}>
          UDAY <span className="text-[#D6A84F]">ELECTRICAL</span>
        </span>
      );
    }
    return (
      <span className={light ? 'text-white' : 'text-[#171A1F]'}>
        UDAY <span className="text-[#D6A84F]">ELECTRICAL WORKS</span>
      </span>
    );
  };

  if (iconOnly || variant === 'icon') {
    return <UEMark size={size} light={light} className={className} />;
  }

  return (
    <div className={`inline-flex items-center select-none ${containerSizes[size] || containerSizes.md} ${className}`}>
      {/* Official UE Monogram */}
      <UEMark size={size} light={light} />

      <div className="flex flex-col text-left">
        <span className={`leading-none font-display ${titleSizes[size] || titleSizes.md}`}>
          {getTitlePart()}
        </span>
        <span className={`uppercase block mt-1 leading-none font-display ${light ? 'text-[#E7C878]' : 'text-[#C99532]'} ${subtitleSizes[size] || subtitleSizes.md}`}>
          {getSubTitle()}
        </span>
      </div>
    </div>
  );
};

export default Logo;
