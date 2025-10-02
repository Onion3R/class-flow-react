import React, { useState, useEffect } from 'react'
import { CircleDashed, CircleSmall } from 'lucide-react'
import { Button } from '@/components/ui/button'
import SelectComponent from '@/components/Select/selectComponent'
import useScheduleGetter from '@/lib/hooks/useSchedules'
import useGeneratedScheduleGetter from '@/lib/hooks/useGeneratedSchedules'
import { MoonLoader } from 'react-spinners'
import OverrideDialogGenerateSchedule from './OverrideDialogGenerateSchedule'
import { generateSchedule } from '@/app/services/apiService'
import { triggerToast } from "@lib/utils/toast"
import { TextShimmer } from '@/components/motion-primitives/text-shimmer'
import Step1 from './wizzard/step1'
import Step2 from './wizzard/Step2'
import Step3 from './wizzard/Step3'
function Wizard() {
  const [currentPageIndex, setCurrentPageIndex] = useState(0)
  const { data: allScheduleData = [], isLoading: scheduleIsLoading } = useScheduleGetter()
  const { data: allGeneratedScheduleData = [], isLoading: generatedScheduleIsLoading } = useGeneratedScheduleGetter()

  const [selectedSchedule, setSelectedSchedule] = useState('')
  const [selectedScheduleId, setSelectedScheduleId] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [process, setProcess] = useState('')
  const [scheduleName, setScheduleName] = useState('')
  const [loading, setLoading] = useState(false)
  // const [generatingNameIsDone, setGeneratingNameIsDone] = useState(false)
  const [userContinue, setUserContinue] = useState(false)
  const [disabled, setDisabled] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [isOverride, setIsOverride] = useState(false)
  const [isDoneGenerating, setIsDoneGenerating] = useState(false)  

  const nextPage = () => {
    if (currentPageIndex < pages.length - 1) {
      setCurrentPageIndex(currentPageIndex + 1)
    }
  }

  const prevPage = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex(currentPageIndex - 1)
    }
  }

  useEffect(() => {
    setUserContinue(false)
    if (!selectedSchedule || !allGeneratedScheduleData || !allScheduleData) { return }

    let data

    const generatedMatch = allGeneratedScheduleData.find(
      e => e.schedule.title === selectedSchedule
    )
    console.log('generated match', generatedMatch)
    if (generatedMatch && generatedMatch.length > 0) {
      data = {
        id: generatedMatch.schedule.id,
        year: generatedMatch.schedule.academic_year,
        semester: generatedMatch.schedule.semester.id,
      }
    } else {
      const fallbackMatch = allScheduleData.find(
        e => e.title === selectedSchedule
      )

      if (!fallbackMatch) return // avoid crashing if no match

      data = {
        id: fallbackMatch.id,
        year: fallbackMatch.academic_year,
        semester: fallbackMatch.semester.id,
      }
    }

    console.log(data)
    setSelectedScheduleId(data.id)
    generateName(data)
    setLoading(true)
    setProcess("Generating schedule name.")
  }, [selectedSchedule, allGeneratedScheduleData, allScheduleData])

  const generateName = (result) => {
    console.log('result', result)
    let semester
    const academicYear = result.year
    // console.log(result)
    if (result.semester === 2) {
      semester = 'S1'
    } else {
      semester = 'S2'
    }
    const name = `SY${academicYear}_${semester}_${selectedSchedule}`
    setScheduleName(name)
    setTimeout(() => {
      // setGeneratingNameIsDone(true)
      checkIfnotGenerated(result.id)
      // You can call any function here
    }, 3000)
  }

  useEffect(() => {
    // console.log('this')
    if (
      (currentPageIndex !== 1 && currentPageIndex < pages.length - 1) ||
      (currentPageIndex === 1 && userContinue && currentPageIndex < pages.length - 1)
    ) {
      setDisabled(false)
    } else {
      setDisabled(true)
    }

    if (currentPageIndex === 0) {
      setScheduleName('')
      // setGeneratingNameIsDone(false)
      setUserContinue(false)
      setSelectedSchedule(null)
      setSelectedScheduleId(null)
    }

    if(currentPageIndex === 2 && isDoneGenerating) {
   
      setSuccessMessage('')
      setErrorMessage('')
    } 

    //  console.log('user continue?', userContinue)
  }, [currentPageIndex, userContinue])

  // console.log(scheduleName)
  const checkIfnotGenerated = async (id) => {
    setProcess('Checking existing schedule.')

    const alreadyGenerated = allGeneratedScheduleData.find(
      e => e.schedule.id === id
    )

    if (alreadyGenerated) {
      // Step 1: Show "Checking existing schedule"
      setTimeout(() => {
        setProcess('Existing schedule found.')

        // Step 2: After another delay, open dialog
        setTimeout(() => {
          setDialogOpen(true)
        }, 2000) // 2 seconds after "Existing schedule found"
      }, 2000) // 2 seconds after "Checking existing schedule"

      return
    } else {
      setTimeout(() => {
        setProcess('No existing schedule found.')

        setTimeout(() => {
          setLoading(false)
          setUserContinue(true)
        }, 2000)

      }, 2000)
    }

    // console.log(allGeneratedScheduleData)
    // console.log('already generated?', alreadyGenerated)
  }

  const handleDialogContinue = () => {
    setProcess('Overriding the schedule.')
    setTimeout(() => {
      setLoading(false)
      setIsOverride(true)
      setUserContinue(true)
    }, 2000)
    // console.log('id',selectedScheduleId)
  }

  const handleGenerate = async () => {
    setProcess('')
    setUserContinue(false)
    setLoading(true)

    try {
      setProcess('Attempting to generate...')

      const data = {
        schedule_id: selectedScheduleId,
        name: scheduleName,
        override: isOverride,
      }

      const responseData = await generateSchedule(data) // ✅ API call

      setProcess('Creating your timetable...')

      triggerToast({
        success: true,
        title: "Generate Success",
        desc: 'You have successfully generated a timetable.',
      })

      setErrorMessage('')
      setSuccessMessage(responseData.message)
    } catch (error) {
      setErrorMessage(error.message)
      setSuccessMessage('')
      console.log(error)

      triggerToast({
        success: false,
        title: "Generate Failed",
        desc: 'Unable to generate schedule',
      })
    } finally {
      setLoading(false)
      setIsDoneGenerating(true)
    }
  }


  useEffect(() => {
    if (!dialogOpen && process === 'Existing schedule found.') {
      setLoading(false)
    }
  }, [dialogOpen])

  const pages = [
    // <section className='flex items-center justify-center h-full'>
    //   <div className='w-[70%] flex gap--'>
    //     <div className='w-[80%]'>
    //       <h1 className='text-2xl font-bold '>Generate a schedule</h1>
    //       <p className='text-sm'>Select a schedule from the list below and Click generate to create a new timetable.</p>
    //       <Input
    //         placeholder={scheduleName ? scheduleName : 'Select a schedule'}
    //         className="mt-4 border-gray-400/70 shadow-2xs "
    //         disabled
    //       />
    //       <SelectComponent
    //         items={allScheduleData.map((s) => s.title)}
    //         label="Schedules"
    //         value={selectedSchedule}
    //         onChange={setSelectedSchedule}
    //         className="!max-w-none !w-full !min-w-none mt-2"
    //       />
    //       <div className='my-2'>
    //         <h1 className='font-bold mb-2'>Terminal log</h1>
    //         <ScrollArea className='h-55 w-full border rounded-md gap-2 flex flex-col  p-4'>
    //           <div className="text-sm text-gray-400">
    //             <span className='text-sm'> Ready to generate. Any messages or errors will appear here. </span> <br />
    //             {!selectedSchedule ? <span>Select a schedule to generate</span> : <span>Selected: {selectedSchedule}.</span>} <br />
    //             {errorMessage && <span className='text-sm !text-red-400'>{errorMessage}</span>}
    //             {successMessage && <span className='text-sm '>Success: {successMessage}  Check your generated schedule in "Schedule"</span>}
    //             <span className={`text-sm text-gray-400  ${!loading ? 'hidden' : 'block'}`}>
    //               Generating schedule, please wait...
    //             </span>
    //           </div>
    //           {errorMessage && <span className='text-sm !text-red-400'>{errorMessage}</span>}
    //         </ScrollArea>
    //       </div>
    //       <Button
    //         variant='outline'
    //         size='lg'
    //         className='w-full'
    //         onClick={handleGenerate}
    //         disabled={!selectedScheduleId || loading}
    //       >
    //         {loading ?
    //           <TextShimmer duration={1.5} className="text-sm font-medium ">
    //             Generating...
    //           </TextShimmer>
    //           : 'Generate'}
    //       </Button>
    //     </div>
    //     <div className='w-[20%] '>
    //       hello world
    //     </div>
    //   </div>
    // </section>,
    <Step1 />
    ,
   <Step2 allScheduleData={allScheduleData} selectedSchedule={selectedSchedule} setSelectedSchedule={setSelectedSchedule} loading={loading} process={process} userContinue={userContinue}/>
    ,
    <Step3 userContinue={userContinue} loading={loading} process={process} successMessage={successMessage} errorMessage={errorMessage} scheduleName={scheduleName} selectedScheduleId={selectedScheduleId} isDoneGenerating={isDoneGenerating} handleGenerate={handleGenerate} />
  ]

  return (
    <div className='h-full w-full'>
      <OverrideDialogGenerateSchedule
        dialogOpen={dialogOpen}
        setDialogOpen={setDialogOpen}
        handleDialogContinue={handleDialogContinue}
      />
      <div className='h-full w-full '>
        {pages[currentPageIndex]}
      </div>
      <div className='flex justify-between w-full mt-2'>
        <Button variant='outline' onClick={prevPage} disabled={currentPageIndex === 0}>
          Back
        </Button>
        <Button variant='outline' onClick={nextPage} disabled={disabled}>
          Next
        </Button>
      </div>
    </div>
  )
}

export default Wizard
