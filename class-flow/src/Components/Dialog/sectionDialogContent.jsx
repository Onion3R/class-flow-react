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
import { Card } from '../ui/card'
import { Switch } from '../ui/switch'
import { Label } from '../ui/label'
import { AlertCircleIcon } from 'lucide-react'
import { Input } from "@/components/ui/input"
import SelectComponent from '../Select/selectComponent'
import { updateSection } from '@/app/services/apiService'
import useYearLevelsGetter from '@/lib/hooks/useYearLevels'
import useStrandGetter from '@/lib/hooks/useStrands'
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Separator } from '../ui/separator'
import { sectionSchema } from '@/app/schema/schema'

const toastInfo = {
  success: true,
  title: 'Update Section',
  desc: 'Successfully updated',
}

function SectionDialogContent({ selectedRow, onConfirm, onRefresh }) {
  const { data: allYearLevelData, isLoading: isLoadingYearLevels } = useYearLevelsGetter()
  const { data: allStrandData, isLoading: isLoadingStrands } = useStrandGetter()

  const [name, setName] = useState("")
  const [selectedStrand, setSelectedStrand] = useState("")
  const [selectedYearLevel, setSelectedYearLevel] = useState("")
  const [isActive, setIsActive] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (selectedRow) {
      setName(selectedRow.name || "")
      setSelectedStrand(selectedRow.strand.code || "")
      setSelectedYearLevel(selectedRow.year_level.name || "")
      setIsActive(selectedRow.is_active || false)
    }
  }, [selectedRow])

  async function handleUpdate(e) {
    e.preventDefault()
    if (!name || !selectedStrand || !selectedYearLevel) {
      setError({ message: "All fields are required" })
      return
    }
    if (allYearLevelData && allStrandData) {
      const data = {
        name,
        year_level_id: allYearLevelData.find(y => y.name === selectedYearLevel)?.id || "",
        strand_id: allStrandData.find(s => s.code === selectedStrand)?.id || "",
        max_students: 40,
        is_active: isActive
      }
      try {
        await sectionSchema.validate(data, { abortEarly: false })
      } catch (validationError) {
        setError({ message: Array.isArray(validationError.errors) ? validationError.errors[0] : validationError.errors })
        return
      }
      try {
        console.log("Updating section with data:", data)
        await updateSection(selectedRow?.id, data)
        onRefresh()
        triggerToast({ ...toastInfo, success: true })
        onConfirm()
      } catch (error) {
        console.log("Error updating section:", error)
      }
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
            <AlertTitle className='className=" !break-words'>
              Error: Failed to update section
            </AlertTitle>
            <AlertDescription>
              {error.message}
            </AlertDescription>
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

          {!isLoadingYearLevels && !isLoadingStrands && (
            <div className="flex w-full gap-4">
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
            </div>
          )}

          <Card className='w-full p-0 mt-2  shadow-xs'>
            <div className='flex p-4 items-center'>
              <Label className="flex-col items-start gap-1">
                <span className="text-sm p-0">Set Section Active?</span>
                <span className="text-sm font-normal text-muted-foreground">
                  Inactive sections won't appear in created schedules. You can disable instead of delete.
                </span>
              </Label>
              <Switch
                checked={isActive}
                onCheckedChange={(value) => setIsActive(value)}
              />
            </div>
          </Card>
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
