export function transformInstructorData(rawData) {
  return rawData.map((instructor) => ({
    id: instructor.id,
    name: instructor.full_name,
    maxLoad: instructor.base_max_minutes_per_week,
    email: `${instructor.full_name.toLowerCase().replace(/\s+/g, "")}@example.com`,
    // CORRECTED: Transform the specializations array into the format expected by the column
    subject: instructor.specializations
             ? instructor.specializations.map(spec => ({
                 value: spec.subject_title, // Use subject_title for display
                 label: spec.subject_title  // Use subject_title for filtering (as per your filterFn)
               }))
             : [] // If no specializations, default to an empty array
  }));
}