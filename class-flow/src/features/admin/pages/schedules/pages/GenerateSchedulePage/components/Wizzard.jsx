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
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'

function Wizzard() {
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
        semester: fallbackMatch.semester.name,
      }
    }

    console.log(data)
    setSelectedScheduleId(data.id)
    generateName(data)
    setLoading(true)
    setProcess("Generating schedule name.")
  }, [selectedSchedule, allGeneratedScheduleData, allScheduleData])

  const generateName = (result) => {
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
    <section className='flex h-full gap-5 items-center'>
      <div className='h-full pt-[10%] w-[40%]'>
        <h1 className='text-3xl font-bold'>Before You Generate</h1>
        <p className='text-muted-foreground text-xl font-medium'>
          Things to consider before generating a schedule
        </p>
      </div>
      <div className='w-[60%] text-base flex flex-col gap-4'>
        <div className='p-4 border border-gray-400 dark:border-accent rounded-2xl grid grid-cols-[30px_1fr] '>
          <CircleDashed size={18} />
          <div>
            <p className='font-semibold'>
              All year levels (e.g., Grade 11, Grade 12) in the selected schedule will be processed.
            </p>
            <span className='text-sm text-muted-foreground'>Check your data under Programs.</span>
          </div>
        </div>
        <div className='p-4 border border-gray-400 dark:border-accent rounded-2xl grid grid-cols-[30px_1fr] '>
          <CircleDashed size={18} />
          <div>
            <p className='font-semibold'>
              Once a schedule is created, any changes made afterward will not be reflected in that schedule.
            </p>
            <span className='text-sm text-muted-foreground'>Review your inputs in "New Schedule".</span>
          </div>
        </div>
        <div className='p-4 border border-gray-400 dark:border-accent rounded-2xl grid grid-cols-[30px_1fr] '>
          <CircleDashed size={18} />
          <div>
            <p className='font-semibold'>
              Generated schedules can be overridden. Verify your selections before proceeding.
            </p>
            <span className='text-sm text-muted-foreground'>Check your data under Programs.</span>
          </div>
        </div>
        <div className='p-4 border border-gray-400 dark:border-accent rounded-2xl grid grid-cols-[30px_1fr] '>
          <CircleDashed size={18} />
          <div>
            <p className='font-semibold'>The system will automatically generate a name for your schedule.</p>
            <span className='text-sm text-muted-foreground'>
              This name cannot be changed after creation.
            </span>
          </div>
        </div>
        </div>
      </section>,
   
    
    <section className='h-full flex-col w-full flex items-center justify-center'>
      <div>
        <div className='flex flex-col  items-center gap-4 justify-center '>
          <div className=''>
            <h1 className='text-3xl font-bold'>Generate</h1>
            <p className='text-lg '>Choose a schedule to generate</p>
          </div>
          <SelectComponent
            items={allScheduleData.map((s) => s.title)}
            label="Schedules"
            value={selectedSchedule}
            onChange={setSelectedSchedule}
            className="!max-w-none !w-full !min-w-none "
          />
        </div>
        {loading &&
          <div className='flex items-center just mt-2 gap-2'>
            <MoonLoader loading={loading} color='#DDDDDD' size={14} />
            <p className='text-muted-foreground text-sm '>
              {process}
            </p>
          </div>
        }
        {userContinue &&
          <p className='text-muted-foreground  mt-2 flex text-sm items-center '>
            <CircleSmall size={14} className='fill-green-600  text-green-600 mr-1' />
            Ready to generate your timetable.
          </p>
        }
      </div>
    </section>,
    <section className='h-full flex-col w-full flex items-center justify-center'>
      <div className='max-w-96'>
        {userContinue &&
          <p className='text-muted-foreground  mb-4 flex items-center '>
            <CircleSmall size={14} className='fill-green-600 text-green-600 mr-1' />
            Ready to generate your timetable.
          </p>
        }
        {loading &&
          <div className='flex items-center just mb-4 gap-2'>
            <MoonLoader loading={loading} color='#DDDDDD' size={14} />
            <p className='text-muted-foreground  '>
              {process}
            </p>
          </div>
        }
        {successMessage &&
          <p className='text-muted-foreground  mb-4 flex items-center '>
            {/* <CircleSmall size={14} className='fill-green-600 text-green-600 mr-1' /> */}
            {successMessage}
          </p>
        }
        {errorMessage &&
          <p className='text-muted-foreground  mb-4 flex items-center '>
            {/* <CircleSmall size={14} className='fill-red-600 text-red-600 mr-1' /> */}
            {errorMessage}
          </p>
        }
        <p className='text-xl'><span className='font-bold '>NAME:</span> {scheduleName}</p>
        <Button
          variant='outline'
          className='w-full mt-2'
          size='lg'
          onClick={() => handleGenerate()}
          disabled={!selectedScheduleId || loading}
        >
          {loading
            ? <TextShimmer duration={1.5} className="text-lg font-medium ">
              Generating...
            </TextShimmer>
            : 'Generate'}
        </Button>
      </div>
    </section>
  ]

  return (
    <div className='h-full w-full'>
      <OverrideDialogGenerateSchedule
        dialogOpen={dialogOpen}
        setDialogOpen={setDialogOpen}
        handleDialogContinue={handleDialogContinue}
      />
      <div className='h-full w-full'>
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

export default Wizzard
