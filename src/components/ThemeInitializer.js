'use client';

import { useEffect } from 'react';

export default function ThemeInitializer() {
  useEffect(() => {
    // Set dark mode as default if no theme is set
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (!savedTheme) {
        localStorage.setItem('theme', 'dark');
        document.documentElement.classList.add('dark');
      }
    }
  }, []);

  return null;
}
