import React, {useState} from 'react'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'

import { BarLoader, PulseLoader } from 'react-spinners'
import { Card, CardContent } from '../../../components/ui/card'
import { useAuth } from '@/app/context/authContext'
import { useNavigate } from 'react-router-dom'
import { updateTeacher } from '@/app/services/teacherService'
function GetStarted() {
   const [firstName, setFirstName] = useState('')
   const [lastName, setLastName] = useState('')
  const{teacherData, isLoading, teacherRefresh, useLoggedIn, currentUser } = useAuth()

  const navigate = useNavigate()




  const handleSubmit = async () => {
      if(!firstName || !lastName) return

      if(teacherData && teacherData.id && !isLoading) {
          console.log(teacherData)
        console.log('meron teacherData and Id')
        const data = {
          first_name: firstName,
            last_name: lastName,
            firstTime: false,
        }
        try {
        console.log('user login' , useLoggedIn)
         await updateTeacher(teacherData.id , data) 
         await teacherRefresh();
          navigate("/");
          console.log('heelo')
        } catch (error) {
          console.log(error)
        }
        window.localStorage.removeItem('emailForSignIn')
      }
  }
   if (isLoading || !teacherData) return <PulseLoader />;

  return (
     <Card className="w-100 relative overflow-hidden backdrop-blur-md bg-white/10 border border-black/20 text-black dark:bg-black/10 dark:border-white/10 dark:text-white flex items-center justify-center  p-4 ">
      <BarLoader 
      loading={isLoading} 
      color='#D3D3D3' 
      className='!absolute !w-full top-0  p-0 m-0'  />
      <CardContent className='p-6'>
    <div className="flex flex-col items-center justify-center max-w-md mx-auto ">
  <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
    Let's Get Started
  </h2>
    <div className='flex mb-5 gap-5'>
  <Input placeholder='First Name'
    value={firstName}
  onChange={(e)=>setFirstName(e.target.value)}
  />
  <Input 
  placeholder='Last Name'
  value={lastName}
  onChange={(e)=>setLastName(e.target.value)}
  />
  </div>
    <Input placeholder={currentUser.email} disabled className='shadow-4xl placeholder:text-foreground border-gray-400/60 shadow-2xl '/>
  <Button size="lg" className='w-full mt-5' onClick={handleSubmit} disabled={isLoading}>
    Continue
  </Button>
</div>
</CardContent>
</Card>
  )
}

export default GetStarted