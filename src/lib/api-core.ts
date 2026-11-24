import type {SupabaseClient} from '@supabase/supabase-js';
import {subjects,grades,types,type Media} from './data.ts';
import {normalizeResourceUrl} from './media-links.ts';

export class LibraryError extends Error {
  code:string;
  constructor(message:string,code='LIBRARY_ERROR'){super(message);this.code=code;}
}
type Config={url:string;table:string;bucket:string};
const columns='id,title,type,subject,grade,description,image,url,featured,created_at';
const uuid=/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i;
function mapped(row:Record<string,unknown>):Media{return {id:String(row.id),title:String(row.title),type:String(row.type),subject:String(row.subject),grade:String(row.grade),description:String(row.description),image:String(row.image),url:String(row.url),featured:!!row.featured,created:String(row.created_at),sample:false};}
function databaseError(error:{code?:string;message?:string;status?:number;statusCode?:string|number},storage=false):never{
  if(storage){
    if(error.message?.toLowerCase().includes('bucket not found'))throw new LibraryError('ยังไม่พบพื้นที่เก็บภาพ media-covers ใน Supabase Storage');
    throw new LibraryError('อัปโหลดภาพไม่ได้ กรุณาตรวจสอบสิทธิ์แอดมินและนโยบายของพื้นที่ media-covers','STORAGE_ACCESS_DENIED');
  }
  if(error.code==='PGRST301'||error.code==='PGRST303'||error.status===401)throw new LibraryError('เซสชันหมดอายุ กรุณาเข้าสู่ระบบอีกครั้ง','ADMIN_AUTH_REQUIRED');
  if(error.code==='42501')throw new LibraryError('บัญชีนี้ไม่มีสิทธิ์ดำเนินการ กรุณาตรวจสอบ admin_users และ RLS','ADMIN_ACCESS_DENIED');
  if(['PGRST205','PGRST204','42703','42P01'].includes(error.code||''))throw new LibraryError('กรุณาตรวจสอบตาราง media และคอลัมน์ตามไฟล์ supabase/schema.sql');
  throw new LibraryError('Supabase ไม่สามารถดำเนินการได้ กรุณาตรวจสอบข้อมูลและการเชื่อมต่อ');
}

/** Browser application API. Supabase Auth and RLS protect the underlying operations. */
export function createLibraryApi(client:SupabaseClient,config:Config){
  async function userOrNull(){
    const {data,error}=await client.auth.getUser();
    if(error){if(error.name==='AuthSessionMissingError'||error.status===401||error.status===403)return null;throw new LibraryError('ตรวจสอบการเข้าสู่ระบบไม่สำเร็จ กรุณาลองอีกครั้ง');}
    return data.user;
  }
  async function membership(userId:string){
    const {data,error}=await client.from('admin_users').select('user_id').eq('user_id',userId).limit(1);
    if(error)databaseError(error);
    return !!data?.some(row=>row.user_id===userId);
  }
  async function requireAdmin(){
    const user=await userOrNull();if(!user)throw new LibraryError('กรุณาเข้าสู่ระบบแอดมิน','ADMIN_AUTH_REQUIRED');
    if(!await membership(user.id))throw new LibraryError('บัญชีนี้ยังไม่มีสิทธิ์แอดมิน กรุณาเพิ่ม User UID ในตาราง admin_users','ADMIN_ACCESS_DENIED');
    return user;
  }
  async function session(){const user=await userOrNull();return {authenticated:!!user&&await membership(user.id),email:user?.email};}
  async function login(email:string,password:string){
    const {error}=await client.auth.signInWithPassword({email:email.trim(),password});
    if(error)throw new LibraryError(error.status===429?'เข้าสู่ระบบบ่อยเกินไป กรุณารอสักครู่':'อีเมลหรือรหัสผ่านไม่ถูกต้อง หรือบัญชียังไม่ได้ยืนยันอีเมล');
    try{const result=await session();if(!result.authenticated)throw new LibraryError('บัญชีนี้ยังไม่มีสิทธิ์แอดมิน กรุณาเพิ่ม User UID ในตาราง admin_users');return result;}catch(error){await client.auth.signOut({scope:'local'});throw error;}
  }
  async function logout(){const {error}=await client.auth.signOut({scope:'local'});if(error)throw new LibraryError('ออกจากระบบไม่สำเร็จ กรุณาลองอีกครั้ง');return {authenticated:false};}
  async function list(){
    const items:Media[]=[];
    for(let offset=0;;offset+=1000){
      const {data,error}=await client.from(config.table).select(columns).order('created_at',{ascending:false}).range(offset,offset+999);
      if(error)databaseError(error);items.push(...(data||[]).map(mapped));if((data?.length||0)<1000)return {items};
    }
  }
  function validCover(image:unknown){const prefix=config.url+'/storage/v1/object/public/'+config.bucket+'/';return typeof image==='string'&&image.startsWith(prefix)&&/^[a-f0-9-]+\/[a-f0-9-]+\.jpg$/.test(image.slice(prefix.length));}
  async function save(input:Record<string,unknown>,editing=false){
    const user=await requireAdmin();let old:Record<string,unknown>|null=null;
    if(editing){
      if(typeof input.id!=='string'||!uuid.test(input.id))throw new LibraryError('ไม่พบสื่อ');
      const {data,error}=await client.from(config.table).select(columns).eq('id',input.id).maybeSingle();if(error)databaseError(error);if(!data)throw new LibraryError('ไม่พบสื่อที่ต้องการแก้ไข');old=data;
    }
    if(typeof input.title!=='string'||!input.title.trim()||input.title.length>150||typeof input.description!=='string'||!input.description.trim()||input.description.length>2000||!subjects.includes(String(input.subject))||!grades.includes(String(input.grade))||!types.includes(String(input.type))||(!validCover(input.image)&&!(old&&input.image===old.image)))throw new LibraryError('กรุณากรอกข้อมูลให้ครบ และแนบภาพปก JPG');
    const url=normalizeResourceUrl(input.url);if(!url)throw new LibraryError('กรุณาแนบลิงก์ที่ขึ้นต้นด้วย https:// หรือ http://');
    const row={title:input.title.trim(),type:input.type,subject:input.subject,grade:input.grade,description:input.description.trim(),image:input.image,url,...(!editing?{created_by:user.id}:{})};
    const query=editing?client.from(config.table).update(row).eq('id',String(input.id)):client.from(config.table).insert(row);
    const {data,error}=await query.select(columns).single();if(error)databaseError(error);return {item:mapped(data)};
  }
  async function remove(id:string){
    await requireAdmin();if(!uuid.test(id))throw new LibraryError('รหัสสื่อไม่ถูกต้อง');
    const {data,error}=await client.from(config.table).delete().eq('id',id).select('id');if(error)databaseError(error);if(!data?.length)throw new LibraryError('ไม่พบสื่อ หรือบัญชีนี้ไม่มีสิทธิ์ลบ');return {ok:true};
  }
  async function upload(form:FormData){
    const user=await requireAdmin(),file=form.get('file');
    if(form.get('kind')!=='image'||!(file instanceof File)||file.type!=='image/jpeg'||!/\.jpe?g$/i.test(file.name))throw new LibraryError('กรุณาใช้ภาพ JPG (.jpg หรือ .jpeg) เท่านั้น');
    if(!file.size||file.size>20*1024*1024)throw new LibraryError('ภาพต้องมีขนาดไม่เกิน 20 MB');
    const bytes=new Uint8Array(await file.arrayBuffer());if(bytes[0]!==255||bytes[1]!==216||bytes[2]!==255)throw new LibraryError('ไฟล์นี้ไม่ใช่ภาพ JPG ที่ถูกต้อง');
    const path=user.id+'/'+crypto.randomUUID()+'.jpg';const bucket=client.storage.from(config.bucket);
    const {error}=await bucket.upload(path,file,{contentType:'image/jpeg',upsert:false,cacheControl:'3600'});if(error)databaseError(error,true);
    return {url:bucket.getPublicUrl(path).data.publicUrl};
  }
  // Keeps the React interface's operation names while calling Supabase directly.
  async function request(path:string,options:RequestInit={}):Promise<any>{
    const method=options.method||'GET';const route=path.split('?')[0];
    if(route==='/api/admin/session'&&method==='GET')return session();
    if(route==='/api/admin/logout'&&method==='POST')return logout();
    if(route==='/api/media'&&method==='GET')return list();
    if(route==='/api/media'&&(method==='POST'||method==='PUT'))return save(JSON.parse(String(options.body)),method==='PUT');
    if(route==='/api/media'&&method==='DELETE')return remove(new URL(path,'https://local.invalid').searchParams.get('id')||'');
    if(route==='/api/upload'&&method==='POST'&&options.body instanceof FormData)return upload(options.body);
    throw new LibraryError('ไม่พบคำขอ');
  }
  return {request,login,session,logout,list,save,remove,upload};
}
