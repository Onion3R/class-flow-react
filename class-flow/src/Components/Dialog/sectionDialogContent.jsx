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
import { AlertCircleIcon } from 'lucide-react'
import { Label } from '../ui/label'
import { Input } from "@/components/ui/input"
import SelectComponent from '../Select/selectComponent'
import { updateSection } from '@/services/apiService'
import useYearLevelsGetter from '@/lib/hooks/useYearLevels'
import useStrandGetter from '@/lib/hooks/useStrands'
import { Alert, AlertTitle } from "@/components/ui/alert"
import { Separator } from '../ui/separator'
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

  const [error, setError] = useState(null);
  
  useEffect(() => {
    if (selectedRow) {
      setName(selectedRow.name || "")
      setSelectedStrand(selectedRow.strand.code || "")
      setSelectedYearLevel(selectedRow.year_level.name || "")
    }
  }, [selectedRow])

 async function handleUpdate(e) {
  e.preventDefault();
  if (!name || !selectedStrand || !selectedYearLevel) {
    setError({ message: "All fields are required" });
    return;
  }
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
         {error && (
            <Alert variant="destructive" className="border-red-500 bg-red-100 dark:bg-red-900/30">
              <AlertCircleIcon className="h-4 w-4" />
              <AlertTitle className="!truncate-none !whitespace-normal !break-words ">
                Error:
                <span className="!text-sm font-normal ml-1">
                  {error.message}
                </span>
              </AlertTitle>
            </Alert>
          )}
        <Separator />
        <div className="space-y-4 px-2">
            <div>
              <Label
                htmlFor='name'
                className={`mb-2 text-xs text-foreground/80 ${!name && "text-red-600 font-semibold"}`}
              >
                Section Name *
              </Label>
            <Input
              name='name'
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter name"
              className={`!w-full !max-w-none ${!name && "border border-red-500 placeholder:text-red-400"}`}
              required
            />
          </div>

          {!isLoadingYearLevels && !isLoadingStrands && 
          (<div className="flex w-full gap-4">
            <div className='w-full lg:w-[50%]'> 
              <Label
                className={`mb-2 text-xs text-foreground/80 ${!selectedYearLevel && "text-red-600 font-semibold"}`}
              >
                Year Level *
              </Label>
              <SelectComponent
                id="yearLevel"
                items={allYearLevelData?.map((s) => s.name) || []}
                label="Year Level"
                value={selectedYearLevel}
                onChange={setSelectedYearLevel}
               className={`!w-full !max-w-none ${!selectedYearLevel && "text-red-600 data-[placeholder]:text-red-400 border-red-500"}`}
              />
            </div>
            <div className='w-full lg:w-[50%]'>
              <Label
                className={`mb-2 text-xs text-foreground/80 ${!selectedStrand && "text-red-600 font-semibold"}`}
              >
                Strand *
              </Label>
              <SelectComponent
                id="strand"
                items={allStrandData?.map((s) => s.code) || []} 
                label="Strand"
                value={selectedStrand}
                onChange={setSelectedStrand}
                className={`!w-full !max-w-none ${!selectedStrand && "text-red-600 data-[placeholder]:text-red-400 border-red-500"}`}
              />
            </div>
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