// utils/transformSubjects.ts
export function transformSubjectData(apiData) {
  const yearMapping = {
    "Junior(3rd year)": "Junior",
    "Sophomore(2nd year)": "Sophomore",
    "Freshman(1st year)": "Freshmen",
    "Senior(4th year)": "Senior"
  };

  const semesterMapping = {
  1: "1st Semester",
  2: "2nd Semester"
};
  const groupedData = {};

  apiData.forEach(subject => {
    const year = yearMapping[subject.year_level.name] || subject.year_level.name;
    const semesterLabel = semesterMapping[subject.semester.id] || subject.semester.id;
    const semesterValue = subject.semester.id.toString();

    const transformed = {
      sem: [{ label: semesterLabel, value: semesterValue }],
      courseNo: subject.code,
      courseDesc: subject.title,
      lecHrs: subject.lecture_units.toString(),
      labHrs: subject.lab_units.toString(),
      units: (subject.lecture_units + subject.lab_units).toString()
    };

    if (!groupedData[year]) {
      groupedData[year] = [];
    }

    groupedData[year].push(transformed);
  });

  return groupedData;
}
