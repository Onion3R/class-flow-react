import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { triggerToast } from "@/lib/utils/toast"
import { AlertCircleIcon } from 'lucide-react'
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from '../ui/label'
import useTrackGetter from '@/lib/hooks/useTracks'
import SelectComponent from '../Select/selectComponent'
import { updateStrand } from '@/app/services/apiService'
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Separator } from '../ui/separator'
import { strandSchema } from '@/app/schema/schema'
const toastInfo = {
  success: true,
  title: 'Update Strand',
  desc: 'Successfully updated',
}

function StrandDialogContent({ selectedRow, onConfirm, onOpenChange, onRefresh }) {
  const [name, setName] = useState("")
  const [code, setCode] = useState("")
  const [selectedTrack, setSelectedTrack] = useState("")
  const { data: allTrackData, isLoading: trackDataIsLoading, error: errorTrack } = useTrackGetter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  // Initialize form fields when selectedRow changes
  useEffect(() => {
    if (selectedRow) {
      setName(selectedRow.name || "")
      setCode(selectedRow.code || "")
      setSelectedTrack(selectedRow.track.name || "")
    }
    console.log("Selected Row:", selectedRow)
  }, [selectedRow])

  async function handleUpdate(e) {
    setIsLoading(true)
    e.preventDefault()
    if (!name || !code || !selectedTrack) {
      setError({ message: "All fields are required" })
      return
    }

    

    if (allTrackData) {
       const data = {
          name,
          code,
          track_id: allTrackData.find(t => t.name === selectedTrack)?.id || "",
          description: ''
        }

      try {
        await strandSchema.validate(data, {abortEarly: false})
      } catch (validationError) {
          setError({ message: Array.isArray(validationError.errors) ? validationError.errors[0]  : validationError.errors});
          setIsLoading(false)
          return
      }

      try {
       
        await updateStrand(selectedRow?.id, data)
        triggerToast({ ...toastInfo, success: true })
        onConfirm()
        onRefresh()
      } catch (error) {
        console.error("Error updating strand:", error)
      }
      setIsLoading(false)
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
        {error && (
          <Alert variant="destructive" className="border-red-500 bg-red-100 dark:bg-red-900/30">
            <AlertCircleIcon className="h-4 w-4" />
             <AlertTitle className='className=" !break-words' >
                Error: Failed to update strand
              </AlertTitle>
              <AlertDescription>
                {error.message}
              </AlertDescription>
          </Alert>
        )}
        <Separator />
        <div className="space-y-4  px-2">
          <div className='flex md:flex-row flex-col gap-5'>
            <div>
              <Label
                htmlFor='name'
                className={`mb-2 text-xs text-foreground/80 ${!name && "text-red-600 font-semibold"}`}
              >
                Strand Name *
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter name"
                className={`!w-full !max-w-none ${!name && "border border-red-500 placeholder:text-red-400"}`}
                required
              />
            </div>
            <div>
              <Label
                htmlFor='code'
                className={`mb-2 text-xs text-foreground/80 ${!code && "text-red-600 font-semibold"}`}
              >
                Strand Code *
              </Label>
              <Input
                id="code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter code"
                className={`!w-full !max-w-none ${!code && "border border-red-500 placeholder:text-red-400"}`}
                required
              />
            </div>
          </div>

          {trackDataIsLoading && <p className="text-sm text-muted">Loading tracks...</p>}
          {errorTrack && <p className="text-sm text-red-500">Error loading tracks</p>}

          {!trackDataIsLoading && !errorTrack && (
            <div>
              <Label
                className={`mb-2 text-xs text-foreground/80 ${!selectedTrack && "text-red-600 font-semibold"}`}
              >
                Track *
              </Label>
              <SelectComponent
                id="track"
                items={allTrackData?.map((s) => s.name)}
                label="Choose track"
                value={selectedTrack}
                onChange={setSelectedTrack}
                className={`!w-full !max-w-none ${!selectedTrack && "text-red-600 data-[placeholder]:text-red-400 border-red-500"}`}
                
              />
            </div>
          )}
        </div>

        <DialogFooter className="mt-6">
          <DialogClose asChild onClick={() => onOpenChange(false)}>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button variant="default" onClick={(e) => handleUpdate(e)} disabled={isLoading}>
            {isLoading ? 'Loading...' : 'Update'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </form>
  )
}

export default StrandDialogContent
