import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from './components/Header';
import Title from './components/Title';
import useGeneratedScheduleGetter from '@/lib/hooks/useGeneratedSchedules';

import useProfileInfoGetter from './hooks/useProfileInfo';
// Lazy-loaded tabs
const TimetableTab = lazy(() => import('./components/TimetableTab/components/TimetableTab'));

const ScheduleTab = lazy(() => import('./components/ScheduleTab/ScheduleTab'));
const ProfileTab = lazy(() => import('./components/ProfileTab/ProfileTab'));

const NoActiveSchedule = lazy(() => import('./components/NoActiveSchedule'));

const NoDataFetch = lazy(() => import('./components/NoDataFetch'));



const tabItems = [
  {
    key: "schedule",
    label: "Schedule",
  },
  {
    key: "timetable",
    label: "Timetable",
  },
  {
    key: "profile",
    label: "Profile",
  },
]



function TeacherView() {

  const {data: allGeneratedSchedules, loading: generatedSchedulesIsLoading} = useGeneratedScheduleGetter()
  const [activeSchedule, setActiveSchedule] = useState()

  const {data, isLoading, teacherData} = useProfileInfoGetter(activeSchedule?.id)
const [progress, setProgress] = useState(0);
const [activeTab, setActiveTab] = useState('schedule');

const [profileInfo, setProfileInfo] = useState()
const [teacherId, setTeacherId] = useState()
const [currentWeek, setCurrentWeek] = useState()

const [workloadMetrics, setWorkloadMetrics] = useState()
const [weeklySchedule, setWeeklySchedule] = useState()

// for profile tab
const [profileData, setProfileData] = useState()
const [analyticsData, setAnalyticsData] = useState()
const [teachingAnalytics, setTeachingAnalytics] = useState()



const [timetableFilters, setTimetableFilters] = useState()

useEffect(() => {
  if(!generatedSchedulesIsLoading && allGeneratedSchedules) {
    const active = allGeneratedSchedules.find(e => e.is_active)
    setActiveSchedule(active)
  }
}, [generatedSchedulesIsLoading, allGeneratedSchedules])

useEffect(() => {
  const interval = setInterval(() => {
    setProgress(prev => {
      if (prev >= 110) {
        clearInterval(interval);
        return 110;
      }
      return prev + 0.5; // You can adjust the step size here
    });
  }, 10); // Adjust speed here (20ms per step = ~2 seconds total)

  return () => clearInterval(interval);
}, []);

useEffect(() => {
  if(data && !isLoading) {
   const  dashboardData = data.teacherDashboardInfo
   const timeTableFilters = data.timeTableFilters
   const teacherId = data.id
   const { teacher_info, current_week, workload_metrics, weekly_schedule, teaching_analytics} = dashboardData
   setProfileInfo(teacher_info)
   setCurrentWeek(current_week)
   setWorkloadMetrics(workload_metrics)
   setWeeklySchedule(weekly_schedule)
   setTeachingAnalytics(teaching_analytics)
   

   setTimetableFilters(timeTableFilters)
   const profileData = data.profile
   const analyticsData = data.analytics

   setProfileData(profileData)
   setAnalyticsData(analyticsData)

   setTeacherId(teacherId)
  }

}, [data, isLoading])







  return (
    <div className='w-full h-full  '>
        
        <div className='min-h-screen  dark:bg-neutral-900'>
            <Tabs value={activeTab} onValueChange={setActiveTab}  >
              <Header />
              <Title progress={progress} tabItems={tabItems} active={activeSchedule} teacherData={teacherData} />
              { activeSchedule ?  
              (
                 data ? (
                <div className='h-full container mx-auto mt-5  mb-10 sm:p-0   p-5 '>
              <TabsContent value='schedule'>
                <Suspense fallback={<div>Loading Schedule...</div>}>
                  <ScheduleTab
                    teachingAnalytics={teachingAnalytics}
                    weeklySchedule={weeklySchedule}
                    setActiveTab={setActiveTab}
                  />
                </Suspense>
              </TabsContent>

              <TabsContent value='timetable'>
                <Suspense fallback={<div>Loading Timetable...</div>}>
                  <TimetableTab  
                  teacherId={teacherId}
                  activeSchedule={activeSchedule.id}
                  timetableFilters={timetableFilters} />
                </Suspense>
              </TabsContent>

              <TabsContent value='profile'>
                <Suspense fallback={<div>Loading Profile...</div>}>
                  <ProfileTab
                    analyticsData={analyticsData}
                    profileData={profileData}
                    teachingAnalytics={teachingAnalytics}
                  />
                </Suspense>
              </TabsContent>
              </div> 
              ) : (
                  <div className='h-full container mx-auto mt-5  mb-10 sm:p-0   p-5 '>
               <NoDataFetch />
              </div>
              )
              )
              
              :
              <div className='h-full container mx-auto mt-5  mb-10 sm:p-0   p-5 '>
               <NoActiveSchedule />
              </div>
              }
             
            </Tabs>
        </div>
      
      
    </div>
  )
}

export default TeacherView
