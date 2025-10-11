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
import { updateSubject } from '@/features/admin/pages/assignment/pages/services/subjectService'
import { PulseLoader } from 'react-spinners'
const toastInfo = {
  success: false, 
  title: 'Update Subject',
  desc: 'Sucessfully updated'
}
import { Alert, AlertTitle, AlertDescription} from "@/components/ui/alert"
import { subjectSchema } from '@/app/schema/schema'
function TestDialogContent({selectedRow , onConfirm, onOpenChange, onRefresh}) {
 
 const [title, setTItle] = useState();
 const [code, setCode] = useState();
 const [minutesPerWeek, setMinutesPerWeek] = useState();
  const [error, setError] = useState(null);

  const [isLoading, setIsLoading] = useState(false)
  
  useEffect(() => {
  if (selectedRow) {
    setTItle(selectedRow.title || '');
    setCode(selectedRow.code || '');
    setMinutesPerWeek(selectedRow.minutes_per_week || '');
  }
}, [selectedRow]);
  

  async function handleUpdate(e) {
    e.preventDefault();
    setIsLoading(true)
    
    if (!title || !code || !minutesPerWeek) { 
      setError({message: 'All fields are required'});
      return;
    } else {
       const data = {
        title, 
        code,
        minutes_per_week: minutesPerWeek
      }


    try {
           await subjectSchema.validate(data, {abortEarly: false})
          } catch (validationError) {
            setError({ message: Array.isArray(validationError.errors) ? validationError.errors[0] : validationError.errors })
            return
          }
    try {
      console.log("Updating subject with data:", data)
        await updateSubject(selectedRow.id, data);
      onRefresh()
      triggerToast({ ...toastInfo, success: true })
      onConfirm()
    } catch (error) {
      console.log("Error updating subject:", error)
    } 
        }


    // try {
    // const data = {
    //     name, 
    //     code,
    //   }
    //  await updateTrack(selectedRow.id, data);
    //  onRefresh();
    //  triggerToast({ ...toastInfo, success: true });
    //   onConfirm();
    // } catch (error) {
    //   console.error("Error updating track:", error);
    // }
    setIsLoading(false)
  }
  return (
    <form>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Subject</DialogTitle>
            <DialogDescription>
              Make changes to your subject here. Click update when you&apos;re
              done.
            </DialogDescription>
            
          </DialogHeader>
            {error && (
           <Alert variant="destructive" className="border-red-500  bg-red-100 dark:bg-red-900/30">
              <AlertCircleIcon className="h-4 w-4" />
              <AlertTitle className='className=" !break-words' >
                Error: Failed to update subject
              </AlertTitle>
              <AlertDescription>
                {error.message}
              </AlertDescription>

            </Alert>
          )}
          <Separator/>
            <div className="space-y-4 px-2  gap-4">  
             
              <div className='flex gap-4'>
                <div>
              <Label
                htmlFor='code'
                className={`mb-2 text-xs text-foreground/80 ${!code && "text-red-600 font-semibold"}`}
              >
                Subject Code *
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
              <div>
                <Label
                htmlFor='minutesPerWeek'
                className={`mb-2 text-xs text-foreground/80 ${!minutesPerWeek && "text-red-600 font-semibold"}`}
              >
                Minutes Per Week *
              </Label>
              <Input 
              id='minutesPerWeek' 
              placeholder='Minutes per week' 
              onChange={(e) => setMinutesPerWeek(e.target.value)}
              value={minutesPerWeek}
              className={`!w-full !max-w-none ${!minutesPerWeek && "border border-red-500 placeholder:text-red-400"}`}
              required
              />
             </div>
              </div>
              
              
            <div>
               <Label
                htmlFor='title'
                className={`mb-2 text-xs text-foreground/80 ${!title && "text-red-600 font-semibold"}`}
              >
                Subject Title *
              </Label>
              <Input
              id='title'
              placeholder='Enter Title'
              onChange={(e) => setTItle(e.target.value)}
              value={title}
              className={`!w-full !max-w-none ${!title && "border border-red-500 placeholder:text-red-400"}`}
              required
              />
              </div>
              </div>
          <DialogFooter>
            <DialogClose asChild onClick={() => onOpenChange(false)}>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
             <Button variant="default" onClick={(e) => handleUpdate(e)} disabled={isLoading}>
              {isLoading ? <PulseLoader size={8} color="#ffffff" /> : 'Update'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
  )
}

export default TestDialogContent