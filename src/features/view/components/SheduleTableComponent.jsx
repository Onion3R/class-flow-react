import React, { useState, useEffect, useMemo } from 'react';
import { getFilteredScheduleById } from '@/app/services/apiService';
import { PulseLoader } from 'react-spinners';
// Assuming these are available from a component library like shadcn/ui
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
// const Table = ({ children }) => <table className="min-w-full text-left border-collapse">{children}</table>;
// const TableBody = ({ children }) => <tbody>{children}</tbody>;
// const TableCell = ({ children, className, colSpan, rowSpan }) => <td colSpan={colSpan} rowSpan={rowSpan} className={`border  p-2 ${className}`}>{children}</td>;
// const TableHead = ({ children, className, colSpan, rowSpan }) => <th colSpan={colSpan} rowSpan={rowSpan} className={`border  p-2 ${className}`}>{children}</th>;
// const TableHeader = ({ children }) => <thead >{children}</thead>;
// const TableRow = ({ children, className }) => <tr className={`border-b  ${className}`}>{children}</tr>;

// Main App component
function PreviewScheduleTable({ scheduleId }) {
  const [allScheduleData, setAllScheduleData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [grade11Data, setGrade11Data] = useState(null);
  const [grade12Data, setGrade12Data] = useState(null);
  const [combinedTimeSlots, setCombinedTimeSlots] = useState([]);
  const [subjectColorMap, setSubjectColorMap] = useState({});

 const subjectColorPalettes = useMemo(() => ([
  {
    bg: 'bg-rose-100 dark:bg-rose-100',
    text: 'text-rose-800 dark:text-black/70',
  },
  {
    bg: 'bg-sky-100 dark:bg-sky-200/90',
    text: 'text-sky-800 dark:text-black/70',
  },
  {
    bg: 'bg-emerald-100 dark:bg-emerald-100/90',
    text: 'text-emerald-800 dark:text-black/70',
  },
  {
    bg: 'bg-purple-100 dark:bg-purple-100/90',
    text: 'text-purple-800 dark:text-black/70',
  },
  {
    bg: 'bg-yellow-100 dark:bg-yellow-200',
    text: 'text-yellow-800 dark:text-black/70',
  },
]), []);

  // Define special events to be included in the timetable
  const specialEvents = [
    { start_time: '07:15:00', end_time: '07:45:00', title: 'Flag Ceremony', type: 'special' },
    { start_time: '09:45:00', end_time: '10:00:00', title: 'Recess / Health Break', type: 'special' },
    { start_time: '12:00:00', end_time: '13:00:00', title: 'Lunch Break', type: 'special' },
  ];

  

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  // Effect to fetch data from the API
  useEffect(() => {
        const fetchData = async () => {
            if (scheduleId && scheduleId !== '') {
                setIsLoading(true);
                setError(null);
                setAllScheduleData(null);
                setGrade11Data(null);
                setGrade12Data(null);
                setCombinedTimeSlots([]);
                try {
                    const result = await getFilteredScheduleById(scheduleId);
                    const classes = result.classes;
                    setAllScheduleData(classes);
                    console.log(result)
                } catch (err) {
                    console.error('Failed to fetch schedule:', err);
                    setError('Failed to load schedule. Please check your network connection.');
                    setAllScheduleData(null);
                } finally {
                    setIsLoading(false);
                }
            }
        };
        fetchData();

    }, [scheduleId]);


  // Effect to process the fetched data and create the subject color map
  useEffect(() => {
    if (!allScheduleData || allScheduleData.length === 0) {
      setGrade11Data(null);
      setGrade12Data(null);
      setCombinedTimeSlots([]);
      return;
    }

    // Helper function to process data for a single grade level
    const processDataForGrade = (data, gradeLevel) => {
      const processed = {};
      const allTimeSlots = new Set();
      const allStrandSections = {};

      const gradeClasses = data.filter(item => item.year_level === gradeLevel);
      const combinedData = [...gradeClasses, ...specialEvents];

      combinedData.forEach(item => {
        allTimeSlots.add(item.start_time);

        if (item.type === 'special') return;

        if (!processed[item.strand_name]) {
          processed[item.strand_name] = {};
          allStrandSections[item.strand_name] = new Set();
        }
        allStrandSections[item.strand_name].add(item.section_name);

        if (!processed[item.strand_name][item.section_name]) {
          processed[item.strand_name][item.section_name] = {};
        }

        if (!processed[item.strand_name][item.section_name][item.start_time]) {
          processed[item.strand_name][item.section_name][item.start_time] = {};
        }

        const subjectKey = `${item.subject_title}-${item.teacher_name}`;
        if (!processed[item.strand_name][item.section_name][item.start_time][subjectKey]) {
          processed[item.strand_name][item.section_name][item.start_time][subjectKey] = {
            ...item,
            days: new Set([item.day_of_week])
          };
        } else {
          processed[item.strand_name][item.section_name][item.start_time][subjectKey].days.add(item.day_of_week);
        }
      });

      const sortedTimeSlots = Array.from(allTimeSlots).sort();
      const sortedStrands = Object.keys(allStrandSections).sort();
      const sortedStrandSections = {};
      sortedStrands.forEach(strand => {
        sortedStrandSections[strand] = Array.from(allStrandSections[strand]).sort();
      });

      return {
        timetablesByStrand: processed,
        timeSlots: sortedTimeSlots,
        strandSections: sortedStrandSections,
      };
    };

    const g11Data = processDataForGrade(allScheduleData, 11);
    const g12Data = processDataForGrade(allScheduleData, 12);

    const allTimes = new Set([...(g11Data?.timeSlots || []), ...(g12Data?.timeSlots || []), ...specialEvents.map(e => e.start_time)]);
    setCombinedTimeSlots(Array.from(allTimes).sort());

    setGrade11Data(g11Data);
    setGrade12Data(g12Data);

    // Create the subject color map
    const uniqueSubjects = new Set();
    allScheduleData.forEach(item => {
      uniqueSubjects.add(`${item.subject_title}-${item.teacher_name}`);
    });

    const newColorMap = {};
    let colorIndex = 0;
    uniqueSubjects.forEach(subjectKey => {
      newColorMap[subjectKey] = subjectColorPalettes[colorIndex];
      colorIndex = (colorIndex + 1) % subjectColorPalettes.length;
    });
    setSubjectColorMap(newColorMap);

  }, [allScheduleData, subjectColorPalettes]);

  const formatTime = (time) => {
    if (!time || time === '00:00:00') return 'N/A';
    const [h, m] = time.split(':');
    const hour = parseInt(h);
    const suffix = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
    return `${formattedHour}:${m} ${suffix}`;
  };

  const getDayAbbreviation = (day) => {
    const abbrMap = {
      "Monday": "M",
      "Tuesday": "T",
      "Wednesday": "W",
      "Thursday": "Th",
      "Friday": "F",
      "Saturday": "S",
      "Sunday": "Su",
    };
    return abbrMap[day] || day;
  };

  if (isLoading) {
     return (
            <div className='p-4 items-center justify-center flex border rounded'>
                <span className='text-foreground/40 text-sm mr-2'>Loading schedule</span>
                <PulseLoader size={4} loading={true} color='#ffffff' />
            </div>
        );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen p-4">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }

  if (!grade11Data && !grade12Data) {
    return (
      <div className="flex items-center justify-center h-screen p-4">
        <p className="text-gray-500 text-lg">No schedule data available.</p>
      </div>
    );
  }

  const getSectionsCountForGrade = (gradeData) => {
    return Object.values(gradeData.strandSections).flatMap(sections => sections).length;
  };

  const grade11SectionsCount = grade11Data ? getSectionsCountForGrade(grade11Data) : 0;
  const grade12SectionsCount = grade12Data ? getSectionsCountForGrade(grade12Data) : 0;
  const allSectionsCount = grade11SectionsCount + grade12SectionsCount;

  const totalCols = allSectionsCount * daysOfWeek.length;

  if (allSectionsCount === 0) {
    return (
      <div className="flex items-center justify-center h-screen p-4">
        <p className="text-gray-500 text-lg">No schedule data available.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col  dark:text-white  items-center p-4">
      <div className="rounded-xl  overflow-hidden w-full border ">
        <div className="overflow-x-auto">
          <Table className="min-w-full">
            <TableHeader>
            <TableRow>
                {/* Time column */}
                <TableHead rowSpan={4} className="text-center font-semibold border-r ">
                  Time
                </TableHead>

                {/* Grade 11 strand-section headers */}
                {grade11Data &&
                  Object.entries(grade11Data.strandSections).flatMap(([strandName, sections]) =>
                    sections.map(sectionName => (
                      <TableHead
                        key={`g11-${strandName}-${sectionName}`}
                        colSpan={daysOfWeek.length}
                        className="text-center text-sm font-bold  border-b-2 "
                      >
                        Grade 11 - {strandName} - {sectionName}
                      </TableHead>
                    ))
                  )}

                {/* Grade 12 strand-section headers */} 
                {grade12Data &&
                  Object.entries(grade12Data.strandSections).flatMap(([strandName, sections]) =>
                    sections.map(sectionName => (
                      <TableHead
                        key={`g12-${strandName}-${sectionName}`}
                        colSpan={daysOfWeek.length}
                        className="text-center text-sm font-bold  border-b-2 "
                      >
                        Grade 12 - {strandName} - {sectionName}
                      </TableHead>
                    ))
                  )}
              </TableRow>           
              <TableRow>
                {grade11Data && Object.values(grade11Data.strandSections).flatMap(sections => sections).map(sectionName => (
                  daysOfWeek.map(day => (
                    <TableHead key={`g11-day-${sectionName}-${day}`} className="text-center text-xs font-semibold uppercase  border-l border-r ">{getDayAbbreviation(day)}</TableHead>
                  ))
                ))}
                {grade12Data && Object.values(grade12Data.strandSections).flatMap(sections => sections).map(sectionName => (
                  daysOfWeek.map(day => (
                    <TableHead key={`g12-day-${sectionName}-${day}`} className="text-center text-xs font-semibold uppercase border-r border-gray-20">{getDayAbbreviation(day)}</TableHead>
                  ))
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {combinedTimeSlots.map(time => {
                const specialEvent = specialEvents.find(e => e.start_time === time);
                
                if (specialEvent) {
                  return (
                    <TableRow key={time} className=" !min-h-none bg-accent">
                      <TableCell className="font-medium text-center border-r ">
                        <p className="text-xs  font-semibold">{formatTime(specialEvent.start_time)}</p>
                        <p className="text-[10px]">to {formatTime(specialEvent.end_time)}</p>
                      </TableCell>
                      <TableCell colSpan={totalCols} >
                          <div className="text-center font-bold text-sm  w-full h-full flex items-center justify-center">
                            {specialEvent.title}
                          </div>
                      </TableCell>
                    </TableRow>
                  );
                }

                return (
                  <TableRow key={time} className=''>
                    <TableCell className="font-medium text-center border-r ">
                      <p className="text-xs font-semibold">{formatTime(time)}</p>
                      <p className="text-[10px]">
                        to {formatTime(allScheduleData?.find(c => c.start_time === time)?.end_time || '00:00:00')}
                      </p>
                    </TableCell>
                    {grade11Data && Object.values(grade11Data.strandSections).flatMap(sections => sections).map(sectionName => {
                      const strandName = Object.keys(grade11Data.strandSections).find(s => grade11Data.strandSections[s].includes(sectionName));
                      
                      return daysOfWeek.map(day => {
                        const subjectsForCell = grade11Data.timetablesByStrand[strandName]?.[sectionName]?.[time] || {};
                        const classesList = Object.values(subjectsForCell);
                        const classForDay = classesList.find(cls => cls.days.has(day));
                        
                        const subjectKey = classForDay ? `${classForDay.subject_title}-${classForDay.teacher_name}` : null;
                        const colors = subjectColorMap[subjectKey] || { bg: 'bg-gray-100', text: '' };

                        return (
                          <TableCell key={`g11-${sectionName}-${time}-${day}`} className="align-top border-l border-r  p-1 text-xs h-full">
                            {classForDay ? (
                            <div className="flex flex-col w-full h-[65px]">
                             <div className={`flex flex-col flex-1 p-2 rounded ${colors.bg} ${colors.text} shadow-sm transition-transform transform hover:scale-105 justify-center items-center text-center `}>
                                <div className='flex'>
                                  <p className="font-bold leading-tight text-[11px]   break-words whitespace-normal">{classForDay.subject_title}  <span className={`text-xs `}>({classForDay.subject_code})</span> </p>
                                 
                                  </div>
                                  <p className={`text-xs `}>{classForDay.teacher_name}</p>
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-center justify-center h-full min-h-[80px]">
                                <span className="text-gray-400">-</span>
                              </div>
                            )}
                          </TableCell>
                        );
                      });
                    })}
                    {grade12Data && Object.values(grade12Data.strandSections).flatMap(sections => sections).map(sectionName => {
                      const strandName = Object.keys(grade12Data.strandSections).find(s => grade12Data.strandSections[s].includes(sectionName));
                      
                      return daysOfWeek.map(day => {
                        const subjectsForCell = grade12Data.timetablesByStrand[strandName]?.[sectionName]?.[time] || {};
                        const classesList = Object.values(subjectsForCell);
                        const classForDay = classesList.find(cls => cls.days.has(day));
                        
                        const subjectKey = classForDay ? `${classForDay.subject_title}-${classForDay.teacher_name}` : null;
                        const colors = subjectColorMap[subjectKey] || { bg: 'bg-gray-100', text: 'text-gray-800' };

                        return (
                          <TableCell key={`g12-${sectionName}-${time}-${day} `} className="align-top border-l border-r  p-1 text-xs h-full">
                            {classForDay ? (
                                <div className="flex flex-col w-full h-[65px]">
                                    <div className={`flex flex-col flex-1 p-2 rounded ${colors.bg} ${colors.text} shadow-sm transition-transform transform hover:scale-105 justify-center items-center text-center `}>
                                <div className='flex'>
                                  <p className="font-bold leading-tight text-[11px]   break-words whitespace-normal">{classForDay.subject_title}  <span className={`text-xs ${colors.text}`}>({classForDay.subject_code})</span> </p>
                                 
                                  </div>
                                   <p className={`text-xs `}>Teacher: you</p>
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-center justify-center h-full min-h-[80px]">
                                <span className="text-gray-400">-</span>
                              </div>
                            )}
                          </TableCell>
                        );
                      });
                    })}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}


export default PreviewScheduleTable
