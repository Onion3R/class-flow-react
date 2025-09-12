import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
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
import { Separator } from '../ui/separator'
import { AlertCircleIcon } from 'lucide-react'
import {Input} from "@/components/ui/input"
import { Label } from '../ui/label'
import { updateTrack } from '@/app/services/apiService'
const toastInfo = {
  success: false, 
  title: 'Update Track',
  desc: 'Sucessfully updated'
}
import { Alert, AlertTitle, AlertDescription} from "@/components/ui/alert"
import { trackSchema } from '@/app/schema/schema'

function TrackDialogContent({ selectedRow, onConfirm, onOpenChange, onRefresh}) {
 
 const [name, setName] = useState(selectedRow?.name || '');
 const [code, setCode] = useState(selectedRow?.code || '');
  const [error, setError] = useState(null);

  // useEffect(() => {
  //   if (selectedRow) {
  //     setName(selectedRow.name || '');
  //     setCode(selectedRow.code || '');
  //   }
  // }, [selectedRow])
  

  async function handleUpdate(e) {
    e.preventDefault();
    
    if (!name || !code) { 
      setError({message: 'All fields are required'});
      return;
    } else {
       const data = {
        name, 
        code,
      }
      try {
        await trackSchema.validate(data, {abortEarly: false})
      } catch (validationError) {
        setError({message: Array.isArray(validationError.errors) ? validationError.errors[0] : validationError.errors})
        return;
      }
    }


    try {
    
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
            {error && (
           <Alert variant="destructive" className="border-red-500  bg-red-100 dark:bg-red-900/30">
              <AlertCircleIcon className="h-4 w-4" />
              <AlertTitle className='className=" !break-words' >
                Error: Failed to update track
              </AlertTitle>
              <AlertDescription>
                {error.message}
              </AlertDescription>

            </Alert>
          )}
          <Separator/>
            <div className="space-y-4 px-2">  
              <div>
              <Label
                htmlFor='name'
                className={`mb-2 text-xs text-foreground/80 ${!name && "text-red-600 font-semibold"}`}
              >
                Track Name *
              </Label>
              <Input
              id='name'
              placeholder='Enter name'
              onChange={(e) => setName(e.target.value)}
              value={name}
              className={`!w-full !max-w-none ${!name && "border border-red-500 placeholder:text-red-400"}`}
              required
              />
              </div>
              <div>
              <Label
                htmlFor='code'
                className={`mb-2 text-xs text-foreground/80 ${!code && "text-red-600 font-semibold"}`}
              >
                Track Code *
              </Label>
              <Input 
              id='code' 
              placeholder='Enter code' 
              onChange={(e) => setCode(e.target.value)}
              value={code}
              className={`!w-full !max-w-none ${!code && "border border-red-500 placeholder:text-red-400"}`}
              required
              />
              </div>
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