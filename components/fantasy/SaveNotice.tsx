"use client";
import { useEffect,useRef } from "react";
export default function SaveNotice({success,onClose}:{success:boolean;onClose:()=>void}) {
 const dialog=useRef<HTMLDialogElement>(null);
 useEffect(()=>{dialog.current?.showModal()},[]);
 return <dialog ref={dialog} className="fiq-save-notice" onClose={onClose} onClick={e=>{if(e.target===e.currentTarget){const b=e.currentTarget.getBoundingClientRect();if(e.clientX<b.left||e.clientX>b.right||e.clientY<b.top||e.clientY>b.bottom)e.currentTarget.close()}}} aria-labelledby="fiq-save-title"><h2 id="fiq-save-title">{success?"Kadro başarıyla kaydedildi":"Kadro kaydedilemedi"}</h2><p>{success?"Kadron bu tarayıcıya kaydedildi. Kadroyu temizle düğmesi kayıtlı kadronu da temizler.":"Tarayıcı depolamasına yazılamadı. Lütfen tekrar dene."}</p><button type="button" onClick={()=>dialog.current?.close()}>TAMAM</button></dialog>;
}

