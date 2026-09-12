import type { MetadataRoute } from "next";
export const dynamic = "force-static";
export default function manifest(): MetadataRoute.Manifest {
 const base=process.env.NEXT_PUBLIC_BASE_PATH??"";
 return {
  id:`${base}/`,name:"FUTBOL IQ Fantasy",short_name:"FUTBOL IQ",
  description:"Kadronu kur, transferlerini yönet.",lang:"tr",start_url:`${base}/team/`,scope:`${base}/`,
  display:"standalone",orientation:"any",background_color:"#071522",theme_color:"#071522",
  icons:[192,512].map(size=>({src:`${base}/icons/icon-${size}.png`,sizes:`${size}x${size}`,type:"image/png",purpose:"any"})),
  shortcuts:[{name:"Kadrom",url:`${base}/team/`},{name:"Ana Sayfa",url:`${base}/`}],
 };
}
