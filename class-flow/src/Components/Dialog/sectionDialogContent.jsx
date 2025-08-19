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
import SelectComponent from '../Select/selectComponent'
import { updateSection } from '@/services/apiService'
import useYearLevelsGetter from '@/lib/hooks/useYearLevels'
import useStrandGetter from '@/lib/hooks/useStrands'

const toastInfo = {
  success: true,
  title: 'Update Section',
  desc: 'Successfully updated',
}

function SectionDialogContent({ selectedRow, onConfirm, onRefresh}) {
  const { data: allYearLevelData , isLoading: isLoadingYearLevels } = useYearLevelsGetter()
  const { data: allStrandData , isLoading: isLoadingStrands } = useStrandGetter()

  const [name, setName] = useState("")
  const [selectedStrand, setSelectedStrand] = useState("")
  const [selectedYearLevel, setSelectedYearLevel] = useState("")

  useEffect(() => {
    if (selectedRow) {
      setName(selectedRow.name || "")
      setSelectedStrand(selectedRow.strand.code || "")
      setSelectedYearLevel(selectedRow.year_level.name || "")
    }
  }, [selectedRow])

 async function handleUpdate(e) {
  e.preventDefault();
  try {
    if(allYearLevelData && allStrandData ) {
        const data ={
      name,
      year_level_id: allYearLevelData.find(y => y.name === selectedYearLevel)?.id || "",
      strand_id: allStrandData.find(s => s.code === selectedStrand)?.id || "",
      max_students: 40
    }
    console.log("Updating section with data:", data);
        await updateSection(selectedRow?.id, data)
    onRefresh();
        triggerToast({ ...toastInfo, success: true });
         onConfirm();
    }

  } catch (error) {
    console.log("Error updating section:", error);
  }
 }

  return (
    <form>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Section</DialogTitle>
          <DialogDescription>
            Make changes to your section here. Click update when you&apos;re done.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 px-2">
          
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Section name"
            />
          
          {!isLoadingYearLevels && !isLoadingStrands && 
          (<div className="flex w-full gap-4">
              <SelectComponent
                id="yearLevel"
                items={allYearLevelData?.map((s) => s.name) || []}
                label="Year Level"
                value={selectedYearLevel}
                onChange={setSelectedYearLevel}
                className="!max-w-none !w-full !min-w-none"
              />

           
              <SelectComponent
                id="strand"
                items={allStrandData?.map((s) => s.code) || []} 
                label="Strand"
                value={selectedStrand}
                onChange={setSelectedStrand}
                className="!max-w-none !w-full !min-w-none"
              />
          </div>)
          }
        
        </div>

        <DialogFooter className="mt-6">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button variant="default" onClick={(e) => handleUpdate(e)}>Update</Button>
        </DialogFooter>
      </DialogContent>
    </form>
  )
}

export default SectionDialogContent

// make changes on the form