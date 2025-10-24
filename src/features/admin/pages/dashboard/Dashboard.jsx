import React, { useState, useEffect, lazy, Suspense  } from "react";

import { useAuth } from "@/app/context/authContext";
import useDashboardDataGetter from "./hooks/useDashboardDataGetter";
import useGeneratedScheduleGetter from "@/lib/hooks/useGeneratedSchedules";
import LoadingCard from "@/components/LoadingCard/loadingCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
const DashboardContent = lazy(() => import('./components/DashboardContent'));
const Availability = lazy(() => import('./components/Availability'));
const Analytics = lazy(() => import('./components/Analytics'));
import { BarLoader } from "react-spinners";

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

function Dashboard() {



  const {teacherData} = useAuth()
  const [name, setName] = useState('')

  const [dayName, setDayName] = useState("");
  const [summary, setSummary] = useState([]);
  const [classesToday, setClassesToday] = useState([]);
  const [activeGeneratedSchedule, setActiveGeneratedSchedule] = useState(null);
  

  const {
    data: generatedSchedules,
    isLoading: generatedScheduleIsLoading,
  } = useGeneratedScheduleGetter();

  const {
    data: dashboardData,
    isLoading: dashboardDataIsLoading,
  } = useDashboardDataGetter(activeGeneratedSchedule?.id);

  // 🗓 Determine today's day
  useEffect(() => {
    const today = new Date();
    setDayName(days[today.getDay()]);
  }, []);

  // 🧩 Find active schedule when schedules are loaded
  useEffect(() => {
    if (!generatedScheduleIsLoading && generatedSchedules?.length) {
      const active = generatedSchedules.find((e) => e.is_active);
      setActiveGeneratedSchedule(active || null);
    }
  }, [generatedScheduleIsLoading, generatedSchedules]);

  // 📊 Update dashboard data when fetched
  useEffect(() => {
    if (dashboardData && !dashboardDataIsLoading) {
      setSummary(dashboardData.summary || {});
      setClassesToday(dashboardData.teacher_availability || []);
    }
  }, [dashboardData, dashboardDataIsLoading]);

  useEffect(() => {
    if(teacherData) {
      setName(teacherData.first_name)
    }
  }, [teacherData])

  

  console.log("dashboard", dashboardData);

  if (dashboardDataIsLoading || generatedScheduleIsLoading) {
    return (
      <div className="absolute top-[45px] left-0 right-0">
        <BarLoader loading={true} color="#D3D3D3" className="!w-full" />
      </div>
    );
  }

 


  return (
    <div className="p-5 mx-auto">
      {!generatedScheduleIsLoading && <Tabs defaultValue="dashboard">
        <div className="flex items-center justify-end">
          <TabsList className="p-0 shadow-none border rounded-sm bg-transparent w-[500px]">
            <TabsTrigger
              value="dashboard"
              className="cursor-pointer data-[state=active]:bg-muted !shadow-none h-full w-[100px] !rounded-bl-sm !rounded-tl-sm rounded-none"
            >
              Dashboard
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="cursor-pointer data-[state=active]:bg-muted !shadow-none !h-full !w-[100px] border-l-muted border-r-accent border-r-2 rounded-none"
              disabled={!dashboardData}
            >
              Analytics
            </TabsTrigger>
            <TabsTrigger
              value="availability"
              className="cursor-pointer data-[state=active]:bg-muted !shadow-none h-full w-[100px] !rounded-br-sm !rounded-tr-sm rounded-none"
                disabled={!dashboardData}
            >
              Availability
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="h-full">
         <TabsContent value="dashboard">
           {name && 
              <Suspense fallback={
                   <LoadingCard variant='database' />
              }>
                <DashboardContent name={name} dashboardData={dashboardData} allGeneratedSchedule={generatedSchedules} />
              </Suspense>
            }
            
              
          </TabsContent>


          <TabsContent value="analytics">
            <Analytics
              id={activeGeneratedSchedule?.id}
              summary={summary}
              isLoading={dashboardDataIsLoading}
            />
          </TabsContent>

          <TabsContent value="availability">
            <Availability classesToday={classesToday} dayName={dayName} days={days} />
          </TabsContent>
        </div>
      </Tabs>}
    </div>
  );
}

export default Dashboard;
