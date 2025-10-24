export function transformInstructorData(rawData) {
  return rawData.map((teacher) => ({
    id: teacher.id,
    name: teacher.full_name,
    maxLoad: teacher.base_max_minutes_per_week,
    email: teacher.email ? teacher.email : `${teacher.full_name.toLowerCase().replace(/\s+/g, "")}@example.com`  ,
    // CORRECTED: Transform the specializations array into the format expected by the column
    subject: teacher.specializations
             ? teacher.specializations.map(spec => ({
                 value: spec.subject_title, // Use subject_title for display
                 label: spec.subject_title  // Use subject_title for filtering (as per your filterFn)
               }))
             : [], // If no specializations, default to an empty array
    role: teacher.role_details.value,
    status: teacher.is_active
  }));
}