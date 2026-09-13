"use client";
import { useEffect,useRef } from "react";
export default function SaveNotice({success,onClose}:{success:boolean;onClose:()=>void}) {
 const dialog=useRef<HTMLDialogElement>(null);
 useEffect(()=>{dialog.current?.showModal()},[]);
 return <dialog ref={dialog} className="fiq-save-notice" onClose={onClose} aria-labelledby="fiq-save-title"><h2 id="fiq-save-title">{success?"Kadro başarıyla kaydedildi":"Kadro kaydedilemedi"}</h2><p>{success?"Kadron bu tarayıcıya kaydedildi. Temizle son kaydını silmez; yenileyince bu kadro geri gelir.":"Tarayıcı depolamasına yazılamadı. Lütfen tekrar dene."}</p><button type="button" onClick={()=>dialog.current?.close()}>TAMAM</button></dialog>;
}
