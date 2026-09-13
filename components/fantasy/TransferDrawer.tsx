"use client";
import { useEffect, useRef, type ReactNode } from "react";

/** A nonmodal panel leaves the toolbar toggle available and preserves filters. */
export default function TransferDrawer({open,portrait,dragging,onClose,children}:{open:boolean;portrait:boolean;dragging:boolean;onClose:()=>void;children:ReactNode}) {
 const panel=useRef<HTMLDivElement>(null);
 const closeRef=useRef(onClose);closeRef.current=onClose;
 const dismissible=portrait&&open&&!dragging;
 useEffect(()=>{
  if(!dismissible)return;
  function outside(event:PointerEvent){
   const target=event.target;
   if(!(target instanceof Node)||panel.current?.contains(target)||document.getElementById("fiq-transfer-trigger")?.contains(target))return;
   closeRef.current();
  }
  function key(event:KeyboardEvent){if(event.key==="Escape"){event.preventDefault();closeRef.current();document.getElementById("fiq-transfer-trigger")?.focus()}}
  document.addEventListener("pointerdown",outside,true);
  document.addEventListener("keydown",key);
  return()=>{document.removeEventListener("pointerdown",outside,true);document.removeEventListener("keydown",key)};
 },[dismissible]);
 return <>
  {dismissible?<button className="fiq-market-backdrop" tabIndex={-1} aria-label="Transfer paneli dışına dokunarak kapat" onClick={onClose}/>:null}
  <div ref={panel} id="fiq-transfer-drawer" className={`fiq-transfer-drawer ${open?"is-open":""} ${dragging&&portrait?"is-dragging":""}`} role="region" aria-label="Transfer Merkezi" inert={portrait&&!open}>{children}</div>
 </>;
}
