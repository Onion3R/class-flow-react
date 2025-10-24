import React,{useState, useEffect} from 'react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardAction
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { BarLoader } from 'react-spinners';
import { ScrollArea } from "@/components/ui/scroll-area";
import { ClipboardList, Clock, CalendarX2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CircleSmall } from 'lucide-react';
function Availability({classesToday, dayName, days}) {
  const [isClicking, setIsClicking] = useState(false)


    if(!classesToday) {
      return (
        <div className='absolute top-[45px] left-0 right-0 ' >
          <BarLoader isLoading={true}  color='#D3D3D3' className='!w-full' />
        </div>
        );
    }

  return (
    <div className='space-y-3 mt-2  '> 
    
        <Tabs defaultValue={dayName.toLowerCase()} >
  <TabsList className='bg-transparent space-x-0 md:space-x-5 '>
    {days.slice(1,6).map((day, idx) => (
      <TabsTrigger key={idx} value={day.toLowerCase()} onClick={() => setIsClicking(true)} className='text-xs sm:text-xl font-normal border-none cursor-pointer !bg-transparent !shadow-none dark:text-muted-foreground text-muted-foreground   data-[state=active]:text-black'>
       
        {day}{dayName === day ? <CircleSmall className='fill-green-300 text-green-300' /> : null}
        </TabsTrigger>
    ))}
  
  </TabsList>
  { ((dayName === 'Saturday') ||  (dayName === 'Sunday') ) && !isClicking 
  ? 
  <div className="h-[calc(100vh-200px)] w-full  flex items-center justify-center">
    <div className='w-full md:w-2/3 lg:w-1/3'>
  <Empty className='border !min-w-none !max-w-none rounded-sm'>
  <EmptyHeader>
    <EmptyMedia variant="icon">
          <CalendarX2 />
        </EmptyMedia>
    <EmptyTitle>No Schedule Found</EmptyTitle>
    <EmptyDescription>
      There’s currently no schedule available for <strong>{dayName}</strong>.
    </EmptyDescription>
  </EmptyHeader>
  {/* <EmptyContent>
    <Button size="sm">Send a Message</Button>
  </EmptyContent> */}
</Empty>
</div>
</div>

  : 
  
  <div>
    {days.slice(1,6).map((day) => (
      <TabsContent value={day.toLowerCase()} id={day.toLowerCase()}>
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

      

      {classesToday && Object.entries(classesToday[day]).map(([timeRange, block]) => (
        <Card
          key={timeRange}
          className="shadow-none hover:shadow-md transition-all duration-200 border border-border/50 gap-2"
        >
           <Tabs defaultValue="busy" >
          <CardHeader >
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-sm font-semibold">{block.block_name}</CardTitle>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {timeRange}
                </p>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <ClipboardList className="w-3 h-3" />
                 {block.teaching_teachers.length} Classes
                </p>
                 {/* <Badge variant="secondary" className="text-[10px]">
                {block.teaching_teachers.length} Classes
              </Badge> */}
              </div>
              <CardAction className='flex items-center gap-2'>
                  <TabsList>
              <TabsTrigger className="text-xs" value="busy">  Busy</TabsTrigger>
              <TabsTrigger className="text-xs" value="free">Free</TabsTrigger>
            </TabsList>
              </CardAction>
                  
              

            </div>
          </CardHeader>

          <CardContent >
           
        
          <TabsContent value="busy">
              <ScrollArea className="h-[220px]">
              <div className="divide-y divide-border/30">
                {block.teaching_teachers.map((t) => (
                  <div
                    key={t.id}
                    className="flex justify-between items-center p-3 hover:bg-muted/40 transition"
                  >
                    <div>
                      <p className="text-sm font-medium">{t.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {t.subject} — {t.section}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-xs whitespace-nowrap">
                      {t.subject_title.length > 18
                        ? t.subject_title.slice(0, 18) + "…"
                        : t.subject_title}
                    </Badge>
                  </div>
                ))}

                
              </div>
            </ScrollArea>
          </TabsContent>
          <TabsContent value="free">
              <ScrollArea className="h-[220px]">
              <div className="divide-y divide-border/30">
                {block.available_teachers.map((t) => (
                  <div
                    key={t.id}
                    className="flex justify-between items-center p-3 hover:bg-muted/40 transition"
                  >
                    <div>
                      <p className="text-sm font-medium">{t.name}</p>
                    </div>
                  </div>
                ))}

                
              </div>
            </ScrollArea>
          </TabsContent>
        
          </CardContent>
          </Tabs>
        </Card>

      ))}
    </div>
    
     </TabsContent>
    ))}
  </div>
  }
 
</Tabs>
      
    </div>
  )
}

export default Availability