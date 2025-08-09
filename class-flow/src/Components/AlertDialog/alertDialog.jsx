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
import { deleteSchedule } from "@/services/apiService"
import { deleteSubjectStrand } from "@/services/apiService"

import {  triggerStrandRefresh } from "@/lib/hooks/useStrands"
import { triggerTrackRefresh } from "@/lib/hooks/useTracks"
import { triggerSectionRefresh } from "@/lib/hooks/useSections"
import { triggerSubjectStrandRefresh } from "@/lib/hooks/useSubjectStrand"
import { triggerScheduleRefresh } from "@/lib/hooks/useSchedules"

import useCheckSubject from "@/lib/hooks/useCheckSubject"

const toastInfo = {
  success: true,
  title: 'Delete',
  desc: 'Sucessfully deleted'
}

export default function AlertDialogComponent({open,selectedRow, onOpenChange, data}) {
  // const {data: allSubjectStrandData, isLoading: allSubjectStrandDataIsLoading} = subjectStrandGetter()
// const { checkSubject } = useCheckSubject();
// hook handles null internally

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
        triggerStrandRefresh()
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
      break;
    case 'subject':
      
      try {
      
      //    const count = allSubjectStrandData.filter(e => e.subject.id === selectedRow.subject.id);

        
      //  console.log('this',count.length)

      //  if (count.length === 1) {
      //   await deleteSubject(selectedRow.subject.id);  // <- add await here
      //  } else {
      //   const result = allSubjectStrandData.find(a => a.subject.id === selectedRow.subject.id && a.strand.id === selectedRow.strand.id && a.year_level.id  === selectedRow.year_level.id)

      //   console.log('hello',result)
      //   // await deleteSubjectStrand(result.id)

// }
      await checkSubject(selectedRow);
    triggerSubjectStrandRefresh();
    triggerToast(toastInfo);
      } catch (error) {
      console.error("Error deleting subject:", error.response?.data || error.message);
        triggerToast({
          success: false,
          title: "Delete Failed",
          desc: "An error occurred while deleting the subject.",
        });
      }
      break;

    case 'schedule':
      
      
      try {
        await deleteSchedule(selectedRow.id);  // <- add await here
        triggerScheduleRefresh()
        triggerToast(toastInfo);
        
      } catch (error) {
      console.error("Error deleting strand:", error.response?.data || error.message);
        triggerToast({
          success: false,
          title: "Delete Failed",
          desc: "An error occurred while deleting the schedule.",
        });
      }
      break;
      
    default:
      break;
  }
}

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange} >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
      { data.desc &&  <AlertDialogDescription>
          This action cannot be undone. This will permanently delete your
          account and remove your data from our servers.
        </AlertDialogDescription>}
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
