
// import React, { useState, useEffect } from 'react';
// import { PulseLoader } from "react-spinners";
// import { getFilteredScheduleById } from '@/services/apiService';
// // Assuming these are available from a component library like shadcn/ui
// const Table = ({ children }) => <table className="min-w-full text-left border-collapse">{children}</table>;
// const TableBody = ({ children }) => <tbody>{children}</tbody>;
// const TableCell = ({ children, className, colSpan, rowSpan }) => <td colSpan={colSpan} rowSpan={rowSpan} className={`border border-gray-200 p-2 ${className}`}>{children}</td>;
// const TableHead = ({ children, className, colSpan, rowSpan }) => <th colSpan={colSpan} rowSpan={rowSpan} className={`border border-gray-200 p-2 ${className}`}>{children}</th>;
// const TableHeader = ({ children }) => <thead >{children}</thead>;
// const TableRow = ({ children, className }) => <tr className={`border-b border-gray-200 ${className}`}>{children}</tr>;

// const fetchSchedule = async (scheduleId) => {
//   const result = await getFilteredScheduleById(scheduleId);
//   const data = result.classes
//   console.error("Warning: Using mock data. Please replace this function with your API call.");
//   return data;
// }


// // Main App component
// function App({ scheduleId = 39 }) {
//   const [allScheduleData, setAllScheduleData] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const [grade11Data, setGrade11Data] = useState(null);
//   const [grade12Data, setGrade12Data] = useState(null);
//   const [combinedTimeSlots, setCombinedTimeSlots] = useState([]);

//   // Define special events to be included in the timetable
//   const specialEvents = [
//     { start_time: '07:15:00', end_time: '07:45:00', title: 'Flag Ceremony', type: 'special' },
//     { start_time: '09:45:00', end_time: '10:00:00', title: 'Recess / Health Break', type: 'special' },
//     { start_time: '12:00:00', end_time: '13:00:00', title: 'Lunch Break', type: 'special' },
//   ];

//   // Effect to fetch data from the API
//   useEffect(() => {
//     const fetchData = async () => {
//       setIsLoading(true);
//       setError(null);
//       try {
//         const classes = await fetchSchedule(scheduleId); // This is still the mock function. Replace it.
//         setAllScheduleData(classes);
//       } catch (err) {
//         console.error('Failed to fetch schedule:', err);
//         setError('Failed to load schedule. Please check your network connection.');
//         setAllScheduleData(null);
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     fetchData();
//   }, [scheduleId]);


//   // Effect to process the fetched data when it changes
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

//         const subjectKey = `${item.subject_code}-${item.teacher_name}`;
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

//   }, [allScheduleData]);

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
//     return (
//       <div className="flex items-center justify-center h-screen p-4">
//         <PulseLoader color="#4A90E2" size={15} />
//         <p className="text-gray-500 text-lg ml-4">Loading schedule...</p>
//       </div>
//     );
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

//   // Prevent rendering if there are no sections for either grade
//   if (allSectionsCount === 0) {
//     return (
//       <div className="flex items-center justify-center h-screen p-4">
//         <p className="text-gray-500 text-lg">No schedule data available.</p>
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-col items-center p-4">
//       <div className="rounded-xl shadow-xl overflow-hidden w-full border border-gray-200">
//         <div className="overflow-x-auto">
//           <Table className="min-w-full">
//             <TableHeader>
//               {/* Grade Level headers row */}
//               <TableRow>
//                 <TableHead rowSpan={3} className="text-left font-semibold border-r border-gray-200">Time</TableHead>
//                 {grade11SectionsCount > 0 && (
//                   <TableHead colSpan={grade11SectionsCount} className="text-center font-bold text-lg border-b-2 border-gray-200">
//                     Grade 11
//                   </TableHead>
//                 )}
//                 {grade12SectionsCount > 0 && (
//                   <TableHead colSpan={grade12SectionsCount} className="text-center font-bold text-lg border-b-2 border-gray-200">
//                     Grade 12
//                   </TableHead>
//                 )}
//               </TableRow>
//               {/* Strand headers row */}
//               <TableRow>
//                 {/* Grade 11 Strands */}
//                 {grade11Data && Object.keys(grade11Data.strandSections).map(strandName => (
//                   <TableHead key={`g11-strand-${strandName}`} colSpan={grade11Data.strandSections[strandName].length} className="text-center font-semibold text-base border-b border-gray-200">{strandName}</TableHead>
//                 ))}
//                 {/* Grade 12 Strands */}
//                 {grade12Data && Object.keys(grade12Data.strandSections).map(strandName => (
//                   <TableHead key={`g12-strand-${strandName}`} colSpan={grade12Data.strandSections[strandName].length} className="text-center font-semibold text-base border-b border-gray-200">{strandName}</TableHead>
//                 ))}
//               </TableRow>
//               {/* Section headers row */}
//               <TableRow>
//                 {/* Grade 11 Sections */}
//                 {grade11Data && Object.values(grade11Data.strandSections).flatMap(sections => sections).map(sectionName => (
//                   <TableHead key={`g11-section-${sectionName}`} className="text-center font-semibold border-l border-r border-gray-200 text-sm">{sectionName}</TableHead>
//                 ))}
//                 {/* Grade 12 Sections */}
//                 {grade12Data && Object.values(grade12Data.strandSections).flatMap(sections => sections).map(sectionName => (
//                   <TableHead key={`g12-section-${sectionName}`} className="text-center font-semibold border-l border-r border-gray-200 text-sm">{sectionName}</TableHead>
//                 ))}
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {combinedTimeSlots.map(time => {
//                 const specialEvent = specialEvents.find(e => e.start_time === time);
                
//                 // If it's a special event, render a single row that spans all columns
//                 if (specialEvent) {
//                   return (
//                     <TableRow key={time}>
//                       <TableCell className="font-medium text-center border-r border-gray-300">
//                         <p className="text-sm font-semibold">{formatTime(specialEvent.start_time)}</p>
//                         <p className="text-xs text-gray-600">to {formatTime(specialEvent.end_time)}</p>
//                       </TableCell>
//                       <TableCell colSpan={allSectionsCount} className="text-center font-bold text-lg text-gray-200 bg-muted">
//                         {specialEvent.title}
//                       </TableCell>
//                     </TableRow>
//                   );
//                 }

//                 // Otherwise, render the standard class schedule row
//                 return (
//                   <TableRow key={time}>
//                     <TableCell className="font-medium text-center border-r border-gray-200">
//                       <p className="text-sm font-semibold">{formatTime(time)}</p>
//                       <p className="text-xs text-gray-500">
//                         to {formatTime(allScheduleData?.find(c => c.start_time === time)?.end_time || '00:00:00')}
//                       </p>
//                     </TableCell>
//                     {/* Render Grade 11 schedule cells */}
//                     {grade11Data && Object.values(grade11Data.strandSections).flatMap(sections => sections).map(sectionName => {
//                       const strandName = Object.keys(grade11Data.strandSections).find(s => grade11Data.strandSections[s].includes(sectionName));
//                       const subjectsForCell = grade11Data.timetablesByStrand[strandName]?.[sectionName]?.[time] || {};
//                       const classesList = Object.values(subjectsForCell);

//                       return (
//                         <TableCell key={`g11-${sectionName}-${time}`} className="align-top border-l border-r border-gray-200 p-2 text-xs">
//                           {classesList.length > 0 ? (
//                             <div className="flex flex-col space-y-2">
//                               {classesList.map(cls => (
//                                 <div key={`${cls.subject_code}-${cls.teacher_name}`} className="p-2 rounded-lg bg-indigo-100 text-gray-800 shadow-sm transition-transform transform hover:scale-105">
//                                   <p className="font-bold leading-tight">{cls.subject_title} ({cls.subject_code})</p>
//                                   <p className="text-2xs text-indigo-700 mt-1">When: {Array.from(cls.days).map(getDayAbbreviation).join(', ')}</p>
//                                   <p className="text-2xs text-indigo-700">Teacher: {cls.teacher_name}</p>
//                                 </div>
//                               ))}
//                             </div>
//                           ) : (
//                             <div className="flex items-center justify-center h-full min-h-[80px]">
//                               <span className="text-gray-400">-</span>
//                             </div>
//                           )}
//                         </TableCell>
//                       );
//                     })}
//                     {/* Render Grade 12 schedule cells */}
//                     {grade12Data && Object.values(grade12Data.strandSections).flatMap(sections => sections).map(sectionName => {
//                       const strandName = Object.keys(grade12Data.strandSections).find(s => grade12Data.strandSections[s].includes(sectionName));
//                       const subjectsForCell = grade12Data.timetablesByStrand[strandName]?.[sectionName]?.[time] || {};
//                       const classesList = Object.values(subjectsForCell);

//                       return (
//                         <TableCell key={`g12-${sectionName}-${time}`} className="align-top border-l border-r border-gray-200 p-2 text-xs">
//                           {classesList.length > 0 ? (
//                             <div className="flex flex-col space-y-2">
//                               {classesList.map(cls => (
//                                 <div key={`${cls.subject_code}-${cls.teacher_name}`} className="p-2 rounded-lg bg-indigo-100 text-gray-800 shadow-sm transition-transform transform hover:scale-105">
//                                   <p className="font-bold leading-tight">{cls.subject_title} ({cls.subject_code})</p>
//                                   <p className="text-2xs text-indigo-700 mt-1">When: {Array.from(cls.days).map(getDayAbbreviation).join(', ')}</p>
//                                   <p className="text-2xs text-indigo-700">Teacher: {cls.teacher_name}</p>
//                                 </div>
//                               ))}
//                             </div>
//                           ) : (
//                             <div className="flex items-center justify-center h-full min-h-[80px]">
//                               <span className="text-gray-400">-</span>
//                             </div>
//                           )}
//                         </TableCell>
//                       );
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

// export default App;


import React from 'react'
import { ExternalLink } from 'lucide-react';
import LoadingCard from '../Components/LoadingCard/loadingCard'
function test() {
  const message = (
    <span>
        This track doesn't have any strand and subjects. Go to
      <span className="font-medium mx-1">Programs</span>
      <span className='flex items-center justify-center'>
        to create them.<ExternalLink className="w-4 h-4 ml-1 mt-1 sm:mt-0" />
      </span>
    </span>
  );
  return (
    <>
      <LoadingCard variant="database" />
      <LoadingCard message={message} variant="default" />
    </>
  )
}

export default test
