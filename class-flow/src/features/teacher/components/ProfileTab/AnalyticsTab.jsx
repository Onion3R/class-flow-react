import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import SubjectPieChart from './PieChart';
import { AlarmClockCheck, Sun, BookOpen, Clock, Percent } from 'lucide-react';

function AnalyticsTab({ profileAnalytics }) {
  const [subjectAnalytics, setSubjectAnalytics] = useState([]);
  const [timeDistribution, setTimeDistribution] = useState(null);

  useEffect(() => {
    if (profileAnalytics) {
      setSubjectAnalytics(profileAnalytics.subject_analytics || []);
      setTimeDistribution(profileAnalytics.time_distribution || null);
    }
  }, [profileAnalytics]);

  const padNumber = (num) => num > 9 ? num : `0${num}`;

  return (
    <div className='relative min-w-0' >
      <Card className=" shadow-none">
        <CardHeader>
          <CardTitle>Analytics</CardTitle>
          <CardDescription>
            Weekly breakdown of class time and activity.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-5 h-full">
            {subjectAnalytics.map(e => (
              <div className="flex flex-col xl:flex-row items-center justify-center  gap-6 h-fit xl:h-50" key={e.subject_code}>
                <SubjectPieChart
                  label="Workload"
                  title={e.subject_code}
                  value={e.percentage_of_workload}
                  className="w-1/3"
                />
                <div className="border px-6 py-4 rounded-sm flex flex-col items-start justify-center xl:w-2/3  w-full ">
                  <h1 className="flex items-center gap-1">
                    <span className="font-bold text-base">{e.subject_code}:</span>
                    {e.subject_title}
                  </h1>
                  <div className="flex flex-col sm:flex-row justify-around  w-full gap-2" >
                    {[
                      { label: 'Sections Taught', value: e.sections_taught },
                      { label: 'Total classes', value: e.total_classes },
                      { label: 'Total minutes', value: e.total_minutes },
                    ].map((item, idx) => (
                      <div key={item.label} className="border w-full  rounded-sm lg:w-35 bg-secondary p-5 mt-3">
                        <h1 className="font-bold text-4xl">{padNumber(item.value)}</h1>
                        <p className="font-medium">{item.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <div className="flex  flex-col xl:flex-row items-start xl:items-center px-5 py-3 rounded bg-muted w-full">
              <div className="space-y-1">
                <CardTitle>Time distribution</CardTitle>
                <CardDescription>Here some basic information about you</CardDescription>
              </div>
              <div className="h-full flex flex-col 50 w-full lg:flex-row justify-around gap-4 ml-auto">
                {[
                  {
                    label: 'Busiest day',
                    value: timeDistribution?.busiest_day ?? 'None',
                    icon: <AlarmClockCheck size={30} />,
                  },
                  {
                    label: 'Lightest day',
                    value: timeDistribution?.lightest_day ?? 'None',
                    icon: <Sun size={30} />,
                  },
                ].map((item) => (
                  <div key={item.label} className="rounded-sm p-5 flex items-center gap-5">
                    <div>
                      <h1 className="font-bold text-4xl">{item.value}</h1>
                      <p className="font-medium">{item.label}</p>
                    </div>
                    <div className="h-15 flex items-center justify-center w-15 rounded-full bg-secondary">
                      {item.icon}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-5">
              {timeDistribution?.daily_breakdown &&
                Object.entries(timeDistribution.daily_breakdown).map(([day, data]) => (
                  <div key={day} className="rounded-xl p-6 border">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-bold text-gray-800 dark:text-white">{day}</h2>
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                        {data.percentage}% of week
                      </span>
                    </div>
                    <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-blue-500" />
                        <span>Classes: {data.classes}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-blue-500" />
                        <span>Minutes: {data.minutes}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Percent className="w-4 h-4 text-blue-500" />
                        <span>Percentage: {data.percentage}%</span>
                      </div>
                    </div>
                    <div className="mt-4 h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                      <div
                        className="h-full bg-blue-500 rounded-full transition-all duration-500"
                        style={{ width: `${data.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default AnalyticsTab;
