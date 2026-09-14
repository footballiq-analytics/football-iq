"use client";
import { createContext,useContext,useEffect,useState,type ReactNode } from "react";
const ThemeContext=createContext({dark:false,toggle:()=>{}});
export function ThemeProvider({children}:{children:ReactNode}){
 const[dark,setDark]=useState(false);const[ready,setReady]=useState(false);
 useEffect(()=>{try{setDark(localStorage.getItem("fiq-theme")==="dark")}catch{}setReady(true)},[]);
 useEffect(()=>{if(!ready)return;document.documentElement.classList.toggle("dark",dark);document.documentElement.dataset.theme=dark?"dark":"light";try{localStorage.setItem("fiq-theme",dark?"dark":"light")}catch{}},[dark,ready]);
 return <ThemeContext.Provider value={{dark,toggle:()=>setDark(value=>!value)}}>{children}</ThemeContext.Provider>;
}
export const useTheme=()=>useContext(ThemeContext);
