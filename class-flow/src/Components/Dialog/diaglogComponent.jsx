import { Button } from "@/Components/ui/button"
import { triggerToast } from "@/lib/utils/toast"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/Components/ui/input"
import { fields } from "./fields"
import { Label } from "@/Components/ui/label"

const toastInfo = {
  success: false, 
  title: 'Update profile',
  desc: 'Sucessfully updated'
}

export default function DialogComponent ({ open, onOpenChange, onConfirm }) {
  
  return (
    <Dialog  open={open} onOpenChange={onOpenChange}>
      <form>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            {
              fields.map(({ label, id, name, defaultValue }, index) => (
              <div id={id} className="grid gap-3">
                <Label htmlFor={id}>{label}</Label>
                <Input id={id} name={name} defaultValue={defaultValue} />
              </div>
              ))
            }
          </div>
          <DialogFooter>
            <DialogClose asChild onClick={() => onOpenChange(false)}>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
           <Button variant="default" onClick={() => {triggerToast(toastInfo); onConfirm();}}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}
