export type SharePayload={title:string;text:string;url?:string};
/** Always show a visible, selectable fallback; native sharing starts from the dialog click. */
export async function shareOrCopy(payload:SharePayload):Promise<"shared"|"copied"|"cancelled"|"manual">{
 const text=[payload.text,payload.url].filter(Boolean).join("\n");
 window.dispatchEvent(new CustomEvent("fiq-manual-share",{detail:{title:payload.title,text}}));
 return "manual";
}
