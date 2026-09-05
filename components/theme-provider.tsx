"use client";
import { createContext, useContext, useEffect, useState } from "react";
const ThemeContext = createContext({ dark: false, toggle: () => {} });
export function ThemeProvider({ children }: { children: React.ReactNode }) { const [dark, setDark] = useState(false); useEffect(() => { const saved = localStorage.getItem("fiq-theme"); const isDark = saved === "dark" || (!saved && matchMedia("(prefers-color-scheme: dark)").matches); setDark(isDark); document.documentElement.classList.toggle("dark", isDark); }, []); const toggle = () => setDark((value) => { const next = !value; document.documentElement.classList.toggle("dark", next); localStorage.setItem("fiq-theme", next ? "dark" : "light"); return next; }); return <ThemeContext.Provider value={{ dark, toggle }}>{children}</ThemeContext.Provider>; }
export const useTheme = () => useContext(ThemeContext);
