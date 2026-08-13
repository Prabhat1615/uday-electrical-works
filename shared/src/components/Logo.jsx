import React from 'react';

/**
 * UEW Mark Emblem (Official UEW logo mark)
 */
export const UEMark = ({ size = 'md', className = '' }) => {
  const dimensions = {
    sm: 'h-7 sm:h-8 w-auto',
    md: 'h-8 sm:h-9 w-auto',
    lg: 'h-10 sm:h-11 w-auto',
    xl: 'h-12 sm:h-14 w-auto'
  };

  return (
    <img
      src="/ueworks-mark.png"
      alt="UEW Logo Mark"
      className={`object-contain shrink-0 ${dimensions[size] || dimensions.md} ${className}`}
    />
  );
};

/**
 * Custom Styled Logo Component:
 * - Keeps UEW Logo Emblem Mark visible on left
 * - Exact typography colors: UDAY (Dark) ELECTRICAL (Bright Orange) WORKS (Dark)
 * - Subtitle with orange accent bars: — ELECTRICAL STORE & SERVICES —
 * - Compact & small sizing for clean header integration
 */
export const Logo = ({ 
  portal = 'customer', 
  variant = 'full', 
  size = 'md', 
  light = false, 
  iconOnly = false,
  className = '' 
}) => {
  const containerGap = {
    sm: 'gap-2',
    md: 'gap-2.5',
    lg: 'gap-3',
    xl: 'gap-3.5'
  };

  // Compact, crisp typography font sizes
  const titleSizes = {
    sm: 'text-xs sm:text-sm font-black tracking-tight',
    md: 'text-sm sm:text-base font-black tracking-tight',
    lg: 'text-base sm:text-lg font-black tracking-tight',
    xl: 'text-lg sm:text-xl font-black tracking-tight'
  };

  const subtitleSizes = {
    sm: 'text-[8px] font-extrabold tracking-widest',
    md: 'text-[9px] sm:text-[10px] font-extrabold tracking-widest',
    lg: 'text-[10px] sm:text-[11px] font-extrabold tracking-widest',
    xl: 'text-[11px] sm:text-[12px] font-extrabold tracking-widest'
  };

  const barWidths = {
    sm: 'w-2.5 h-[2px]',
    md: 'w-3 sm:w-3.5 h-[2px]',
    lg: 'w-4 h-[2px]',
    xl: 'w-5 h-[2.5px]'
  };

  const getSubTitle = () => {
    switch (portal) {
      case 'management':
        return 'MANAGEMENT PORTAL';
      case 'technician':
        return 'FIELD TECHNICIAN APP';
      case 'customer':
      default:
        return 'ELECTRICAL STORE & SERVICES';
    }
  };

  if (iconOnly || variant === 'icon') {
    return <UEMark size={size} className={className} />;
  }

  const textColor = light ? 'text-white' : 'text-[#0F172A]';
  const subtitleColor = light ? 'text-slate-200' : 'text-[#0F172A]';

  return (
    <div className={`inline-flex items-center select-none shrink-0 ${containerGap[size] || containerGap.md} ${className}`}>
      {/* 1. Visible UEW Logo Emblem Mark */}
      <UEMark size={size} />

      {/* 2. Custom Typography Layout */}
      <div className="flex flex-col text-left justify-center">
        {/* Main Title: UDAY (Dark) ELECTRICAL (Orange) WORKS (Dark) */}
        <span className={`leading-none font-display whitespace-nowrap ${titleSizes[size] || titleSizes.md}`}>
          <span className={textColor}>UDAY </span>
          <span className="text-[#F97316]">ELECTRICAL </span>
          <span className={textColor}>WORKS</span>
        </span>

        {/* Subtitle with Orange Side Lines: — ELECTRICAL STORE & SERVICES — */}
        <div className="flex items-center gap-1.5 mt-1">
          <span className={`rounded-full bg-[#F97316] shrink-0 ${barWidths[size] || barWidths.md}`} />
          <span className={`uppercase font-display whitespace-nowrap leading-none ${subtitleColor} ${subtitleSizes[size] || subtitleSizes.md}`}>
            {getSubTitle()}
          </span>
          <span className={`rounded-full bg-[#F97316] shrink-0 ${barWidths[size] || barWidths.md}`} />
        </div>
      </div>
    </div>
  );
};

export default Logo;
