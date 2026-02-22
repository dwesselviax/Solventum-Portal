import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const DEFAULT_THEME = {
  colorDarkGreen: '#01332b',
  colorBrandGreen: '#05dd4d',
  colorTeal: '#19a591',
  colorMediumTeal: '#1ccf93',
  colorLightTeal: '#bffde3',
  colorHyperlinkTeal: '#0a7b6b',
  colorSuccess: '#2E7D32',
  colorWarning: '#F9A825',
  colorError: '#C62828',
  colorInfo: '#0a7b6b',
  fontHeading: '"Solve Pro", "Inter", Arial, Helvetica, sans-serif',
  fontBody: '"Solve Pro", "Inter", Arial, Helvetica, sans-serif',
  logoUrl: '/solventum-logo.webp',
  portalName: 'Solventum Ortho Portal',
  borderRadius: '8px',
  darkMode: false,
};

export const useThemeStore = create(
  persist(
    (set, get) => ({
      ...DEFAULT_THEME,

      updateTheme: (updates) => {
        set(updates);
        if (typeof window !== 'undefined') {
          const state = { ...get(), ...updates };
          applyThemeToDOM(state);
        }
      },

      resetTheme: () => {
        set(DEFAULT_THEME);
        if (typeof window !== 'undefined') {
          applyThemeToDOM(DEFAULT_THEME);
        }
      },

      initializeTheme: () => {
        if (typeof window !== 'undefined') {
          applyThemeToDOM(get());
        }
      },
    }),
    {
      name: 'solventum-theme',
      storage: createJSONStorage(() =>
        typeof window !== 'undefined' ? localStorage : { getItem: () => null, setItem: () => {}, removeItem: () => {} }
      ),
    }
  )
);

function applyThemeToDOM(theme) {
  const root = document.documentElement;
  root.style.setProperty('--color-dark-green', theme.colorDarkGreen);
  root.style.setProperty('--color-brand-green', theme.colorBrandGreen);
  root.style.setProperty('--color-teal', theme.colorTeal);
  root.style.setProperty('--color-medium-teal', theme.colorMediumTeal);
  root.style.setProperty('--color-light-teal', theme.colorLightTeal);
  root.style.setProperty('--color-hyperlink-teal', theme.colorHyperlinkTeal);
  root.style.setProperty('--color-success', theme.colorSuccess);
  root.style.setProperty('--color-warning', theme.colorWarning);
  root.style.setProperty('--color-error', theme.colorError);
  root.style.setProperty('--color-info', theme.colorInfo);
  root.style.setProperty('--font-heading', theme.fontHeading);
  root.style.setProperty('--font-body', theme.fontBody);
  root.style.setProperty('--radius-md', theme.borderRadius);

  if (theme.darkMode) {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
}
