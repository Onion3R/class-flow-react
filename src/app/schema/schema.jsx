// src/schemas/trackSchema.js
import * as yup from "yup";

export const trackSchema = yup.object().shape({
  name: yup
    .string()
    .required("Name is required")
    .matches(/^[a-zA-Z0-9 ]+$/, "Only letters, numbers, and spaces are allowed"),
  code: yup
    .string()
    .required("Code is required")
    .matches(/^[a-zA-Z0-9 ]+$/, "Only letters, numbers, and spaces are allowed"),
});

export const subjectSchema = yup.object().shape({
 
  code: yup
    .string()
    .required("Code is required"), // Removed .matches() to allow special characters
  title: yup
    .string()
    .required("Title is required")
    .matches(/^[a-zA-Z0-9 ]+$/, "Only letters, numbers, and spaces are allowed"),
  minutes_per_week: yup
    .number()
    .typeError("Minutes per week must be a number")
    .required("Minutes per week is required")
    .positive("Minutes must be greater than zero")
    .integer("Minutes must be a whole number"),
});

export const strandSchema = yup.object().shape({
  name: yup
    .string()
    .required("Name is required")
    .matches(/^[a-zA-Z0-9 ]+$/, "Only letters, numbers, and spaces are allowed"),
  code: yup
    .string()
    .required("Code is required")
    .matches(/^[a-zA-Z0-9 ]+$/, "Only letters, numbers, and spaces are allowed"),
  track_id: yup
    .number()
    .required("Track is required")
});
export const strandSubjectSchema = yup.object().shape({
  strand_id: yup
     .number()
    .required("Track is required"),
  subject_id: yup
     .number()
    .required("Subject is required"),
  year_level_id: yup
    .number()
    .required("Year level is required"),
  semester_id: yup
    .number()
    .required("Semester is required")
  
});

export const sectionSchema = yup.object().shape({
  name: yup
    .string()
    .required("Section name is required")
    .matches(
      /^[a-zA-Z\s\-]+$/,
      "Section name must contain only letters and spaces"
    ),
  strand_id: yup
    .number()
    .required("Section is required"),
  year_level_id: yup
    .number()
    .required("Year level is required"),
  max_students: yup
    .number()
    .required("Max students is required"),
  is_active: yup
    .boolean()
});


export const subjectWithAssignmentsSchema = yup.object().shape({
  subject: yup.object().shape({
    code: yup
      .string()
      .required("Subject code is required")
      .matches(/^[a-zA-Z0-9 ]+$/, "Only letters, numbers, and spaces are allowed"),
    title: yup
      .string()
      .required("Subject title is required")
      .matches(/^[a-zA-Z0-9 ]+$/, "Only letters, numbers, and spaces are allowed"),
    minutes_per_week: yup
      .number()
      .required("Minutes per week is required")
      .min(1, "Must be at least 1 minute"),
  }),

  assignments: yup.array().of(
    yup.object().shape({
      strand_id: yup
        .number()
        .required("Strand ID is required"),
      year_level_id: yup
        .number()
        .required("Year level ID is required"),
      semester_id: yup
        .number()
        .required("Semester ID is required"),
      is_required: yup
        .boolean()
        .required("Required status must be specified"),
    })
  ).min(1, "At least one assignment is required"),
});



// there's a existing subject. just need to assign a strand to the subject
export const subjectWithStrand = yup.object().shape({
 subject_id: yup
    .number()
    .required("Subject ID is required"),

  strand_id: yup
    .number()
    .required("Strand ID is required"),

  year_level_id: yup
    .number()
    .required("Year level ID is required"),

  semester_id: yup
    .number()
    .required("Semester ID is required"),

  is_required: yup
    .boolean()
    .required("Required status must be specified"),
});


export const scheduleSchema = yup.object().shape({
  semester_id: yup
    .number()
    .typeError("Semester ID must be a number")
    .required("Semester ID is required"),

  title: yup
    .string()
    .required("Title is required"),

  academic_year: yup
    .string()
    .matches(/^\d{4}-\d{4}$/, "Academic year must be in the format YYYY-YYYY")
    .required("Academic year is required"),

  start_date: yup
    .date()
    .typeError("Start date must be a valid date")
    .required("Start date is required"),

  end_date: yup
    .date()
    .typeError("End date must be a valid date")
    .required("End date is required"),

  is_active: yup
    .boolean()
    .required("Active status must be specified"),
});

