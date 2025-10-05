import React from 'react'
import { UserRound, AlertCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
function ProfileTab({profileInfo, workloadMetrics, teachingAnalytics }) {
  return (
    <div className='flex items-center justify-center'>
    <div className='w-5/6  '>
    <Tabs defaultValue="account" >
      <div className='flex gap-5 h-fit'>
      <TabsList className='flex flex-col max-h-none min-h-none gap-2 h-fit bg-transparent  '>
        <TabsTrigger value="account" className='!text-xl !bg-card w-ful flex gap-0 items-center '>
          <div className='flex flex-col items-start'>
            <span className='font-medium text-base '>Account</span>
            <span className='text-sm text-muted-foreground'>Basic information of the teacher</span>
          </div>
          </TabsTrigger>
        <TabsTrigger value="password" className='!text-xl !bg-card w-ful flex gap-0 items-center '>
          <div className='flex flex-col items-start'>
            <span className='font-medium text-base'>Analytics</span>
            <span className='text-sm text-muted-foreground'>Basic information of the teacher</span>
          </div>
          </TabsTrigger>
        <TabsTrigger value="workload" className='!text-xl !bg-card w-ful flex gap-0 items-center '>
          <div className='flex flex-col items-start'>
            <span className='font-medium text-base'>Workload</span>
            <span className='text-sm text-muted-foreground'>Basic information of the teacher</span>
          </div>
          </TabsTrigger>
      </TabsList>
      <div className='!w-full'>
      <TabsContent value="account" >
        <div className='!w-full space-y-4'>
          <Card className='shadow-none '>
          <CardHeader>
            <CardTitle>Account Detail</CardTitle>
            <CardDescription>Here some basic information about you</CardDescription>
            <CardAction>Card Action</CardAction>
          </CardHeader>
          <CardContent className='space-y-3'>
              <Input value={profileInfo.name} readOnly />
          <Input value={profileInfo.email ?? 'No email found'} readOnly />
          <div className='mt-5'>
            <CardTitle>Subjects</CardTitle>
            <div className='mt-2 pl-3 flex gap-4'>
              <Badge className='text-sm'><span className='font-bold'>MATH-01</span> General Mathematics </Badge>
              <Badge className='text-sm'><span className='font-bold'>MATH-01</span> General Mathematics </Badge>
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
        </TabsContent>
      <TabsContent value="password">
          <pre>
        {JSON.stringify(teachingAnalytics, null, 2)}

          </pre>
      </TabsContent>
      <TabsContent value="workload">
          <pre>
        {JSON.stringify(workloadMetrics, null, 2)}

          </pre>
      </TabsContent>
      </div>
      </div>
    </Tabs>
    </div>
    </div>
  )
}

export default ProfileTab