import React from 'react'
import { Button } from '@Components/ui/button'
import AvatarPopUpComponent from '@/components/AvatarPopUp/AvatarPopUpComponent'

import columns from "../config/column"

import {data} from "../config/class-data"
import { MessageSquare, Search, Trash, Printer} from 'lucide-react'
import { Separator } from '@Components/ui/separator'
import  PanelSwticherVreg from '@/Components/PanelSwitcher/PanelSwticherVreg'
import { SidebarTrigger,  useSidebar,} from "@/components/ui/sidebar";

function Header() {
  const { isMobile } = useSidebar()
  return (
    <div className='border-b h-[50px] flex items-center  justify-between px-5 dark:bg-accent bg-white'>
        <div className='h-[50px] flex items-center '>
          { isMobile ?  <SidebarTrigger/> : <h1>Header</h1>}
         
          <Separator orientation='vertical' className="mx-4 !h-[70%] "/>
          <PanelSwticherVreg panels={data.panels}/>
          </div>
          <div className=' sm:flex hidden items-center justify-between min-w-48'  >
            <Button variant='outline' size='sm'>
              <MessageSquare />
              Feedback
            </Button>
           <AvatarPopUpComponent />
          </div>
        </div>
  )
}

export default Header