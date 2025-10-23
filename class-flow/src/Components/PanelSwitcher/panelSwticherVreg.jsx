import React, {useEffect} from 'react'
import { ChevronDown, UnlockKeyhole } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Lock } from 'lucide-react'
import { useAuth } from "@/app/context/authContext";
import { Link } from 'react-router-dom'
 function PanelSwticherVreg({panels}) {
   const [activePanels, setActivePanels] = React.useState([])
  const {isAdmin  } = useAuth();
   useEffect(() => {
     setActivePanels(panels)
   }, [panels])
   
  return (
  <DropdownMenu>
  <DropdownMenuTrigger className="text-sm border-dashed border px-3.5 py-1.5 flex items-center justify-between w-[160px] font-[500]">Teacher Panel <ChevronDown size={14}/></DropdownMenuTrigger>
  <DropdownMenuContent
             className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
             align="start"
            
           >
             <DropdownMenuLabel className="text-muted-foreground text-xs">
             </DropdownMenuLabel>
             {panels.map((panel, index) => (
               <DropdownMenuItem
                 key={panel.name}
                 onClick={() => setActivePanels(panel)}
                 className="gap-2 p-2  flex justify-between"
               >
                <Link
                   key={index}
                   to={isAdmin || panel.role !== "Admin" ? panel.url : "#"}
                   className={`flex items-center gap-2 ${
                     !isAdmin && panel.role === "Admin" ? "pointer-events-none text-muted-foreground" : ""
                   }`}
                 >
                 <div className='flex items-center justify-between'>
                 <div className="flex size-6 items-center justify-center mr-1.5 rounded-md border">
                   <panel.logo className="size-3.5 shrink-0 " />
                 </div>
                  
                   {panel.name}
                 
                 </div>
                 </Link>
                 {  !isAdmin && panel.role === "Admin"?
                  <Lock  className="size-3"/>  
                 :  <UnlockKeyhole  className="size-3"/>
                   }
                    
               </DropdownMenuItem>
             ))}
            
       </DropdownMenuContent>
</DropdownMenu>
  )
}

export default PanelSwticherVreg


