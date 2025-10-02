import React from 'react'
import { CircleDashed } from 'lucide-react'
function step1() {
  const generationTips = [
  {
    title: "All year levels (e.g., Grade 11, Grade 12) in the selected schedule will be processed.",
    subtitle: "Check your data under Programs.",
  },
  {
    title: "Once a schedule is created, any changes made afterward will not be reflected in that schedule.",
    subtitle: 'Review your inputs in "New Schedule".',
  },
  {
    title: "Generated schedules can be overridden. Verify your selections before proceeding.",
    subtitle: "Check your data under Programs.",
  },
  {
    title: "The system will automatically generate a name for your schedule.",
    subtitle: "This name cannot be changed after creation.",
  },
];

  return (
   <section className='flex flex-col md:flex-row h-full gap-5 items-center'>
      <div className='h-auto md:h-full pt-[10%] w-full  md:w-[40%]'>
        <h1 className='text-base md:text-3xl font-bold '>Before You Generate</h1>
        <p className='text-muted-foreground text-sm md:text-xl font-medium'>
          Things to consider before generating a schedule
        </p>
      </div>
      <div className='md:w-[60%] w-full text-base flex flex-col gap-4'>
       
        {generationTips.map(e => 
           <div className='p-4 border border-gray-400 dark:border-accent rounded-2xl grid grid-cols-[30px_1fr] '>
          <CircleDashed size={18} />
          <div>
            <p className='font-semibold text-xs md:text-base'>
             {e.title}
            </p>
            <span className='md:text-sm text-xs text-muted-foreground'>
              {e.subtitle}
            </span>
          </div>
        </div>
        )}
        </div>
      </section>
  )
}

export default step1