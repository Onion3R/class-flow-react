import { Button } from "@/components/ui/button"
import { ChevronDown, Clipboard, ClipboardCheck, ExternalLink } from "lucide-react"
import { useState, useEffect } from "react"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Checkbox } from "@/Components/ui/checkbox"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"

export default function ShareDialog() {
  const roles = [
    { value: 'admin', label: 'Admin', desc: 'Has full access to all features and settings.' },
    { value: 'instrutor', label: 'Instructor', desc: 'Can edit content but not manage settings.' }
    ]
  const [selectedRole, setSelectedRole] = useState(roles[0].label)
  const [copyLink, setCopyLink] = useState(false)

  const handleCopyLink = () => {
    setCopyLink(true)
    navigator.clipboard.writeText("https://ui.shadcn.com/docs/installation")
      .then(() => {
        alert("Link copied to clipboard!")
       
      })
      .catch(err => {
        console.error("Failed to copy link: ", err)
      })
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default" className="ml-2"> <ExternalLink/> Share</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share link</DialogTitle>
          <DialogDescription>
            Anyone who has this link will be able to view this.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-2">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="link" className="sr-only">
              Link
            </Label>
            <div className="relative">
            <Input
              id="link"
              defaultValue="https://ui.shadcn.com/docs/installation"
              readOnly/>
              <Button
                variant="ghost"
                className="absolute right-0 top-0  rounded-l-none"
                onClick={handleCopyLink}
              >
                {copyLink ? <ClipboardCheck className="h-4 w-4" /> : <Clipboard className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between  ">
          <div>
          <h3 className="text-sm font-medium">General access</h3>
          <DialogDescription className="text-[12px]">Copy the link above and share it with others.</DialogDescription>
          </div>
          <Popover >
            <PopoverTrigger asChild>
              <Button variant="outline" className="ml-2" >
                { selectedRole ? selectedRole : 'Select Role' } <ChevronDown/>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-1">
             <Command>
            <CommandInput placeholder={`Search ...`} />
            <CommandList>
              <CommandEmpty>No subjects found.</CommandEmpty>
              <CommandGroup>
                {roles.map((role) => (
                  <CommandItem
                    key={role.value}
                    value={role.value}
                    onSelect={() => setSelectedRole(role.label)}
                    className={`cursor-pointer rounded px-2 py-1 mb-1.5 ${
                      selectedRole === role.label
                        ? 'bg-destructive  dark:bg-secondary '
                        : ''
                    }`}
                  >
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{role.label}</span>
                      <span className="text-muted-foreground text-xs">{role.desc}</span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
            </PopoverContent>
          </Popover>
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
