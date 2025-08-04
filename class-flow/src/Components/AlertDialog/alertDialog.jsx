import React, {useEffect} from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/Components/ui/alert-dialog"

import  { triggerToast } from "@lib/utils/toast"
import { deleteStrand } from "@/services/apiService"
import { deleteSection } from "@/services/apiService"
import { deleteTrack } from "@/services/apiService"
import { deleteSubject } from "@/services/apiService"

import { triggerRefresh } from "@/lib/hooks/useStrands"
import { triggerTrackRefresh } from "@/lib/hooks/useTracks"
import { triggerSectionRefresh } from "@/lib/hooks/useSections"
import { triggerSubjectStrandRefresh } from "@/lib/hooks/useSubjectStrand"
const toastInfo = {
  success: true,
  title: 'Delete',
  desc: 'Sucessfully deleted'
}

export default function AlertDialogComponent({open,selectedRow, onOpenChange, data}) {
 useEffect(() => {
    console.log('tis',selectedRow)
   
 }, [data, selectedRow])
  

async function handleDelete() {
  switch (data.id) {
    case 'track' :
      try {
        await deleteTrack(selectedRow.id);  // <- add await here
        triggerTrackRefresh()
        triggerToast(toastInfo);
        
      } catch (error) {
      console.error("Error deleting strand:", error.response?.data || error.message);
        triggerToast({
          success: false,
          title: "Delete Failed",
          desc: "An error occurred while deleting the strand.",
        });
      }
      break;
    case 'strand':
      try {
        await deleteStrand(selectedRow.id);  // <- add await here
        triggerRefresh()
        triggerToast(toastInfo);
        
      } catch (error) {
      console.error("Error deleting strand:", error.response?.data || error.message);
        triggerToast({
          success: false,
          title: "Delete Failed",
          desc: "An error occurred while deleting the strand.",
        });
      }
      break;
    case 'section':
      try {
        await deleteSection(selectedRow.id);  // <- add await here
        triggerSectionRefresh()
        triggerToast(toastInfo);
        
      } catch (error) {
      console.error("Error deleting strand:", error.response?.data || error.message);
        triggerToast({
          success: false,
          title: "Delete Failed",
          desc: "An error occurred while deleting the strand.",
        });
      }
    case 'subject':
      
      try {
        // console.log('this',selectedRow.subject.id)
        await deleteSubject(selectedRow.subject.id);  // <- add await here
        triggerSubjectStrandRefresh()
        triggerToast(toastInfo);
        
      } catch (error) {
      console.error("Error deleting strand:", error.response?.data || error.message);
        triggerToast({
          success: false,
          title: "Delete Failed",
          desc: "An error occurred while deleting the strand.",
        });
      }
    default:
      break;
  }
}

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange} >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={async () => {
  await handleDelete();  // <- now safely handles async
}}>
  Continue
</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
