import React, { useState, useEffect } from "react"
import { Dialog } from "@/components/ui/dialog"

import SubjectDialogContent from "./subjectDialogContent"
import TrackDialogContent from "./trackDialogContent"
import StrandDialogContent from "./strandDialogContent"
import SectionDialogContent from "./sectionDialogContent"
export default function DialogComponent({ label, open, onOpenChange, selectedRow, onConfirm, onRefresh}) {
  const [dialogContent, setDialogContent] = useState(null)

  useEffect(() => {
    switch (label) {
      case 'subjects':
        setDialogContent(<SubjectDialogContent selectedRow={selectedRow} onConfirm={onConfirm} onOpenChange={onOpenChange} onRefresh={onRefresh} />)
        break
      case 'strands':
        setDialogContent(<StrandDialogContent selectedRow={selectedRow} onConfirm={onConfirm} onOpenChange={onOpenChange} onRefresh={onRefresh} />)
        break
      case 'sections':
        setDialogContent(<SectionDialogContent selectedRow={selectedRow} onConfirm={onConfirm} onOpenChange={onOpenChange} onRefresh={onRefresh} />)
        break
      case 'tracks':
        setDialogContent(<TrackDialogContent selectedRow={selectedRow} onConfirm={onConfirm} onOpenChange={onOpenChange} onRefresh={onRefresh} />)
        break
      default:
        setDialogContent(null)
    }
  }, [label, selectedRow, onConfirm])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {open && dialogContent}
    </Dialog>
  )
}
