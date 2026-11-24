import * as D from '@radix-ui/react-dialog';
import {X} from 'lucide-react';
export function Modal({open,onClose,title,children,wide=false}:{open:boolean;onClose:()=>void;title:string;children:React.ReactNode;wide?:boolean}){return <D.Root open={open} onOpenChange={v=>!v&&onClose()}><D.Portal><D.Overlay className="modal-overlay"/><D.Content className={'modal '+(wide?'wide':'')} aria-describedby={undefined}><div className="modal-head"><D.Title>{title}</D.Title><D.Close className="icon-button" aria-label="ปิดหน้าต่าง"><X size={21}/></D.Close></div>{children}</D.Content></D.Portal></D.Root>}
