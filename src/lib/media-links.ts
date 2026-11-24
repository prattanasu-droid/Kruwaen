import type {Media} from './data';
/** Accept complete web URLs; reject script URLs and embedded credentials. */
export function normalizeResourceUrl(value:unknown):string|null{
 if(typeof value!=='string'||!value.trim()||value.trim().length>2048)return null;
 try{const url=new URL(value.trim());return ['https:','http:'].includes(url.protocol)&&!url.username&&!url.password?url.href:null}catch{return null}
}
export function resourceAction(type:string){
 if(type==='เกมการเรียนรู้'||type==='เกมการศึกษา')return {label:'เล่นเกม',fieldLabel:'ลิงก์เกมการศึกษา',kind:'game'} as const;
 if(type==='วิดีโอ')return {label:'ดูวิดีโอ',fieldLabel:'ลิงก์วิดีโอ',kind:'video'} as const;
 if(type==='สื่อสร้างสรรค์')return {label:'เปิดดู',fieldLabel:'ลิงก์สื่อการเรียนรู้',kind:'view'} as const;
 return {label:'ดาวน์โหลดสื่อ',fieldLabel:'ลิงก์สื่อการเรียนรู้',kind:'download'} as const;
}
export function mediaHref(media:Pick<Media,'url'|'file'>):string|null{
 const external=normalizeResourceUrl(media.url);if(external)return external;
 return typeof media.file==='string'&&(/^\/files\/[a-f0-9-]+\/[a-zA-Z0-9_.%-]+$/.test(media.file)||/^\/worksheets\/[a-z]+\.svg$/.test(media.file))?media.file:null;
}
