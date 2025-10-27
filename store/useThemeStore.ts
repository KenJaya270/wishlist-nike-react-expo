import {create} from 'zustand';

type theme = 'light' | 'dark';

interface ThemeState {
    theme: theme;
    toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>()((set) => ({
    theme: 'light',
    toggleTheme: () => set((state) => ({theme: state.theme === 'light' ? 'dark' : 'light'}))
}))