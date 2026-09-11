"use client";

import { useEffect, useRef, type ReactNode } from "react";

/** Keep the market mounted: rotating or dragging never resets its filters. */
export default function TransferDrawer({open,portrait,dragging,onClose,children}:{open:boolean;portrait:boolean;dragging:boolean;onClose:()=>void;children:ReactNode}) {
 const panel=useRef<HTMLDivElement>(null);
 const modal=portrait&&open&&!dragging;
 const closeRef=useRef(onClose);closeRef.current=onClose;
 useEffect(()=>{
  if(!modal)return;
  const previous=document.activeElement as HTMLElement|null;
  const shell=Array.from(document.querySelectorAll<HTMLElement>(".fiq-header,.fiq-bottom-nav"));
  const prior=shell.map(el=>el.inert);shell.forEach(el=>{el.inert=true});
  panel.current?.querySelector<HTMLButtonElement>(".fiq-transfer-close")?.focus({preventScroll:true});
  function key(e:KeyboardEvent){
   if(e.key==="Escape"){e.preventDefault();closeRef.current();return}
   if(e.key!=="Tab")return;
   const nodes=Array.from(panel.current?.querySelectorAll<HTMLElement>('button:not(:disabled),input,select,a[href],[tabindex="0"]')??[]).filter(el=>el.getClientRects().length);
   const first=nodes[0],last=nodes[nodes.length-1];
   if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus()}
   else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus()}
  }
  document.addEventListener("keydown",key);
  return()=>{document.removeEventListener("keydown",key);shell.forEach((el,i)=>{el.inert=prior[i]});if(previous?.isConnected)previous.focus({preventScroll:true})};
 },[modal]);
 useEffect(()=>{
  if(!portrait||!open)return;
  const viewport=window.visualViewport;
  const update=()=>{if(panel.current){panel.current.style.setProperty("--market-height",`${viewport?.height??window.innerHeight}px`);panel.current.style.setProperty("--market-top",`${viewport?.offsetTop??0}px`)}};
  update();viewport?.addEventListener("resize",update);viewport?.addEventListener("scroll",update);
  return()=>{viewport?.removeEventListener("resize",update);viewport?.removeEventListener("scroll",update)};
 },[portrait,open]);
 return <>
  {modal?<button className="fiq-market-backdrop" tabIndex={-1} aria-label="Transfer Merkezi’ni kapat" onClick={onClose}/>:null}
  <div ref={panel} id="fiq-transfer-drawer" className={`fiq-transfer-drawer ${open?"is-open":""} ${dragging&&portrait?"is-dragging":""}`} role={modal?"dialog":undefined} aria-modal={modal||undefined} aria-label="Transfer Merkezi" inert={portrait&&!open}>
   <button type="button" className="fiq-transfer-close" aria-label="Transfer panelini kapat" onClick={onClose}>×</button>
   {children}
  </div>
 </>;
}
