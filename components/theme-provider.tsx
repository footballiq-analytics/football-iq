"use client";
import { createContext,useContext,useEffect,type ReactNode } from "react";
const lightTheme={dark:false,toggle:()=>{}};
const ThemeContext=createContext(lightTheme);
export function ThemeProvider({children}:{children:ReactNode}){
 // Dark mode was retired; migrate its old preference without touching saved squads.
 useEffect(()=>{document.documentElement.classList.remove("dark");document.documentElement.dataset.theme="light";try{localStorage.setItem("fiq-theme","light")}catch{}},[]);
 useEffect(()=>{
  const media=window.matchMedia("(display-mode: standalone)");
  const update=()=>{document.documentElement.dataset.installed=String(media.matches||(navigator as Navigator & {standalone?:boolean}).standalone===true)};
  update();media.addEventListener("change",update);window.addEventListener("pageshow",update);
  return()=>{media.removeEventListener("change",update);window.removeEventListener("pageshow",update)};
 },[]);
 return <ThemeContext.Provider value={lightTheme}>{children}</ThemeContext.Provider>;
}
export const useTheme=()=>useContext(ThemeContext);
