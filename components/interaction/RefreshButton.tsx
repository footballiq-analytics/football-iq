"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

/** A native document navigation also works without a React click handler. */
export default function RefreshButton() {
 const pathname=usePathname();
 const [href,setHref]=useState("?");
 const [refreshing,setRefreshing]=useState(false);
 useEffect(()=>{
  const url=new URL(window.location.href);
  url.searchParams.set("_refresh",String(Date.now()));
  setHref(url.href);
 setRefreshing(false);
 },[pathname]);
 return <a href={href} className="fiq-refresh-button" aria-label={refreshing?"Sayfa yenileniyor":"Sayfayı yenile"} title="Sayfayı yenile" onClick={event=>{const url=new URL(window.location.href);url.searchParams.set("_refresh",String(Date.now()));event.currentTarget.href=url.href;setRefreshing(true)}} aria-busy={refreshing}>
  <svg aria-hidden="true" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 7v5h-5M4 17v-5h5"/><path d="M6.1 7a7 7 0 0 1 11.6-1L20 9M4 15l2.3 3A7 7 0 0 0 17.9 17"/></svg>
 </a>;
}
