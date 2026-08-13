import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop component: Automatically resets scroll position to the top
 * whenever the application route changes (pathname or search query parameters).
 * 
 * Resets both the main window scroll and any layout container with scrolling
 * (e.g. <main className="overflow-y-auto"> or .overflow-y-auto).
 */
export const ScrollToTop = () => {
  const { pathname, search } = useLocation();

  useEffect(() => {
    // 1. Reset standard window scrolling
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    if (document.documentElement) {
      document.documentElement.scrollTop = 0;
    }
    if (document.body) {
      document.body.scrollTop = 0;
    }

    // 2. Reset scroll position on scrollable layout containers (e.g., dashboard main elements)
    const scrollContainers = document.querySelectorAll('main, .overflow-y-auto, [data-scroll-container]');
    scrollContainers.forEach((container) => {
      if (container && typeof container.scrollTop === 'number') {
        container.scrollTop = 0;
      }
    });
  }, [pathname, search]);

  return null;
};
