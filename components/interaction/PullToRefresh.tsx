"use client";
import {useEffect,useRef,useState} from "react";
export default function PullToRefresh(){
 const[distance,setDistance]=useState(0);const[refreshing,setRefreshing]=useState(false);const busy=useRef(false);
 useEffect(()=>{
  let start:{x:number;y:number}|null=null;let pull=0;let engaged=false;
  const reset=()=>{start=null;pull=0;engaged=false;setDistance(0)};
  function begin(event:TouchEvent){
   if(busy.current||event.touches.length!==1||window.scrollY>0||document.querySelector("dialog[open],.mobile-drawer-backdrop"))return;
   const target=event.target;
   if(!(target instanceof Element)||target.closest('button,a,input,select,textarea,dialog,[role="button"],[data-fiq-dnd],.fiq-field-slot,.fiq-bench-slot,.fiq-transfer-drawer,.mobile-drawer'))return;
   for(let el:Element|null=target;el;el=el.parentElement)if(el.scrollTop>0&&el.scrollHeight>el.clientHeight+2)return;
   const touch=event.touches[0];start={x:touch.clientX,y:touch.clientY};pull=0;engaged=false;
  }
  function move(event:TouchEvent){
   if(!start)return;
   if(event.touches.length!==1){reset();return}
   const touch=event.touches[0],dy=touch.clientY-start.y,dx=Math.abs(touch.clientX-start.x);
   if(dy<0||dx>Math.max(18,dy*.65)){reset();return}
   if(dy<12&&!engaged)return;
   if(!event.cancelable){reset();return}
   engaged=true;event.preventDefault();pull=Math.min(110,dy*.65);setDistance(pull);
  }
  function end(){
   const refresh=engaged&&pull>=70;reset();
   if(refresh&&!busy.current){busy.current=true;setRefreshing(true);window.location.reload()}
  }
  document.addEventListener("touchstart",begin,{passive:true});
  document.addEventListener("touchmove",move,{passive:false});
  document.addEventListener("touchend",end,{passive:true});
  document.addEventListener("touchcancel",reset,{passive:true});
  window.addEventListener("orientationchange",reset);
  return()=>{document.removeEventListener("touchstart",begin);document.removeEventListener("touchmove",move);document.removeEventListener("touchend",end);document.removeEventListener("touchcancel",reset);window.removeEventListener("orientationchange",reset)};
 },[]);
 return <div className="fiq-pull-refresh" role="status" aria-live="polite" style={{opacity:distance>0||refreshing?1:0,transform:`translate(-50%,${Math.min(distance,72)-18}px)`}}>{refreshing?"Yenileniyor…":distance>=70?"Yenilemek için bırak":"Yenilemek için aşağı çek"}</div>;
}
