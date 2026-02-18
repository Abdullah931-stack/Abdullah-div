"use client";

import {
    createContext,
    useContext,
    useEffect,
    useState,
    useCallback,
    type ReactNode,
} from "react";
import type { Theme } from "@/types";

// ─────────────────────────────────────────────
// Context
// ─────────────────────────────────────────────
interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
    setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// ─────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────
const STORAGE_KEY = "theme-preference";
const DEFAULT_THEME: Theme = "dark";

// ─────────────────────────────────────────────
// Provider
// ─────────────────────────────────────────────
interface ThemeProviderProps {
    children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
    const [theme, setThemeState] = useState<Theme>(DEFAULT_THEME);
    const [mounted, setMounted] = useState(false);

    // Load saved theme on mount
    useEffect(() => {
        const savedTheme = localStorage.getItem(STORAGE_KEY) as Theme | null;
        if (savedTheme && (savedTheme === "dark" || savedTheme === "light")) {
            setThemeState(savedTheme);
        }
        setMounted(true);
    }, []);

    // Apply theme to document
    useEffect(() => {
        if (mounted) {
            document.documentElement.setAttribute("data-theme", theme);
            localStorage.setItem(STORAGE_KEY, theme);
        }
    }, [theme, mounted]);

    const setTheme = useCallback((newTheme: Theme) => {
        setThemeState(newTheme);
    }, []);

    const toggleTheme = useCallback(() => {
        setThemeState((prev) => (prev === "dark" ? "light" : "dark"));
    }, []);

    // Always provide the context so child hooks don't throw.
    // Before mount, hide content to prevent flash of wrong theme.
    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
            {mounted ? (
                children
            ) : (
                <div style={{ visibility: "hidden" }} suppressHydrationWarning>
                    {children}
                </div>
            )}
        </ThemeContext.Provider>
    );
}

// ─────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────
export function useTheme(): ThemeContextType {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
}
