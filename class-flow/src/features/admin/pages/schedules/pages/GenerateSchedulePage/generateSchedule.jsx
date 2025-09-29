import React, {useState} from 'react'
import { Button } from '@/components/ui/button'
import Wizzard from './components/Wizzard'
function GenerateSchedule() {

  // const [getStarted, setGetStarted] = useState(false)

  return (
    <div className='container p-4 mx-auto h-[calc(100%-45px)] flex items-center flex-col'>
      <div className='h-[85%] w-[75%]'>
       {/* {getStarted ?
        
      :
      <div className=' h-full w-full flex items-center justify-center'>
      <Button className='w-52 h-12' onClick={() => setGetStarted(true)}>Get Started</Button>
      </div>
      } */}
       <Wizzard />
      </div>
      
    </div>
  )
}

export default GenerateSchedule