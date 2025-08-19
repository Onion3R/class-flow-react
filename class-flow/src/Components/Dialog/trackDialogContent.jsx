import React, { useState, useEffect } from 'react'
import { Button } from "@/Components/ui/button"
import { triggerToast } from "@/lib/utils/toast"
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {Input} from "@/Components/ui/input"
import { updateTrack } from '@/services/apiService'
const toastInfo = {
  success: false, 
  title: 'Update Track',
  desc: 'Sucessfully updated'
}

function TrackDialogContent({ selectedRow, onConfirm, onOpenChange, onRefresh}) {
 
 const [name, setName] = useState(selectedRow?.name || '');
 const [code, setCode] = useState(selectedRow?.code || '');


  useEffect(() => {
    if (selectedRow) {
      setName(selectedRow.name || '');
      setCode(selectedRow.code || '');
    }
  }, [selectedRow])
  

  async function handleUpdate(e) {
    e.preventDefault();
    try {
      const data = {
        name, 
        code,
      }
     await updateTrack(selectedRow.id, data);
     onRefresh();
     triggerToast({ ...toastInfo, success: true });
      onConfirm();
    } catch (error) {
      console.error("Error updating track:", error);
    }
  }
  return (
    <form>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Track</DialogTitle>
            <DialogDescription>
              Make changes to your track here. Click update when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>
            <div className="space-y-4 px-2">  
            
              <Input 
              id='name' 
              placeholder='Track name' 
              onChange={(e) => setName(e.target.value)}
              value={name}/>
              <Input 
              id='code' 
              placeholder='Track code' 
              onChange={(e) => setCode(e.target.value)}
              value={code}/>
            </div>
          <DialogFooter>
            <DialogClose asChild onClick={() => onOpenChange(false)}>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
           <Button variant="default" onClick={(e) => handleUpdate(e)}>Update</Button>
          </DialogFooter>
        </DialogContent>
      </form>
  )
}

export default TrackDialogContent