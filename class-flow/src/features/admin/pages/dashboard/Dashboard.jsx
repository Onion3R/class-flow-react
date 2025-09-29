import React, {useState} from 'react'

import { Button } from '@/components/ui/button'
import DashboardContent from './components/DashboardContent'
const Dashboard = () => {
 
  const [started, setStarted] = useState(false)

  

  return (
    <div >
       { started ? 
       <DashboardContent />
       :
      
      <div className="flex items-center justify-center h-[calc(100vh-45px)] rounded w-full">
      <div>
                <h1 class="text-4xl font-bold bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-600 text-transparent bg-clip-text inline-block">
                  Welcome, John <span className='text-yellow-50'>🖐</span>
                  </h1>
                  <p className='text-white'>To start your journey please input all necesseray data.</p>

                  <Button className='mt-5 w-2/5' onClick={() => setStarted(true)}>Start</Button>
         </div>        
                  
    </div>
       }
    </div>
  )
}

export default Dashboard