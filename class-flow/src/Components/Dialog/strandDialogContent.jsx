import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { triggerToast } from "@/lib/utils/toast"
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import useTrackGetter from '@/lib/hooks/useTracks'
import SelectComponent from '../Select/selectComponent'
import { updateStrand } from '@/services/apiService'
const toastInfo = {
  success: true,
  title: 'Update Strand',
  desc: 'Successfully updated',
}

function StrandDialogContent({ selectedRow, onConfirm, onOpenChange, onRefresh }) {
  const [name, setName] = useState("")
  const [code, setCode] = useState("")
  const [selectedTrack, setSelectedTrack] = useState("")
  const { data: allTrackData, isLoading, error } = useTrackGetter()

  // Initialize form fields when selectedRow changes
  useEffect(() => {
    if (selectedRow) {
      setName(selectedRow.name || "")
      setCode(selectedRow.code || "")
      setSelectedTrack(selectedRow.track.name|| "")
    }
    console.log("Selected Row:", selectedRow);
  }, [selectedRow])

 async function handleUpdate(e) { 
  e.preventDefault();
  if(allTrackData) {
    try {
    const data ={
      name,
      code,
      track_id: allTrackData.find(t => t.name === selectedTrack)?.id || "",
      description: ''
    }
    await updateStrand(selectedRow?.id, data)
     triggerToast({ ...toastInfo, success: true });
        onConfirm();
        onRefresh()
  } catch (error) {
      console.error("Error updating strand:", error);
  }
  }
  
 }

  return (
    <form>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Strand</DialogTitle>
          <DialogDescription>
            Make changes to your strand here. Click update when you&apos;re done.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4  px-2">
         
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Strand name"
            />

            <Input
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Strand code"
            />


          {isLoading && <p className="text-sm text-muted">Loading tracks...</p>}
          {error && <p className="text-sm text-red-500">Error loading tracks</p>}
          
          {!isLoading && !error && (
            <SelectComponent
              id="track"
              items={allTrackData?.map((s) => s.name)}
              label="Choose track"
              value={selectedTrack}
              onChange={setSelectedTrack}
              className="!max-w-none !w-full !min-w-none mt-4"
            />
    
          )}
        </div>

        <DialogFooter className="mt-6">
          <DialogClose asChild onClick={() => onOpenChange(false)}> 
            <Button variant="outline" >Cancel</Button>
          </DialogClose>
            <Button variant="default" onClick={(e) => handleUpdate(e)}>Update</Button>
        </DialogFooter>
      </DialogContent>
    </form>
  )
}

export default StrandDialogContent
