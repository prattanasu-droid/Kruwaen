import {Download,Gamepad2,Play,Eye} from 'lucide-react';
import {mediaHref,resourceAction} from '@/lib/media-links';
import type {Media} from '@/lib/data';
export function MediaLink({media}:{media:Media}){
 const href=mediaHref(media),action=resourceAction(media.type);
 const Icon=action.kind==='game'?Gamepad2:action.kind==='video'?Play:action.kind==='view'?Eye:Download;
 if(!href)return <p className="resource-unavailable">ยังไม่ได้แนบลิงก์สื่อ กรุณาติดต่อผู้ดูแล</p>;
 return <a className="primary" href={href} target="_blank" rel="noopener noreferrer"><Icon size={18}/>{action.label}</a>;
}
