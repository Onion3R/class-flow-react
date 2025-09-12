import { Button } from "@/components/ui/button"
import {  Clipboard, ClipboardCheck, ExternalLink } from "lucide-react"
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
import TeacherRolePopover from "./TeacherRolePopover"

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
          <TeacherRolePopover roles={roles} selectedRole={selectedRole} setSelectedRole={setSelectedRole}/>
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
