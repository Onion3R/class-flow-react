import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from './components/Header';
import Title from './components/Title';
import useProfileInfoGetter from './hooks/useProfileInfo';
// Lazy-loaded tabs
const TimetableTab = lazy(() => import('./components/TimetableTab/components/TimetableTab'));
const ScheduleTab = lazy(() => import('./components/ScheduleTab/ScheduleTab'));
const ProfileTab = lazy(() => import('./components/ProfileTab/ProfileTab'));

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
  const {data, isLoading} = useProfileInfoGetter()
const [progress, setProgress] = useState(0);
const [activeTab, setActiveTab] = useState('schedule');

const [profileInfo, setProfileInfo] = useState()
const [id, setId] = useState()
const [currentWeek, setCurrentWeek] = useState()
const [workloadMetrics, setWorkloadMetrics] = useState()
const [weeklySchedule, setWeeklySchedule] = useState()
const [teachingAnalytics, setTeachingAnalytics] = useState()


const [timetableFilters, setTimetableFilters] = useState()


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
   const id = data.id
   console.log('filters',timeTableFilters)
   const { teacher_info, current_week, workload_metrics, weekly_schedule, teaching_analytics} = dashboardData
   setProfileInfo(teacher_info)
   setCurrentWeek(current_week)
   setWorkloadMetrics(workload_metrics)
   setWeeklySchedule(weekly_schedule)
   setTeachingAnalytics(teaching_analytics)
   

   setTimetableFilters(timeTableFilters)

   setId(id)
   console.log('this is the id',id)
  }

}, [data, isLoading])




  return (
    <div className='w-full h-full  '>
        
        <div className='min-h-screen  dark:bg-neutral-900'>
            <Tabs value={activeTab} onValueChange={setActiveTab}  >
              <Header/>
              <Title progress={progress} tabItems={tabItems} />
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
                  id={id}
                  timetableFilters={timetableFilters} />
                </Suspense>
              </TabsContent>

              <TabsContent value='profile'>
                <Suspense fallback={<div>Loading Profile...</div>}>
                  <ProfileTab
                    profileInfo={profileInfo}
                    workloadMetrics={workloadMetrics}
                    teachingAnalytics={teachingAnalytics}
                  />
                </Suspense>
              </TabsContent>
              </div>
            </Tabs>
        </div>
      
      
    </div>
  )
}

export default TeacherView
