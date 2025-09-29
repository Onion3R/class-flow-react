import React from 'react'
import { Badge } from '@/components/ui/badge'
import { Card, CardDescription, CardAction, CardFooter, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Mail, Minimize2, Eye, Wand, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { LinksDialog } from './LinksDialog'
function DashboardOverview() {
  return (
    <div className='flex items-center h-45 justify-between mb-5 gap-5 w'>
      <div className='max-w-65 border flex-1 w-full h-full px-3 py-6 rounded-xl bg-primary flex flex-col'>
        <div>
          <h1 className='text-white text-sm'>Selected Schedule</h1>
          <p className='font-bold text-white'>Test test</p>
        </div>
        <div className='w-full'>
          <p className='text-xs mt-1 text-white'>Click deselect to select a different generated schedule</p>
          <Button variant='secondary' className='w-full mt-2'>Deselect</Button>
        </div>
      </div>

      {/* <div>
        <h1 className='text-3xl font-bold'>Generate Schedule </h1>
        <p>Click "Generate Schdule" and it will redirect you to Auto</p>
        <div className='flex gap-2 mt-4'>
          <Button variant='secondary'>Generate Schedule</Button>
        </div>
        <div className='flex flex-col'></div>
      </div> */}

      {/* <div className='px-6 w-[42%] shadow-none flex gap-4 items-center justify-center !h-full rounded-xl border text-black dark:text-white'>
        <div className='flex gap-6'>
          <div>
            <section>
              <p className="text-sm text-gray-800 dark:text-accent-foreground">Admins</p>
              <h2 className="font-semibold tabular-nums text-3xl">01</h2>
            </section>
            <section>
              <p className="text-base font-medium text-accent-foreground flex items-center gap-1">Created schedules </p>
              <p className='text-sm text-muted-foreground'>Something something here</p>
            </section>
          
          </div>
          <div>
            <section>
              <p className="text-sm text-gray-800 dark:text-accent-foreground">Admins</p>
              <h2 className="font-semibold tabular-nums text-3xl">02</h2>
            </section>
            <section>
              <p className="text-base font-medium text-accent-foreground flex items-center gap-1">Generated schedules </p>
              <p className='text-sm text-muted-foreground'>Something something here</p>
            </section>
          </div>
        </div>
        <div className='h-full flex items-center justify-end'>
          <span className='w-20 h-20 flex items-center justify-center bg-purple-200 rounded-full'>
            <Wand className='text-purple-600' size={40} />
          </span>
        </div>
      </div> */}

      <Card className='min-w-62' >
        <CardHeader>
          <CardDescription> Create Schedules</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            02
          </CardTitle>
          <CardAction>
            <Button
              asChild
              variant="outline"
              className="h-6 w-[70px] text-xs font-medium bg-transparent border-green-400 text-green-300 flex items-center gap-1 rounded-md"
            >
              <Link to='/admin/create-schedule'>
              <Eye className="w-3.5 h-3.5" />
              Check
              </Link>
            </Button>
        </CardAction>
        </CardHeader>
       <CardFooter className="flex-col items-start gap-1.5 text-sm">
        <div className="line-clamp-1 flex gap-2 font-medium">
          Active templates
        </div>
        <div className="text-muted-foreground">
          Ready for generating.
        </div>
      </CardFooter>
      </Card>
      <Card className='min-w-67' >
        <CardHeader>
          <CardDescription> Generated Schedules</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            01
          </CardTitle>
          <CardAction>
            <Button asChild
              variant="outline"
              className="h-6 w-[70px] text-xs font-medium bg-transparent border-green-400 text-green-300 flex items-center gap-1 rounded-md"
            >
              <Link to='/admin/generate-schedule'>
              <Eye className="w-3.5 h-3.5" />
              Check
              </Link>
            </Button>
        </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
        <div className="line-clamp-1 flex gap-2 font-medium">
          Schedules generated
        </div>
        <div className="text-muted-foreground">
          Awaiting review
        </div>
      </CardFooter>
      </Card>

      <div className='h-full w-2/5  flex items-center'>
        <div className="shadow flex w-full px-8 items-center bg-card   !h-full rounded-xl border text-black dark:text-accent-foreground">
          <div className="flex gap-5  items-center justify-around w-full ">
            <div className="w-1/2 grid grid-cols-3 gap-4">
              <div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground ">Admins</p>
                  <h2 className="font-semibold tabular-nums text-xl">01</h2>
                </div>
              </div>
              <div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground ">Teachers</p>
                  <h2 className="font-semibold tabular-nums text-xl">15</h2>
                </div>
              </div>
              <div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground ">Subjects</p>
                  <h2 className="font-semibold tabular-nums text-xl">18</h2>
                </div>
              </div>
              <div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground ">Grade</p>
                  <h2 className="font-semibold tabular-nums text-xl">02</h2>
                </div>
              </div>
              <div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground ">Strand</p>
                  <h2 className="font-semibold tabular-nums text-xl">02</h2>
                </div>
              </div>
              <div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground ">Sections</p>
                  <h2 className="font-semibold tabular-nums text-xl">10</h2>
                </div>
              </div>
            </div>

            <div className="w-1/2 m-0 p-0 space-y-2 h-full max-w-55 ">
              <h1 className="font-bold text-xl">Details</h1>
              <p className="text-sm text-muted-foreground ">
                If you want to change these info something something soemthing something .
              </p>
              {/* <Button variant="outline" size="sm" className="w-[70%] text-xs">Update</Button> */}
              <LinksDialog />
            </div>
          </div>
        </div>

        {/* <Card className="shadow-none w-75 gap-1 bg-transparent">
          <CardHeader className="space-y-1">
            <CardDescription className="text-sm">Schedules</CardDescription>
            <CardTitle className="font-semibold tabular-nums text-xl ">
              2
            </CardTitle>
            <CardAction>
              <Button
                variant="outline"
                className="h-6 w-[70px] text-xs font-medium border-green-400 text-green-300 flex items-center gap-1 rounded-md"
              >
                <Eye className="w-3.5 h-3.5" />
                Check
              </Button>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex flex-col items-start text-sm space-y-1">
            <div className="text-gray-400">
              Represents the current number of "Generated Schedules". You can check the list.
            </div>
          </CardFooter>
        </Card> */}
      </div>
    </div>
  )
}

export default DashboardOverview
