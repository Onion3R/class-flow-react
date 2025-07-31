// import { useEffect, useState } from "react";
// import subjectGetter from "./Subject/useSubject";
// import { getInstructors } from "@/services/apiService";

// function useScheduler() {
//   const { data } = subjectGetter();
//   const [assignments, setAssignments] = useState([]);
//   const [instructorsList, setInstructorsList] = useState([]);

//   // Dummy subjects per section
//   const subjectsPerSection = {
//     1: [1, 2],
//     2: [3, 4],
//     3: [5, 6],
//   };
//   // Fetch instructors
//   useEffect(() => {
//     getInstructors()
//       .then((data) => setInstructorsList(data))
//       .catch((err) => console.error("Failed to fetch instructors", err));
//   }, []);

//   useEffect(() => {
//     if (!data?.length || !instructorsList.length) return;

//     let currentId = 1;
//     const instructorLoad = {};
//     const result = [];

//     instructorsList.forEach((inst) => {
//       instructorLoad[inst.id] = 0;
//     });

//     Object.entries(subjectsPerSection).forEach(([sectionId, subjectIds]) => {
//       subjectIds.forEach((subjectId) => {
//         const subject = data.find((s) => s.id === subjectId);
//         if (!subject) return;

//         const totalUnits = subject.lecture_units + subject.lab_units;

//         const eligibleInstructors = instructorsList.filter(
//           (inst) =>
//             inst.subjects.includes(subjectId) &&
//             instructorLoad[inst.id] + totalUnits <= inst.max_units
//         );

//         let assigned = false;
//         for (const instructor of eligibleInstructors) {
//           result.push({
//             id: currentId++,
//             subject: subjectId,
//             section: parseInt(sectionId),
//             instructor: instructor.id,
//             schedule: null,
//           });

//           instructorLoad[instructor.id] += totalUnits;
//           assigned = true;
//           break;
//         }

//         if (!assigned) {
//           console.warn(`No instructor for subject ${subjectId} in section ${sectionId}`);
//         }
//       });
//     });

//     setAssignments(result);
//   }, [data, instructorsList]);

//   return { assignments };
// }

// export default useScheduler;
