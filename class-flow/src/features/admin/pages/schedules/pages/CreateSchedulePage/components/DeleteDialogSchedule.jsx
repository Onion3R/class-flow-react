import React, {useState, useEffect} from 'react'
import {

  AlertDialogDescription,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction
} from "@/components/ui/alert-dialog"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { Label } from '@/components/ui/label'
import {  TriangleAlert } from "lucide-react"
import { Input } from '@/components/ui/input'
import useGeneratedScheduleGetter from '@/lib/hooks/useGeneratedSchedules'
let LOCAL_STORAGE_KEY = import.meta.env.VITE_SCHED_LOCAL_STORAGE_KEY
const DELETE_VALUE = 'DELETE'

function DeleteDialogSchedule({open, handleDelete, selectedRow}) {
  const {data, isLoading} =useGeneratedScheduleGetter()
  const [hasGeneratedSchedule, setHasGeneratedSchedule] = useState(false)
  const [disable, setDisable] = useState(false)

  const [confirmText, setConfirmText] = useState("");
  
  useEffect(() => {
    setDisable(true); 
    // console.log(selectedRow)
    // console.log(data)
    if(selectedRow  && !isLoading && data && data.length > 0) {
      const result =  data.some( (e) => e.schedule.id === selectedRow.id)
      setHasGeneratedSchedule(result)
      console.log(result)
    }
  }, [setDisable ,selectedRow, isLoading]);


  const handleInput = async (value) => {
    console.log(value)
    setConfirmText(value)
    if(value === DELETE_VALUE) {
      setDisable(false)
    } else {
      setDisable(true)
    }
    
  }

  useEffect(() => {
    if(!open) {
      setConfirmText('')
    }
  }, [open])
  



    return (
      <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
          
        { hasGeneratedSchedule&&  <Alert variant='destructive' className='bg-red-100 dark:bg-red-900/30 border-red-500'>
            <TriangleAlert />
            <AlertTitle>
                            This schedule is associated with a generated timetable.
            </AlertTitle>
          </Alert> }
         

       
        <div className="px-3">
          <AlertDialogDescription>
              Proceeding with this action will permanently delete the schedule and its associated data from the system. This operation is irreversible.
          </AlertDialogDescription>

          <div className="gap-2 flex flex-col mt-2">
            <Label >
              <span>
              To confirm, please type <span className="font-semibold">"DELETE"</span> below:
              </span>
            </Label>
            <Input 
              value={confirmText}
              onChange={(e) => handleInput(e.target.value)}
            />
          </div>
        </div>
      </AlertDialogHeader>
       <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => {
            handleDelete()
            localStorage.removeItem(LOCAL_STORAGE_KEY)
          }} disabled={disable}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>

  ) 

  

  
}

export default DeleteDialogSchedule