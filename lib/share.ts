export type SharePayload={title:string;text:string;url?:string};
export async function shareOrCopy(payload:SharePayload):Promise<"shared"|"copied"|"cancelled"|"manual">{
 if(navigator.share){try{await navigator.share(payload);return "shared"}catch(error){if(error instanceof DOMException&&error.name==="AbortError")return "cancelled"}}
 const text=[payload.text,payload.url].filter(Boolean).join("\n");
 try{await navigator.clipboard.writeText(text);return "copied"}catch{
  window.dispatchEvent(new CustomEvent("fiq-manual-share",{detail:{title:payload.title,text}}));return "manual";
 }
}
