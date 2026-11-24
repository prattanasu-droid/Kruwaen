import {createClient,type SupabaseClient} from '@supabase/supabase-js';

export const config={
  url:(import.meta.env.VITE_SUPABASE_URL||'').replace(/\/+$/,''),
  key:import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY||'',
  table:import.meta.env.VITE_SUPABASE_MEDIA_TABLE||'media',
  bucket:'media-covers'
};
let client:SupabaseClient|undefined;
export function getSupabase(){
  if(!/^https:\/\/[a-z0-9-]+\.supabase\.co$/.test(config.url)||!config.key||config.key.includes('replace-with')){
    throw Error('กรุณาตั้งค่า VITE_SUPABASE_URL และ VITE_SUPABASE_PUBLISHABLE_KEY แล้ว build เว็บไซต์ใหม่');
  }
  client??=createClient(config.url,config.key,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
  return client;
}
