/**
 * Theme Manager for SmartPark
 * Supports Dark/Light mode toggling with localStorage persistence
 */

export function initThemeManager() {
  const savedTheme = localStorage.getItem('smartpark-theme') || 
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    
  setTheme(savedTheme);

  const toggleBtns = document.querySelectorAll('.theme-toggle-btn');
  toggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
      const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
      setTheme(nextTheme);
    });
  });
}

export function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('smartpark-theme', theme);
  
  // Dispatch custom event for canvas/SVG redraw if necessary
  window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme } }));
}
