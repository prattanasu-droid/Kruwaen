import {getSupabase,config} from './supabase';
import {createLibraryApi,LibraryError} from './api-core';
let library:ReturnType<typeof createLibraryApi>|undefined;
function getLibrary(){return library??=createLibraryApi(getSupabase(),config);}
export async function api(path:string,options?:RequestInit):Promise<any>{
  try{return await getLibrary().request(path,options);}catch(error){
    if(error instanceof LibraryError&&error.code==='ADMIN_AUTH_REQUIRED')window.dispatchEvent(new Event('admin-session-expired'));
    throw error;
  }
}
export async function signInAdmin(email:string,password:string){return getLibrary().login(email,password);}
