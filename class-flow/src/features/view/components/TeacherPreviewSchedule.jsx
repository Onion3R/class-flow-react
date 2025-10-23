// import React, { useState, useEffect, useMemo } from 'react';

// import { getTeacherSchedule } from '@/features/teacher/service/teacherService';
// import { PulseLoader } from 'react-spinners';
// // Assuming these are available from a component library like shadcn/ui
// import {
//   Table,
//   TableBody,
//   TableCaption,
//   TableCell,
//   TableFooter,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table"


// const flattenScheduleData = (timeBlocks) => {
//   const flattenedSchedule = [];

//   timeBlocks.forEach((timeBlockEntry) => {
//     const { time_block, classes: dailyClasses } = timeBlockEntry;
//     const start_time = time_block.start_time.includes(":")
//       ? time_block.start_time + (time_block.start_time.length === 5 ? ":00" : "")
//       : time_block.start_time;
//     const end_time = time_block.end_time.includes(":")
//       ? time_block.end_time + (time_block.end_time.length === 5 ? ":00" : "")
//       : time_block.end_time;

//     // Loop through days (Monday–Friday)
//     Object.keys(dailyClasses).forEach((day) => {
//       const classInfo = dailyClasses[day];

//       if (classInfo && classInfo.type === "scheduled_class") {
//         const flatClass = {
//           id: classInfo.id,
//           day_of_week: classInfo.day || day,
//           start_time: classInfo.start_time || start_time,
//           end_time: classInfo.end_time || end_time,
//           year_level: parseInt(classInfo.section?.year_level?.replace("Grade ", ""), 10),
//           strand_name: classInfo.section?.strand || "N/A",
//           section_name: classInfo.section?.name || "N/A",
//           subject_code: classInfo.subject?.code || "N/A",
//           subject_title: classInfo.subject?.title || "N/A",
//           teacher_name: classInfo.teacher?.name || "N/A",
//           type: classInfo.type,
//           room: classInfo.room || "N/A",
//         };

//         flattenedSchedule.push(flatClass);
//       }
//     });
//   });

//   console.log("Flattened schedule:", flattenedSchedule);
//   console.table(flattenedSchedule.slice(0, 10));
//   return flattenedSchedule;
// };

// // Main App component
// function DayTableComponent({ teacherId, filters, scheduleId }) {
//   const [allScheduleData, setAllScheduleData] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const [grade11Data, setGrade11Data] = useState(null);
//   const [grade12Data, setGrade12Data] = useState(null);
//   const [combinedTimeSlots, setCombinedTimeSlots] = useState([]);
//   const [subjectColorMap, setSubjectColorMap] = useState({});

//  const subjectColorPalettes = useMemo(() => ([
//   {
//     bg: 'bg-rose-100 dark:bg-rose-100',
//     text: 'text-rose-800 dark:text-black/70',
//   },
//   {
//     bg: 'bg-sky-100 dark:bg-sky-200/90',
//     text: 'text-sky-800 dark:text-black/70',
//   },
//   {
//     bg: 'bg-emerald-100 dark:bg-emerald-100/90',
//     text: 'text-emerald-800 dark:text-black/70',
//   },
//   {
//     bg: 'bg-purple-100 dark:bg-purple-100/90',
//     text: 'text-purple-800 dark:text-black/70',
//   },
//   {
//     bg: 'bg-yellow-100 dark:bg-yellow-200',
//     text: 'text-yellow-800 dark:text-black/70',
//   },
// ]), []);

//   // Define special events to be included in the timetable
//   const specialEvents = [
//     { start_time: '07:15:00', end_time: '07:45:00', title: 'Flag Ceremony', type: 'special' },
//     { start_time: '09:45:00', end_time: '10:00:00', title: 'Recess / Health Break', type: 'special' },
//     { start_time: '12:00:00', end_time: '13:00:00', title: 'Lunch Break', type: 'special' },
//   ];

//   const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

//   // Effect to fetch data from the API
//   useEffect(() => {
//         const fetchData = async () => {
//             if (scheduleId && scheduleId !== '') {
//                 setIsLoading(true);
//                 setError(null);
//                 setAllScheduleData(null);
//                 setGrade11Data(null);
//                 setGrade12Data(null);
//                 setCombinedTimeSlots([]);
//                 try {
//                     const result = await getTeacherSchedule(teacherId, filters, scheduleId);
//                                         const timeBlocks = result.timetable_grid || [];
//                    const classes = flattenScheduleData(timeBlocks)
//                     setAllScheduleData(classes);
//                     console.log(classes)
//                 } catch (err) {
//                     console.error('Failed to fetch schedule:', err);
//                     setError('Failed to load schedule. Please check your network connection.');
//                     setAllScheduleData(null);
//                 } finally {
//                     setIsLoading(false);
//                 }
//             }
//         };
//         fetchData();

//     }, [scheduleId]);


//   // Effect to process the fetched data and create the subject color map
//   useEffect(() => {
//     if (!allScheduleData || allScheduleData.length === 0) {
//       setGrade11Data(null);
//       setGrade12Data(null);
//       setCombinedTimeSlots([]);
//       return;
//     }

//     // Helper function to process data for a single grade level
//     const processDataForGrade = (data, gradeLevel) => {
//       const processed = {};
//       const allTimeSlots = new Set();
//       const allStrandSections = {};

//       const gradeClasses = data.filter(item => item.year_level === gradeLevel);
//       const combinedData = [...gradeClasses, ...specialEvents];

//       combinedData.forEach(item => {
//         allTimeSlots.add(item.start_time);

//         if (item.type === 'special') return;

//         if (!processed[item.strand_name]) {
//           processed[item.strand_name] = {};
//           allStrandSections[item.strand_name] = new Set();
//         }
//         allStrandSections[item.strand_name].add(item.section_name);

//         if (!processed[item.strand_name][item.section_name]) {
//           processed[item.strand_name][item.section_name] = {};
//         }

//         if (!processed[item.strand_name][item.section_name][item.start_time]) {
//           processed[item.strand_name][item.section_name][item.start_time] = {};
//         }

//         const subjectKey = `${item.subject_title}-${item.teacher_name}`;
//         if (!processed[item.strand_name][item.section_name][item.start_time][subjectKey]) {
//           processed[item.strand_name][item.section_name][item.start_time][subjectKey] = {
//             ...item,
//             days: new Set([item.day_of_week])
//           };
//         } else {
//           processed[item.strand_name][item.section_name][item.start_time][subjectKey].days.add(item.day_of_week);
//         }
//       });

//       const sortedTimeSlots = Array.from(allTimeSlots).sort();
//       const sortedStrands = Object.keys(allStrandSections).sort();
//       const sortedStrandSections = {};
//       sortedStrands.forEach(strand => {
//         sortedStrandSections[strand] = Array.from(allStrandSections[strand]).sort();
//       });

//       return {
//         timetablesByStrand: processed,
//         timeSlots: sortedTimeSlots,
//         strandSections: sortedStrandSections,
//       };
//     };

//     const g11Data = processDataForGrade(allScheduleData, 11);
//     const g12Data = processDataForGrade(allScheduleData, 12);

//     const allTimes = new Set([...(g11Data?.timeSlots || []), ...(g12Data?.timeSlots || []), ...specialEvents.map(e => e.start_time)]);
//     setCombinedTimeSlots(Array.from(allTimes).sort());

//     setGrade11Data(g11Data);
//     setGrade12Data(g12Data);

//     // Create the subject color map
//     const uniqueSubjects = new Set();
//     allScheduleData.forEach(item => {
//       uniqueSubjects.add(`${item.subject_title}-${item.teacher_name}`);
//     });

//     const newColorMap = {};
//     let colorIndex = 0;
//     uniqueSubjects.forEach(subjectKey => {
//       newColorMap[subjectKey] = subjectColorPalettes[colorIndex];
//       colorIndex = (colorIndex + 1) % subjectColorPalettes.length;
//     });
//     setSubjectColorMap(newColorMap);

//   }, [allScheduleData, subjectColorPalettes]);

//   const formatTime = (time) => {
//     if (!time || time === '00:00:00') return 'N/A';
//     const [h, m] = time.split(':');
//     const hour = parseInt(h);
//     const suffix = hour >= 12 ? 'PM' : 'AM';
//     const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
//     return `${formattedHour}:${m} ${suffix}`;
//   };

//   const getDayAbbreviation = (day) => {
//     const abbrMap = {
//       "Monday": "M",
//       "Tuesday": "T",
//       "Wednesday": "W",
//       "Thursday": "Th",
//       "Friday": "F",
//       "Saturday": "S",
//       "Sunday": "Su",
//     };
//     return abbrMap[day] || day;
//   };

//   if (isLoading) {
//      return (
//             <div className='p-4 items-center justify-center flex border rounded'>
//                 <span className='text-foreground/40 text-sm mr-2'>Loading schedule</span>
//                 <PulseLoader size={4} loading={true} color='#ffffff' />
//             </div>
//         );
//   }

//   if (error) {
//     return (
//       <div className="flex items-center justify-center h-screen p-4">
//         <p className="text-red-500 text-lg">{error}</p>
//       </div>
//     );
//   }

//   if (!grade11Data && !grade12Data) {
//     return (
//       <div className="flex items-center justify-center h-screen p-4">
//         <p className="text-gray-500 text-lg">No schedule data available.</p>
//       </div>
//     );
//   }

//   const getSectionsCountForGrade = (gradeData) => {
//     return Object.values(gradeData.strandSections).flatMap(sections => sections).length;
//   };

//   const grade11SectionsCount = grade11Data ? getSectionsCountForGrade(grade11Data) : 0;
//   const grade12SectionsCount = grade12Data ? getSectionsCountForGrade(grade12Data) : 0;
//   const allSectionsCount = grade11SectionsCount + grade12SectionsCount;

//   const totalCols = allSectionsCount * daysOfWeek.length;

//   if (allSectionsCount === 0) {
//     return (
//       <div className="flex items-center justify-center h-screen p-4">
//         <p className="text-gray-500 text-lg">No schedule data available.</p>
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-col  dark:text-white  items-center p-4">
//       <div className="rounded-xl  overflow-hidden w-full border ">
//         <div className="overflow-x-auto">
//           <Table className="min-w-full">
//             <TableHeader>
//                 <TableRow>
//                 {/* Time column */}
//                 <TableHead rowSpan={4} className="text-center font-semibold border-r ">
//                   Time
//                 </TableHead>
              
//                 {/* Grade 11 strand-section headers */}
//                 {grade11Data &&
//                   Object.entries(grade11Data.strandSections).flatMap(([strandName, sections]) =>
//                     sections.map(sectionName => (
//                       <TableHead
//                         key={`g11-${strandName}-${sectionName}`}
//                         colSpan={daysOfWeek.length}
//                         className="text-center text-sm font-bold  border-b-2 "
//                       >
//                         Grade 11 - {strandName} - {sectionName}
//                       </TableHead>
//                     ))
//                   )}
              
//                 {/* Grade 12 strand-section headers */} 
//                 {grade12Data &&
//                   Object.entries(grade12Data.strandSections).flatMap(([strandName, sections]) =>
//                     sections.map(sectionName => (
//                       <TableHead
//                         key={`g12-${strandName}-${sectionName}`}
//                         colSpan={daysOfWeek.length}
//                         className="text-center text-sm font-bold  border-b-2 "
//                       >
//                         Grade 12 - {strandName} - {sectionName}
//                       </TableHead>
//                     ))
//                   )}
//               </TableRow>
//              <TableRow>
//               {grade11Data && Object.values(grade11Data.strandSections).flatMap(sections => sections).map(sectionName => (
//                 daysOfWeek.map(day => (
//                   <TableHead key={`g11-day-${sectionName}-${day}`} className="text-center text-xs font-semibold uppercase  border-l border-r ">{getDayAbbreviation(day)}</TableHead>
//                 ))
//               ))}
//               {grade12Data && Object.values(grade12Data.strandSections).flatMap(sections => sections).map(sectionName => (
//                 daysOfWeek.map(day => (
//                   <TableHead key={`g12-day-${sectionName}-${day}`} className="text-center text-xs font-semibold uppercase border-r border-gray-20">{getDayAbbreviation(day)}</TableHead>
//                 ))
//               ))}
//             </TableRow>
//             </TableHeader>
//             <TableBody>
//               {combinedTimeSlots.map(time => {
//                 const specialEvent = specialEvents.find(e => e.start_time === time);
                
//                 if (specialEvent) {
//                   return (
//                       <TableRow key={time} className=" !min-h-none bg-accent">
//                         <TableCell className="font-medium text-center border-r ">
//                           <p className="text-xs  font-semibold">{formatTime(specialEvent.start_time)}</p>
//                           <p className="text-[10px]">to {formatTime(specialEvent.end_time)}</p>
//                         </TableCell>
//                         <TableCell colSpan={totalCols} >
//                             <div className="text-center font-bold text-sm  w-full h-full flex items-center justify-center">
//                               {specialEvent.title}
//                             </div>
//                         </TableCell>
//                       </TableRow>
//                   );
//                 }

//                 return (
//                   <TableRow key={time} className=''>
//                     <TableCell className="font-medium text-center border-r ">
//                       <p className="text-xs font-semibold">{formatTime(time)}</p>
//                       <p className="text-[10px]">
//                         to {formatTime(allScheduleData?.find(c => c.start_time === time)?.end_time || '00:00:00')}
//                       </p>
//                     </TableCell>
//                     {grade11Data && Object.values(grade11Data.strandSections).flatMap(sections => sections).map(sectionName => {
//                       const strandName = Object.keys(grade11Data.strandSections).find(s => grade11Data.strandSections[s].includes(sectionName));
                      
//                       return daysOfWeek.map(day => {
//                         const subjectsForCell = grade11Data.timetablesByStrand[strandName]?.[sectionName]?.[time] || {};
//                         const classesList = Object.values(subjectsForCell);
//                         const classForDay = classesList.find(cls => cls.days.has(day));
                        
//                         const subjectKey = classForDay ? `${classForDay.subject_title}-${classForDay.teacher_name}` : null;
//                         const colors = subjectColorMap[subjectKey] || { bg: 'bg-gray-100', text: '' };

//                         return (
//                           <TableCell key={`g11-${sectionName}-${time}-${day}`} className="align-top border-l border-r  p-1 text-xs h-full">
//                             {classForDay ? (
//                             <div className="flex flex-col w-full h-[65px]">
//                               <div className={`flex flex-col flex-1 p-2 rounded ${colors.bg} ${colors.text} shadow-sm transition-transform transform hover:scale-105 justify-center items-center text-center `}>
//                                 <div className='flex'>
//                                   <p className="font-bold leading-tight text-[11px]   break-words whitespace-normal">{classForDay.subject_title}  <span className={`text-xs `}>({classForDay.subject_code})</span> </p>
                                  
//                                   </div>
//                                   <p className={`text-xs `}>Teacher: you</p>
//                                 </div>
//                               </div>
//                             ) : (
//                               <div className="flex items-center justify-center h-full min-h-[80px]">
//                                 <span className="text-gray-400">-</span>
//                               </div>
//                             )}
//                           </TableCell>
//                         );
//                       });
//                     })}
//                     {grade12Data && Object.values(grade12Data.strandSections).flatMap(sections => sections).map(sectionName => {
//                       const strandName = Object.keys(grade12Data.strandSections).find(s => grade12Data.strandSections[s].includes(sectionName));
                      
//                       return daysOfWeek.map(day => {
//                         const subjectsForCell = grade12Data.timetablesByStrand[strandName]?.[sectionName]?.[time] || {};
//                         const classesList = Object.values(subjectsForCell);
//                         const classForDay = classesList.find(cls => cls.days.has(day));
                        
//                         const subjectKey = classForDay ? `${classForDay.subject_title}-${classForDay.teacher_name}` : null;
//                         const colors = subjectColorMap[subjectKey] || { bg: 'bg-gray-100', text: 'text-gray-800' };

//                         return (
//                           <TableCell key={`g12-${sectionName}-${time}-${day} `} className="align-top border-l border-r  p-1 text-xs h-full">
//                             {classForDay ? (
//                                 <div className="flex flex-col w-full h-[65px]">
//                                     <div className={`flex flex-col flex-1 p-2 rounded ${colors.bg} ${colors.text} shadow-sm transition-transform transform hover:scale-105 justify-center items-center text-center `}>
//                                 <div className='flex'>
//                                   <p className="font-bold leading-tight text-[11px]   break-words whitespace-normal">{classForDay.subject_title}  <span className={`text-xs ${colors.text}`}>({classForDay.subject_code})</span> </p>
                                  
//                                   </div>
//                                    <p className={`text-xs `}>Teacher: you</p>
//                                 </div>
//                               </div>
//                             ) : (
//                               <div className="flex items-center justify-center h-full min-h-[80px]">
//                                 <span className="text-gray-400">-</span>
//                               </div>
//                             )}
//                           </TableCell>
//                         );
//                       });
//                     })}
//                   </TableRow>
//                 );
//               })}
//             </TableBody>
//           </Table>
//         </div>
//       </div>
//     </div>
//   );
// }


// export default DayTableComponent


import React, { useState, useEffect, useMemo } from 'react';
import { getTeacherSchedule } from '@/features/teacher/service/teacherService';
import { PulseLoader } from "react-spinners";

// Assuming these are available from a component library like shadcn/ui
const Table = ({ children }) => <table className="min-w-full text-left border-collapse">{children}</table>;
const TableBody = ({ children }) => <tbody>{children}</tbody>;
const TableCell = ({ children, className, colSpan, rowSpan }) => <td colSpan={colSpan} rowSpan={rowSpan} className={`border border-muted-foreground p-2 ${className}`}>{children}</td>;
const TableHead = ({ children, className, colSpan, rowSpan }) => <th colSpan={colSpan} rowSpan={rowSpan} className={`border border-muted-foreground p-2 ${className}`}>{children}</th>;
const TableHeader = ({ children }) => <thead >{children}</thead>;
const TableRow = ({ children, className }) => <tr className={`border-b border-muted-foreground ${className}`}>{children}</tr>;

let LOCAL_STORAGE_KEY = import.meta.env.VITE_SCHED_LOCAL_STORAGE_KEY

/**
 * Transforms the nested timetable_grid structure into a flat array of class objects
 * that matches the format the component was originally built to handle.
 * @param {Array} timetableGrid - The array of time blocks with nested classes.
 * @returns {Array} - A flattened array of class objects.
 */
const flattenTimetableGrid = (timetableGrid) => {
    if (!timetableGrid || timetableGrid.length === 0) return [];

    const flattened = [];
    const DAY_KEYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

    timetableGrid.forEach(block => {
        const blockStartTime = `${block.time_block.start_time}:00`;
        const blockEndTime = `${block.time_block.end_time}:00`;

        DAY_KEYS.forEach(day => {
            const classData = block.classes[day];

            // Only process scheduled classes, ignore 'free_period' or empty slots
            if (classData && classData.type === 'scheduled_class') {
                flattened.push({
                    id: classData.id,
                    subject_code: classData.subject.code,
                    subject_title: classData.subject.title,
                    // Note: Teacher name is not in the single class object in your example,
                    // but we'll include a placeholder as the component expects it.
                    // If the teacher_info is *not* available in the class object, you might need to adjust.
                    teacher_name: classData.teacher_info?.name || 'You',
                    year_level: parseInt(classData.section.year_level.replace('Grade ', '')), // Ensure it's a number (11 or 12)
                    strand_name: classData.section.strand,
                    section_name: classData.section_name,
                    day_of_week: classData.day, // e.g., "Monday"
                    start_time: blockStartTime,
                    end_time: blockEndTime,
                    room: classData.room,
                    type: classData.type,
                });
            }
        });
    });

    return flattened;
};


// Main App component
function TeacherPreviewSchedule({teacherId, filters ,  scheduleId }) {
    const [allScheduleData, setAllScheduleData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [grade11Data, setGrade11Data] = useState(null);
    const [grade12Data, setGrade12Data] = useState(null);
    const [combinedTimeSlots, setCombinedTimeSlots] = useState([]);

    // Define special events to be included in the timetable
    const specialEvents = [
        { start_time: '07:15:00', end_time: '07:45:00', title: 'Flag Ceremony', type: 'special' },
        { start_time: '09:45:00', end_time: '10:00:00', title: 'Recess / Health Break', type: 'special' },
        { start_time: '12:00:00', end_time: '13:00:00', title: 'Lunch Break', type: 'special' },
    ];
    
    // A set of vibrant color palettes to cycle through for subjects
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


    // Memoize the color assignment to ensure a consistent color for each subject
    const subjectColors = useMemo(() => {
        if (!allScheduleData) return {};
        const colors = {};
        const uniqueSubjects = [...new Set(allScheduleData.map(item => item.subject_code))];
        uniqueSubjects.forEach((subjectCode, index) => {
            colors[subjectCode] = subjectColorPalettes[index % subjectColorPalettes.length];
        });
        return colors;
    }, [allScheduleData, subjectColorPalettes]);


    // Effect to fetch data from the API and flatten it
    useEffect(() => {
        const fetchData = async () => {
            if (!teacherId) return; // don’t run until we have a teacher ID
            setIsLoading(true);
            setError(null);
            try {
            const result = await getTeacherSchedule(teacherId, filters || ' ' , scheduleId);
            const timetableGrid = result.timetable_grid || [];
            const classes = flattenTimetableGrid(timetableGrid);
            setAllScheduleData(classes);
            } catch (err) {
            localStorage.removeItem(LOCAL_STORAGE_KEY);
            console.error('Failed to fetch schedule:', err);
            setError('Failed to load schedule. Please check your network connection.');
            setAllScheduleData(null);
            } finally {
            setIsLoading(false);
            }
        };
        fetchData();
        }, [teacherId, scheduleId, filters]);



    // Effect to process the fetched data when it changes (THIS IS THE ORIGINAL LOGIC)
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

            // IMPORTANT: The original component assumed the API would filter data.
            // Since we flattened all data, we must filter by grade level here.
            const gradeClasses = data.filter(item => item.year_level === gradeLevel);
            const combinedData = [...gradeClasses, ...specialEvents];

            combinedData.forEach(item => {
                allTimeSlots.add(item.start_time);

                if (item.type === 'special') return;

                // Ensure all fields expected by the old logic exist.
                const strand = item.strand_name;
                const section = item.section_name;
                const time = item.start_time;

                if (!processed[strand]) {
                    processed[strand] = {};
                    allStrandSections[strand] = new Set();
                }
                allStrandSections[strand].add(section);

                if (!processed[strand][section]) {
                    processed[strand][section] = {};
                }

                if (!processed[strand][section][time]) {
                    processed[strand][section][time] = {};
                }

                const subjectKey = `${item.subject_code}-${item.teacher_name}`;
                if (!processed[strand][section][time][subjectKey]) {
                    processed[strand][section][time][subjectKey] = {
                        ...item,
                        days: new Set([item.day_of_week])
                    };
                } else {
                    processed[strand][section][time][subjectKey].days.add(item.day_of_week);
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

    }, [allScheduleData]); // Depend on the now-flattened data

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

    // Prevent rendering if there are no sections for either grade
    if (allSectionsCount === 0) {
        return (
            <div className="flex items-center justify-center h-screen p-4">
                <p className="text-gray-500 text-lg">No schedule data available.</p>
            </div>
        );
    }
    
    // Helper function to find the end time for a given start time slot.
    const getEndTimeForSlot = (startTime) => {
        const special = specialEvents.find(e => e.start_time === startTime);
        if (special) return special.end_time;

        const classItem = allScheduleData.find(c => c.start_time === startTime);
        return classItem?.end_time || '00:00:00';
    }


    return (
        <div className="flex flex-col items-center w-full  mx-auto  mt-4">
            <div className="rounded-xl overflow-hidden w-full border border-muted-foreground">
                <div className="overflow-x-auto">
                    <Table className="min-w-full ">
                        <TableHeader>
                            {/* Grade Level headers row */}
                            <TableRow>
                                <TableHead rowSpan={3} className="text-center font-semibold border-r border-muted-foreground">Time</TableHead>
                                {/* {grade11SectionsCount > 0 && (
                                    <TableHead colSpan={grade11SectionsCount} className="text-center font-bold text-base border-b-1 border-muted-foreground">
                                        Grade 11
                                    </TableHead>
                                )}
                                {grade12SectionsCount > 0 && (
                                    <TableHead colSpan={grade12SectionsCount} className="text-center font-bold text-base border-b-1 border-muted">
                                        Grade 12
                                    </TableHead>
                                )} */}
                            </TableRow>
                            {/* Strand headers row */}
                            <TableRow>
                                {/* Grade 11 Strands */}
                                {grade11Data && Object.keys(grade11Data.strandSections).map(strandName => (
                                    <TableHead key={`g11-strand-${strandName}`} colSpan={grade11Data.strandSections[strandName].length} className="text-center font-semibold text-xs border-b border-muted">{strandName}   ( Grade 11)</TableHead>
                                ))}
                                {/* Grade 12 Strands */}
                                {grade12Data && Object.keys(grade12Data.strandSections).map(strandName => (
                                    <TableHead key={`g12-strand-${strandName}`} colSpan={grade12Data.strandSections[strandName].length} className="text-center font-semibold text-xs border-b border-muted">{strandName}   (Grade 12)</TableHead>
                                ))}
                            </TableRow>
                            {/* Section headers row */}
                            <TableRow>
                                {/* Grade 11 Sections */}
                                {grade11Data && Object.values(grade11Data.strandSections).flatMap(sections => sections).map(sectionName => (
                                    <TableHead key={`g11-section-${sectionName}`} className="text-center font-semibold border-l border-r border-gray-200 text-xs">{sectionName}</TableHead>
                                ))}
                                {/* Grade 12 Sections */}
                                {grade12Data && Object.values(grade12Data.strandSections).flatMap(sections => sections).map(sectionName => (
                                    <TableHead key={`g12-section-${sectionName}`} className="text-center font-semibold border-l border-r border-gray-200 text-xs">{sectionName}</TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {combinedTimeSlots.map(time => {
                                const specialEvent = specialEvents.find(e => e.start_time === time);
                                const endTime = getEndTimeForSlot(time); // Use the new helper

                                // If it's a special event, render a single row that spans all columns
                                if (specialEvent) {
                                    return (
                                        <TableRow key={time}>
                                            <TableCell className="font-medium text-center border-r min-w-20 border-gray-300">
                                                <p className="text-xs font-semibold">{formatTime(specialEvent.start_time)}</p>
                                                <p className="text-[10px] text-gray-600">to {formatTime(specialEvent.end_time)}</p>
                                            </TableCell>
                                            <TableCell colSpan={allSectionsCount} className="text-center font-bold text-sm text-dark dark:text-white bg-muted">
                                                {specialEvent.title}
                                            </TableCell>
                                        </TableRow>
                                    );
                                }

                                // Otherwise, render the standard class schedule row
                                return (
                                    <TableRow key={time} className='!max-h-[50px] !h-10'>
                                        <TableCell className="font-medium text-center border-r border-gray-200 ">
                                            <p className="text-xs font-semibold">{formatTime(time)}</p>
                                            <p className="text-[10px] text-gray-500">
                                                to {formatTime(endTime)}
                                            </p>
                                        </TableCell>
                                        {/* Render Grade 11 schedule cells */}
                                        {grade11Data && Object.values(grade11Data.strandSections).flatMap(sections => sections).map(sectionName => {
                                            const strandName = Object.keys(grade11Data.strandSections).find(s => grade11Data.strandSections[s].includes(sectionName));
                                            const subjectsForCell = grade11Data.timetablesByStrand[strandName]?.[sectionName]?.[time] || {};
                                            const classesList = Object.values(subjectsForCell);

                                            return (
                                                <TableCell key={`g11-${sectionName}-${time}`} className="align-top border-l  border-r border-gray-200 p-2 text-xs">
                                                    {classesList.length > 0 ? (
                                                        <div className="flex flex-col space-y-2">
                                                            {classesList.map(cls => {
                                                                const { bg, text } = subjectColors[cls.subject_code] || { bg: 'bg-gray-100', text: 'text-gray-800' };
                                                                return (
                                                                    <div key={`${cls.subject_code}-${cls.teacher_name}`} className={`p-2 rounded ${bg} ${text} shadow-sm transition-transform transform hover:scale-105 `}>
                                                                        <p className="font-bold leading-tight !text-xs">{cls.subject_title} ({cls.subject_code})  <span className={`font-normal text-2xs mt-1`}>When: {Array.from(cls.days).map(getDayAbbreviation).join(', ')}</span></p>
                                                                       
                                                                        {/* <p className={`text-2xs`}>Teacher: {cls.teacher_name}</p> */}
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center justify-center h-full min-h-[50px]">
                                                            <span className="text-gray-400">-</span>
                                                        </div>
                                                    )}
                                                </TableCell>
                                            );
                                        })}
                                        {/* Render Grade 12 schedule cells */}
                                        {grade12Data && Object.values(grade12Data.strandSections).flatMap(sections => sections).map(sectionName => {
                                            const strandName = Object.keys(grade12Data.strandSections).find(s => grade12Data.strandSections[s].includes(sectionName));
                                            const subjectsForCell = grade12Data.timetablesByStrand[strandName]?.[sectionName]?.[time] || {};
                                            const classesList = Object.values(subjectsForCell);

                                            return (
                                                <TableCell key={`g12-${sectionName}-${time}`} className="align-top border-l border-r p-2 text-xs">
                                                    {classesList.length > 0 ? (
                                                        <div className="flex flex-col space-y-2">
                                                            {classesList.map(cls => {
                                                                const { bg, text } = subjectColors[cls.subject_code] || { bg: 'bg-gray-100', text: 'text-gray-800' };
                                                                return (
                                                                    <div key={`${cls.subject_code}-${cls.teacher_name}`} className={`p-2 rounded ${bg} ${text} shadow-sm transition-transform transform hover:scale-105`}>
                                                                        <p className="font-bold leading-tight">{cls.subject_title} ({cls.subject_code}) <span className={`text-2xs mt-1 font-normal`}>When: {Array.from(cls.days).map(getDayAbbreviation).join(', ')}</span></p>
                                                                        
                                                                        {/* <p className={`text-2xs`}>Teacher: {cls.teacher_name}</p> */}
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center justify-center h-full min-h-[50px]">
                                                            <span className="text-gray-400">-</span>
                                                        </div>
                                                    )}
                                                </TableCell>
                                            );
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

export default TeacherPreviewSchedule;
