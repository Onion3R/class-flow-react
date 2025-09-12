import React, {useState} from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

import { triggerToast } from "@lib/utils/toast"

import { deleteStrand, deleteSection, deleteTrack, deleteSchedule, deleteSubject, deleteSubjectStrand } from "@/app/services/apiService"
import useSubjectStrandGetter from "@/lib/hooks/useSubjectStrand"
import { deleteTeacher } from "@/app/services/teacherService"
const toastInfo = {
  success: true,
  title: 'Delete',
  desc: 'Sucessfully deleted'
}


export default function AlertDialogComponent({ open, selectedRow, onOpenChange, data, onRefresh, content = null}) {

  
  const {data: allSubjectStrandData } = useSubjectStrandGetter()
  async function handleDelete() {
    const rows = Array.isArray(selectedRow) ? selectedRow : [selectedRow];
    switch (data.id) {
      case 'track':
        try {
          for (const row of rows) {
          await deleteTrack(row.id);

          }
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
         for (const row of rows) {
            await deleteStrand(row.id);
          }
          triggerToast(toastInfo);
        } catch (error) {
          console.error("Error deleting strand:", error.response?.data || error.message);
          triggerToast({
            success: false,
            title: "Delete Failed",
            desc: "An error occurred while deleting one or more strands.",
          });
        }
        onRefresh('strand');
        break;
      case 'section':
        try {
          for (const row of rows) {
            await deleteSection(row.id);
          }
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
          onRefresh()
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
       
      for (const row of rows) {
          const count = allSubjectStrandData.filter(e => e.subject.id === row.subject.id);
            if (count.length === 1) {
        await deleteSubject(row.subject.id);  // <- add await here
        
       } else {
        const result = allSubjectStrandData.find(
          a => a.subject.id === row.subject.id &&
          a.strand.id === row.strand.id && 
          a.year_level.id  === row.year_level.id
        )
        console.log('hello',result)
        await deleteSubjectStrand(result.id)
        
      }
      console.log(row)
          }
        
        //  console.log('this',count.length)
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
      case 'teacher':
        try {
          console.log(selectedRow.id)
        await deleteTeacher(selectedRow.id)
      triggerToast(toastInfo);
      onRefresh()
      } catch (error) {
      console.error("Error deleting teacher:", error.response?.data || error.message);
        triggerToast({
          success: false,
          title: "Delete Failed",
          desc: "An error occurred while deleting the teacher.",
        });
      }
      break;
      default:
        break;
        
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange} >
      {content ? React.cloneElement(content, { open ,handleDelete, selectedRow }) : 
      <AlertDialogContent>
         
       <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          {data.desc && <AlertDialogDescription>{data.desc}</AlertDialogDescription>}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
      }
      
    </AlertDialog>
  )
}
