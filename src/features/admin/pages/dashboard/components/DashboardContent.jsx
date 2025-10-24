import React from 'react'
import { Link } from 'react-router-dom'
import { 
  Shell, 
  Sparkles, 
   Library,
  ChartNoAxesGantt,
  CalendarPlus,
  ChevronRightIcon,
  Radiation,
  Wand
  } from 'lucide-react'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
function DashboardContent({name , dashboardData , allGeneratedSchedule}) {



const links = [
  {
    url: 'subjects',
    badge: <Library  />,
    title: 'Add Subject',
    desc: 'Register a new subject for the curriculum.',
  },
  {
    url: 'programs',
    badge: <ChartNoAxesGantt  />,
    title: 'Configure Program',
    desc: 'Set up a structured academic program.',
  },
  {
    url: 'create-schedule',
    badge: <CalendarPlus />,
    title: 'Create Schedule',
    desc: 'Generate and manage class schedules.',
  },
]

console.log(dashboardData)

  return (
    <div className=' container mx-auto flex-col h-full lg:h-[calc(100vh-145px)] p-5'>
      <div className='flex flex-col lg:flex-row w-full h-full gap-0 lg:gap-6'>

        <div className='flex-1  lg:max-w-[50%] h-full  '>
          <div className='mt-[2%]'>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-600 text-transparent bg-clip-text inline-block">
              Hello, {name}
            </h1>
            <p className='font-medium text-base md:text-xl  text-accent-foreground'>
              Welcome back to ClassFlow!
            </p>
          </div>

          <div className='space-y-5 mt-7'>
            <div className="w-full rounded bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-600 p-[1px]">
              <div className="p-5 items-center rounded bg-background flex gap-4">
                <div className="p-2 rounded-full bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-600">
                  <Shell className="w-6 h-6 stroke-white" />
                </div>
                <div>
                  <h1>You have {allGeneratedSchedule.length} generated schedules</h1>
                  <p className='text-xs  md:text-sm text-muted-foreground'>
                    {allGeneratedSchedule.length > 0 ? "Looks like you're all set! Select a schedule to see it here." : ' No schedules are currently visible. Try generating one to get started. '}
                  </p>
                </div>
              </div>
            </div>

            <div className="w-full  rounded bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-600 p-[1px]">
              <div className="p-5 items-center rounded bg-background flex gap-4">
                <div className="p-2 rounded-full bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-600">
                  <Sparkles className="w-6 h-6 stroke-white" />
                </div>
                <div>
                  <h1>Start generating</h1>
                  <p className='text-muted-foreground text-xs  md:text-sm'>
                    Initiate a new schedule to optimize your weekly planning.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <p className="text-sm mt-2 text-muted-foreground ml-2">
            Manage your schedules efficiently to stay ahead.
          </p>
          {dashboardData ? 
           <div className="w-full mt-7  rounded bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-600 p-[1px] ">
              <div className="p-5 items-center  flex gap-4">
                <div className="p-2 rounded-full bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-600">
                  <Wand className="w-6 h-6 stroke-white" />
                </div>
                <div className='text-white'>
                 <h1 className="font-bold text-sm md:text-base">Selected Schedule: {dashboardData?.schedule_info?.name}</h1>
                  <p className="text-xs md:text-sm">
                    This schedule is now active. You can view related data and access additional tabs.
                  </p>

                </div>
              </div>
            </div>
          :
          <div className="w-full mt-7 rounded bg-gradient-to-r from-amber-400 via-orange-500 to-rose-600 p-[1px]">
                <div className="p-5 items-center flex gap-4">
                  <div className="p-2 rounded-full bg-gradient-to-r from-amber-400 via-orange-500 to-rose-600">
                    <Radiation className="w-6 h-6 stroke-white" />
                  </div>
                  <div className="text-white">
                    <h1 className="font-bold ">No Schedule Selected</h1>
                    <p className="text-sm">
                      Please select a schedule to access additional tabs and features.
                    </p>

                  </div>
                </div>
              </div>
          }
           
            
          <p className="text-sm mt-2 text-muted-foreground ml-2">
           To select a schedule go to <Link to={'schedules'} className='hover:text-blue-500 hover:underline'>Schedule List</Link>
          </p>



          
        </div>

        <div className='flex-1 lg:min-w-60 flex items-center  flex-col'>
          <div className='w-full lg:w-[75%] mt-13'>
          <div className='text-sm mb-1'>
            <p className='text-muted-foreground'>Administrative shortcuts for common tasks</p>
          </div>
          <div className='bg-gray-100/30 dark:bg-card border p-5 rounded-sm  space-y-5'>
             {links.map((e ,idx)=> 
               <Item key={idx} variant="outline" size="sm" asChild className='bg-white dark:bg-transparent'>
              <Link to={e.url}>
                <ItemMedia>
                  {e.badge}
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>{e.title}</ItemTitle>
                   <ItemDescription>
           {e.desc}
          </ItemDescription>
                </ItemContent>
                <ItemActions>
                  <ChevronRightIcon className="size-4" />
                </ItemActions>
              </Link>
            </Item>
             )}
          </div>
          </div>
        </div>
      </div>
      <div className="text-muted-foreground text-xs lg:mt-0 mt-5 lg:absolute lg:bottom-4">
            <p>© ClassFlow. All rights reserved.</p>
            <p>Developed for Pawing National High School</p>
          </div>
    </div>
  )
}

export default DashboardContent