import React from 'react'
import { Progress } from '@/components/ui/progress'
import { TextRoll } from '@/components/ui/text-roll'
import { TabsList, TabsTrigger, } from '@/components/ui/tabs'
function Title({progress, tabItems, active, teacherData}) {
  return (
    <div className='   border-dashed border-b-2 relative sm:p-0  p-5'>
                {progress != 110 && 
                  <Progress className='h-[3px] bg-transparent absolute -top-2' value={progress} />
                  }
                <div className='container mx-auto h-full flex flex-col justify-center  items-start py-7 pt-4'>
                  
                  <span className='h-13 flex items-center'>
                  {progress === 110 ? (
                   <TextRoll
                    className='overflow-clip text-4xl font-bold '
                    variants={{
                      enter: {
                        initial: { y: 0 },
                        animate: { y: 40 },
                      },
                      exit: {
                        initial: { y: -40 },
                        animate: { y: 0 },
                      },
                    }}
                    duration={0.3}
                    getEnterDelay={(i) => i * 0.05}
                    getExitDelay={(i) => i * 0.05 + 0.05}
                    transition={{
                      ease: [0.175, 0.885, 0.32, 1.1],
                    }}
                  >
                    Dashboard
                  </TextRoll>
                  ) : (
                    <span className='py-4'>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-600 text-transparent bg-clip-text inline-block">
                  Hello, {teacherData.first_name}
                  </h1>
                  <p className='font-medium text-foreground dark:text-neutral-300'>Welcome back to ClassFlow!</p>
                  
                  </span>
                  )}

                  </span>
                  
              <TabsList className={"mt-6 border-dashed border "}>
                {
                  tabItems.map(({key, label}) => (
                     <TabsTrigger value={key} key={key} disabled={!active}>{label}</TabsTrigger>
                  ))
                }
               
              </TabsList>
              
                </div>
              </div>
  )
}

export default Title