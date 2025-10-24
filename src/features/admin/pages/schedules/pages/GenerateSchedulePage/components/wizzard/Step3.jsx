import React from 'react'
import { TextShimmer } from '@/components/motion-primitives/text-shimmer'
import { Button } from '@/components/ui/button'
import { CircleSmall } from 'lucide-react'
import { MoonLoader } from 'react-spinners'
function Step3({userContinue, loading, process, successMessage, errorMessage, scheduleName, selectedScheduleId, isDoneGenerating, handleGenerate}) {
  return (
   <section className='h-full flex-col w-full flex items-center justify-center '>
      <div className='max-w-80 '>
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
          disabled={!selectedScheduleId || loading || isDoneGenerating}
        >
          {loading
            ? <TextShimmer duration={1.5} className="text-base font-medium ">
              Generating...
            </TextShimmer>
            : 'Generate'}
        </Button>
      </div>
    </section>
  )
}

export default Step3