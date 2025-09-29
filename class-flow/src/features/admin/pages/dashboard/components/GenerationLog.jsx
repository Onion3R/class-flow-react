import React,{useState,useEffect} from 'react'
import { Card, CardDescription, CardAction, CardFooter, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {  ScrollArea } from '@/components/ui/scroll-area'
import useGenerationHistoryGetter from '@/lib/hooks/useGenerationHistory'
function GenerationLog() {
    const [completeGenerate, setCompleteGenerate] = useState([])
    const {data: history, isLoading: historyIsLoading } = useGenerationHistoryGetter()
  useEffect(() => {
    
    if(!historyIsLoading && history.length > 0 ) {
       const data = history.filter(e => e.action === 'generation_completed')
      //  console.log('all generated schedule',data)
      setCompleteGenerate(data)
    }
  }, [history, historyIsLoading])
  return (
        <div className='w-[20%]   '>
    <Card className='shadow-none h-full bg-transparent max-h-[517px]'>
     <CardHeader>
      <CardTitle>Generate History</CardTitle>
      <CardDescription>Your past generating activity</CardDescription>
     </CardHeader>
       <ScrollArea className='h-[75%]'>
     <CardContent className='h-auto'>
    
        <div >
          <div className='flex flex-col gap-1'>
          { completeGenerate && completeGenerate.length > 0 && (
             completeGenerate.map(e => (
             <div className='flex flex-col w-40 '>
              
            <span className='text-[13px] font-semibold truncate break-words'>{e.generated_schedule_name}</span>
            <span className='text-xs text-muted-foreground'>{e.formatted_timestamp}</span>
          </div> 
          ))
          )}
          </div>
        </div>
       
     </CardContent>
      </ScrollArea>
     <CardFooter asChild >
      <Button className='w-full text-sm' variant='secondary' >Generate</Button>
     </CardFooter>
    </Card>
    </div>
  )
}

export default GenerationLog