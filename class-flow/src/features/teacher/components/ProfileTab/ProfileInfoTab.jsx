import React, {useEffect, useState} from 'react'
import {  AlertCircle } from 'lucide-react'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Award } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
function ProfileInfoTab({ profileData}) {
  const [personalInfo, setPersonalInfo] = useState()
  const [professionalInfo, setProfessionalInfo] = useState()
  const [specializations, setSpecializations] = useState()
  useEffect(() => {
    if (profileData) {
      const {personal_info, professional_info,specializations} = profileData
   setPersonalInfo(personal_info)
   setProfessionalInfo(professional_info)
   setSpecializations(specializations)
    }
   
  }, [profileData])
  

  return (
    <div className='!w-full space-y-4'>
          <Card className='shadow-none '>
          <CardHeader>
            <CardTitle>Account Detail</CardTitle>
            <CardDescription>Here some basic information about you</CardDescription>
            <CardAction >
               {professionalInfo && professionalInfo.role &&
               <Badge variant='secondary' > <Award /> {professionalInfo.role.label}</Badge>
               }
            </CardAction>
          </CardHeader>
          <CardContent className='space-y-3'>
          <div className='flex gap-3'>
            <Input value={personalInfo?.first_name ?? ''} readOnly   />
            <Input value={personalInfo?.last_name ?? ''} readOnly   />
          </div>
          <Input value={personalInfo?.email ?? 'No email found'} readOnly  />
          <Separator  className='my-4 mt-6'/>
         <div className='space-y-1'>
            <CardTitle>Subject Summary</CardTitle>
            <CardDescription>Here some basic information about you</CardDescription>
            </div>
               <div className='flex flex-col md:flex-row items-center gap-2 md:gap-10 '>
                <div className='border rounded-sm h-full w-full md:w-1/3 bg-card p-5'>
                    <h1 className='font-bold text-4xl'>
                      {professionalInfo?.base_max_minutes_per_week}
                    </h1>
                    <p className='font-medium'>Max minutes</p>
                    <p className='text-muted-foreground text-xs'>
                    Maximum minutes per week allocated for all your subjects.
                    </p>
                  </div>
                  <div className='w-full md:w-2/3  '>
                    {specializations?.map(e => (
                      <div className='p-4' key={e.id}> 
                        <h1 className='text-sm'><span>{e.subject.code}</span> {e.subject.title}</h1>
                        <span className='flex gap-2'><p className='text-sm text-muted-foreground'>{e.subject.minutes_per_week} minutes</p> <Badge>{e.proficiency_level}</Badge> </span>
                        
                      </div>
                    ))}
                  </div>
               </div>
           
          </CardContent>
            
        </Card>
          <Alert variant="default">
          <AlertCircle />
          <AlertTitle>Subjects not assigned correctly?</AlertTitle>
          <AlertDescription>
            Reach out to your administrator to update or correct your subject list.
          </AlertDescription>
        </Alert>
          
        </div>
  )
}

export default ProfileInfoTab


// <div className='mt-5'>
//             <CardTitle>Subjects</CardTitle>
//             <div className='mt-2 pl-3 flex gap-4'>
//               <Badge className='text-sm'><span className='font-bold '>MATH-01</span> General Mathematics </Badge>
//               <Badge className='text-sm'><span className='font-bold '>MATH-01</span> General Mathematics </Badge>
//             </div>

//           </div>
              // {JSON.stringify(professionalInfo, null, 2)}
