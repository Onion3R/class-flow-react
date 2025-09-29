import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Copy, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Link } from "react-router-dom"
import { EllipsisVertical } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuShortcut
} from "@/components/ui/dropdown-menu"
import { triggerToast } from "@/lib/utils/toast"

const links = [
  { label: 'Manage Roles', link: 'http://localhost:5173/admin/teachers' },
  { label: 'Edit Sections & Programs', link: 'http://localhost:5173/admin/programs' },
  { label: 'Add New Subject', link: 'http://localhost:5173/admin/subjects' }
];

import { Label } from "@/components/ui/label"
export function LinksDialog() {
  
  const copyClipboard = (link) => {
  navigator.clipboard.
  writeText(link).
  then(() => {
    const toastInfo = {
      success: true, 
      title: 'Copy link',
      desc: 'Copied the link to your clipboard'
    }
  triggerToast(toastInfo)
  }).catch((err) => {
  console.log(err)
  })
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
         <Button variant="outline" size="sm" className="w-full text-xs">Update</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Admin Navigation Links</DialogTitle>
          <DialogDescription>
            Use the links below to access and manage different sections of the admin dashboard.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          {links.map(e => (
              <div>
            <Label  className='mb-3'>{e.label}</Label>
          <div className="flex relative">
          <Input 
          className='text-muted-foreground'
          value={e.link}
          readOnly
          />
         
          <div className="absolute right-0 flex  h-full border  bg-accent rounded-tr-sm rounded-br-sm">
             {/* <Tooltip>
      <TooltipTrigger asChild >

        <Button variant='ghost' className='text-muted-foreground'>
             <Copy/>
          </Button>
      </TooltipTrigger>
      <TooltipContent className='bg-secondary text-accent-foreground'>
        <p>Copy to clipboard.</p>
      </TooltipContent>
    </Tooltip>
          
          <Separator orientation="vertical"/>
           <Tooltip>
      <TooltipTrigger asChild>
         <Button variant='ghost' className='text-muted-foreground' asChild>
            <Link to={e.link}>
            <ExternalLink/>
            </Link>
          </Button>
          
      </TooltipTrigger>
      <TooltipContent className='bg-secondary text-accent-foreground'>
        <p>Go to link.</p>
      </TooltipContent>
    </Tooltip> */}
<DropdownMenu>
  <DropdownMenuTrigger>
    <Button variant="ghost">
      <EllipsisVertical />
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuLabel>Quick Actions</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuItem className='cursor-pointer' onClick={() => copyClipboard(e.link)}>
      Copy Link
      <DropdownMenuShortcut><Copy /></DropdownMenuShortcut>
    </DropdownMenuItem>
    <DropdownMenuItem className='cursor-pointer' asChild>
      <Link to={e.link}>
            Open Link
              <DropdownMenuShortcut><ExternalLink  /></DropdownMenuShortcut>
            </Link>
      
    
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>

          </div>
           </div>
          </div>
          ))}
          
         
        </div>
      </DialogContent>
    </Dialog>
  )
}
