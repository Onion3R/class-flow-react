import React,{useState, useEffect} from 'react'
import {
AlertDialog,
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
import { TriangleAlert } from 'lucide-react'
import { Input } from '@/components/ui/input'

const DELETE_VALUE = 'OVERRIDE'

export default function OverrideDialogGenerateSchedule({ dialogOpen, setDialogOpen, handleDialogContinue }) {
  const [confirmText, setConfirmText] = useState("");
  const [disable, setDisable] = useState(true);

  const handleInput = (value) => {
    setConfirmText(value);
    setDisable(value !== DELETE_VALUE);
  };


  useEffect(() => {
    if (dialogOpen) {
      setConfirmText("");
      setDisable(true)
    }
  }, [dialogOpen]);

  return (
    <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Action</AlertDialogTitle>
          <Alert variant='destructive' className='bg-red-100 dark:bg-red-900/30 border-red-500'>
            <TriangleAlert />
            <AlertTitle>This schedule already has a timetable</AlertTitle>
          </Alert>
          <div className="px-3">
            <AlertDialogDescription>
              Generating a new timetable will overwrite the existing one for this schedule. This action is irreversible. Do you wish to proceed?
            </AlertDialogDescription>
            <div className="gap-2 flex flex-col mt-3">
              <Label >
                <span>
                To continue, please type <span className="font-semibold">"OVERRIDE"</span> below:
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
          <AlertDialogCancel onClick={() => setDialogOpen(false)}>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleDialogContinue}
            disabled={disable}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
