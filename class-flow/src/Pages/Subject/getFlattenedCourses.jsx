// src/utils/getFlattenedCourses.js (create this new file)

export const getFlattenedCourses = (rawData) => {
  const flattened = [];
  for (const yearLevelKey in rawData) {
    if (Object.hasOwnProperty.call(rawData, yearLevelKey)) {
      rawData[yearLevelKey].forEach(course => {
        flattened.push({
          ...course,
          // Add the year level from the object key
          yearLevel: yearLevelKey,
          // Flatten 'sem' property for easier filtering/access in DataTable
          semester: course.sem && course.sem.length > 0 ? course.sem[0].value : null,
          semesterLabel: course.sem && course.sem.length > 0 ? course.sem[0].label : null, // Keep label for potential display
        });
      });
    }
  }
  return flattened;
};