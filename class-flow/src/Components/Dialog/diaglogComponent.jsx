import React, { useState, useEffect } from "react"
import { Dialog } from "@/components/ui/dialog"

import SubjectDialogContent from "./SubjectDialogContent"
import TrackDialogContent from "./TrackDialogContent"
import StrandDialogContent from "./StrandDialogContent"
import SectionDialogContent from "./SectionDialogContent"
import TestDialogContent from "./testDialogContent"
export default function DialogComponent({ label, open, onOpenChange, selectedRow, onConfirm, onRefresh}) {
  const [dialogContent, setDialogContent] = useState(null)

  useEffect(() => {
    switch (label) {
      case 'assign':
        setDialogContent(<SubjectDialogContent selectedRow={selectedRow} onConfirm={onConfirm} onOpenChange={onOpenChange} onRefresh={onRefresh} />)
        break
      case 'subject':
        setDialogContent(<TestDialogContent selectedRow={selectedRow} onConfirm={onConfirm} onOpenChange={onOpenChange} onRefresh={onRefresh} />)
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
