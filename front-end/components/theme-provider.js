"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
const ThemeContext = createContext(undefined);
function getSystemTheme() {
    if (typeof window === "undefined")
        return "light";
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
}
function applyThemeClass(theme) {
    if (typeof document === "undefined")
        return;
    const root = document.documentElement;
    const effective = theme === "system" ? getSystemTheme() : theme;
    root.classList.remove("light", "dark");
    if (effective === "dark")
        root.classList.add("dark");
}
export function ThemeProvider({ children }) {
    const [theme, setThemeState] = useState(() => {
        if (typeof window === "undefined")
            return "system";
        return localStorage.getItem("theme") || "system";
    });
    useEffect(() => {
        applyThemeClass(theme);
        try {
            localStorage.setItem("theme", theme);
        }
        catch { }
        if (theme === "system" && typeof window !== "undefined") {
            const mql = window.matchMedia("(prefers-color-scheme: dark)");
            const listener = () => applyThemeClass("system");
            mql.addEventListener?.("change", listener);
            return () => mql.removeEventListener?.("change", listener);
        }
    }, [theme]);
    const value = useMemo(() => ({
        theme,
        setTheme: setThemeState,
    }), [theme]);
    return _jsx(ThemeContext.Provider, { value: value, children: children });
}
export function useTheme() {
    const ctx = useContext(ThemeContext);
    if (!ctx) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return ctx;
}
