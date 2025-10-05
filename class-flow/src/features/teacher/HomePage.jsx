import React,{useState, useEffect} from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Header from './components/Header'
import useTeacherInfoGetter from './hooks/useTeacherInfo'
import Title from './components/Title'
import TimetableTab from './components/TimetableTab'
import ScheduleTab from './components/ScheduleTab/ScheduleTab'
import ProfileTab from './components/ProfileTab'
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
  const {data, isLoading} = useTeacherInfoGetter()
const [progress, setProgress] = useState(0);
const [activeTab, setActiveTab] = useState();

const [profileInfo, setProfileInfo] = useState()
const [currentWeek, setCurrentWeek] = useState()
const [workloadMetrics, setWorkloadMetrics] = useState()
const [weeklySchedule, setWeeklySchedule] = useState()
const [teachingAnalytics, setTeachingAnalytics] = useState()


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
   const { teacher_info, current_week, workload_metrics, weekly_schedule, teaching_analytics} = data
   setProfileInfo(teacher_info)
   setCurrentWeek(current_week)
   setWorkloadMetrics(workload_metrics)
   setWeeklySchedule(weekly_schedule)
   setTeachingAnalytics(teaching_analytics)
  }

}, [data, isLoading])




  return (
    <div className='w-full h-full  '>
        
        <div className='min-h-screen  dark:bg-neutral-900'>
            <Tabs value={activeTab} onValueChange={setActiveTab} defaultValue="schedule" >
              <Header/>
              <Title progress={progress} tabItems={tabItems} />
              <div className='h-full container mx-auto mt-5  sm:p-0   p-5 '>
              <TabsContent value='schedule'>
                < ScheduleTab teachingAnalytics={teachingAnalytics} weeklySchedule={weeklySchedule} setActiveTab={setActiveTab}/>
              </TabsContent>
              <TabsContent value='timetable'>
                <TimetableTab/>
              </TabsContent>
              <TabsContent value='profile'>
                  <ProfileTab  profileInfo={profileInfo} workloadMetrics={workloadMetrics} teachingAnalytics={teachingAnalytics}/>
              </TabsContent>
              </div>
            </Tabs>
        </div>
      
      
    </div>
  )
}

export default TeacherView
