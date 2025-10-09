import React, {useState, useEffect} from 'react'
import AnalyticsTab from './AnalyticsTab';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ProfileInfoTab from './ProfileInfoTab';
import useProfileInfoGetter from '../../hooks/useProfileInfo';
import WorkloadTab from './WorkloadTab';
function ProfileTab({workloadMetrics, teachingAnalytics }) {
  const [profileData, setProfileData] = useState()
  const [profileAnalytics, setProfileAnalytics] = useState()
  const {data, isLoading } = useProfileInfoGetter()
 const tabItems = [
  {
    value: 'account',
    title: 'Account',
    description: 'Teacher profile and personal info',
  },
  {
    value: 'password',
    title: 'Analytics',
    description: 'Teaching activity and time stats',
  },
  {
    value: 'workload',
    title: 'Workload',
    description: 'Weekly subject load overview',
  },
];

 
 useEffect(() => {
   if(data && !isLoading) {
    setProfileData(data.profile)
    setProfileAnalytics(data.analytics)
   }
 }, [data, isLoading])


  return (
    <div className='flex items-center justify-center'>
    <div className='w-full lg:w-5/6  '>
    <Tabs defaultValue="account" >
      <div className='flex flex-col  md:flex-row gap-5 h-fit'>
      <TabsList className='flex  flex-row md:flex-col max-h-none min-h-none gap-2 h-fit bg-transparent  '>
        {tabItems.map(e => 
          <TabsTrigger value={e.value} className='!text-xl !bg-card w-full flex gap-0 items-center ' key={e.value}>
          <div className='flex flex-col w-full items-start'>
            <span className='font-medium text-base '>{e.title}</span>
            <span className='text-sm hidden md:block text-muted-foreground'>{e.description}</span>
          </div>
          </TabsTrigger>
         )}
        
      </TabsList>
      <div className='!w-full'>
      <TabsContent value="account" >
         <ProfileInfoTab profileData={profileData} />
        </TabsContent>
      <TabsContent value="password">
          <AnalyticsTab teachingAnalytics={teachingAnalytics}  profileAnalytics={profileAnalytics}/>
      </TabsContent>
      <TabsContent value="workload">
          <WorkloadTab profileAnalytics={profileAnalytics} />
      </TabsContent>
      </div>
      </div>
    </Tabs>
    </div>
    </div>
  )
}

export default ProfileTab