import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Simple utility component to reset scroll to top on route change
export function ScrollToTop() {
  const { pathname, search, hash } = useLocation();

  useEffect(() => {
    // If there's a hash anchor, attempt to scroll to it; otherwise scroll to top
    if (hash) {
      // try to find the element matching the hash
      const id = hash.replace('#', '');
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
    }

    // Default: scroll to top (smooth)
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, [pathname, search, hash]);

  return null;
}
