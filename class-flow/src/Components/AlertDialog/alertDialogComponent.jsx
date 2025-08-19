import React from "react"
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

import { triggerToast } from "@lib/utils/toast"

import { deleteStrand, deleteSection, deleteTrack, deleteSchedule, deleteSubject, deleteSubjectStrand } from "@/services/apiService"
import useSubjectStrandGetter from "@/lib/hooks/useSubjectStrand"

const toastInfo = {
  success: true,
  title: 'Delete',
  desc: 'Sucessfully deleted'
}


export default function AlertDialogComponent({ open, selectedRow, onOpenChange, data, onRefresh}) {
  const {data: allSubjectStrandData } = useSubjectStrandGetter()
  async function handleDelete() {
    switch (data.id) {
      case 'track':
        try {
          await deleteTrack(selectedRow.id);
          triggerToast(toastInfo);
          // triggerTrackRefresh();
        } catch (error) {
          console.error("Error deleting track:", error.response?.data || error.message);
          triggerToast({
            success: false,
            title: "Delete Failed",
            desc: "An error occurred while deleting the track.",
          });
        }
        onRefresh('track')
        break;
      case 'strand':
        try {
          await deleteStrand(selectedRow.id);
          triggerToast(toastInfo);
          // triggerStrandRefresh();
        } catch (error) {
          console.error("Error deleting strand:", error.response?.data || error.message);
          triggerToast({
            success: false,
            title: "Delete Failed",
            desc: "An error occurred while deleting the strand.",
          });
        }
        onRefresh('strand')
        break;
      case 'section':
        try {
          await deleteSection(selectedRow.id);
          triggerToast(toastInfo);
          onRefresh()
          
        } catch (error) {
          console.error("Error deleting section:", error.response?.data || error.message);
          triggerToast({
            success: false,
            title: "Delete Failed",
            desc: "An error occurred while deleting the section.",
          });
        }
        break;
      case 'schedule':
        try {
          await deleteSchedule(selectedRow.id);
          triggerToast(toastInfo);
          // triggerScheduleRefresh();
        } catch (error) {
          console.error("Error deleting schedule:", error.response?.data || error.message);
          triggerToast({
            success: false,
            title: "Delete Failed",
            desc: "An error occurred while deleting the schedule.",
          });
        }
        break;
      case 'subject':
        
      try {
      
         const count = allSubjectStrandData.filter(e => e.subject.id === selectedRow.subject.id);

        
         console.log('this',count.length)

       if (count.length === 1) {
        await deleteSubject(selectedRow.subject.id);  // <- add await here
        
       } else {
        const result = allSubjectStrandData.find(
          a => a.subject.id === selectedRow.subject.id &&
          a.strand.id === selectedRow.strand.id && 
          a.year_level.id  === selectedRow.year_level.id
        )
        console.log('hello',result)
        await deleteSubjectStrand(result.id)
        
      }
      triggerToast(toastInfo);
      onRefresh()
      } catch (error) {
      console.error("Error deleting subject:", error.response?.data || error.message);
        triggerToast({
          success: false,
          title: "Delete Failed",
          desc: "An error occurred while deleting the subject.",
        });
      }
      break;
      default:
        break;
        
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          {data.desc && <AlertDialogDescription>{data.desc}</AlertDialogDescription>}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
