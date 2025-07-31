import React, { useState, useEffect, useCallback } from 'react';
import { Button } from "@Components/ui/button";
import { Progress } from "@Components/ui/progress";
import { Card, CardContent, CardHeader, CardFooter, CardTitle, CardDescription, CardAction } from '@/Components/ui/card';
import { ScrollArea } from "@Components/ui/scroll-area";
import { Separator } from "@Components/ui/separator";
import SelectComponent from "@/Components/Select/selectComponent";
import { Plus, Trash, Play } from 'lucide-react';
import { Input } from "@Components/ui/input";
import { Checkbox } from "@/Components/ui/checkbox";
import { Badge } from '@/Components/ui/badge';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/Components/ui/popover";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/Components/ui/command";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import subjectGetter from '../Subject/useSubject';
import {
    // getInstructors,
    getRooms,
    createSchedule,
    createSectionCourse,
    createInstructorSchedule,
    createRoomSchedule,
    createGeneratedSchedule,
    sendGenerateRequest
} from '@/services/apiService';


// Helper function to get the current school year range
function getSchoolYearRange() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth(); // January is 0

    const startYear = month >= 6 ? year : year - 1; // July is month 6 (academic year starts in August/Sept usually)
    const endYear = startYear + 1;

    return `${startYear}-${endYear}`;
}

// Data definitions moved outside the component to avoid re-creation on re-renders
const LEVELS = [
    { id: 'Freshmen', value: 'First Year', level: 1 },
    { id: 'Sophomore', value: 'Second Year', level: 2 },
    { id: 'Junior', value: 'Third Year', level: 3 },
    { id: 'Senior', value: 'Fourth Year', level: 4 },
];

const SEMESTERS = [
    { id: '1st', dbId: 1, value: 'first semester sy.' },
    { id: '2nd', dbId: 2, value: 'second semester sy.' },
    { id: 'Mid', dbId: 3, value: 'mid semester sy.' },
];

const SECTIONS_ALPHABET = [
    "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M",
    "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"
];

// Custom Hook for localStorage
function useLocalStorage(key, initialValue) {
    const [storedValue, setStoredValue] = useState(() => {
        if (typeof window === "undefined") {
            return initialValue;
        }
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error(`Error reading localStorage key “${key}”:`, error);
            return initialValue;
        }
    });

    useEffect(() => {
        if (typeof window !== "undefined") {
            try {
                window.localStorage.setItem(key, JSON.stringify(storedValue));
            } catch (error) {
                console.error(`Error writing localStorage key “${key}”:`, error);
            }
        }
    }, [key, storedValue]);

    return [storedValue, setStoredValue];
}


function GenerateSchedule({ value = 100 }) {
    // --- State Management ---
    // Schedule Generation Parameters
    const [yearLabel, setYearLabel] = useState("");
    const [semesterLabel, setSemesterLabel] = useState("");
    const [yearId, setYearId] = useState(""); // This holds the numerical year_level_id
    const [semesterDbId, setSemesterDbId] = useState(null);
    const [curriculumYear, setCurriculumYear] = useState("");

    // UI State
    const [page, setPage] = useLocalStorage('schedulePage', 0);
    const [sectionCount, setSectionCount] = useLocalStorage('scheduleSectionCount', 0);
    const [scheduleName, setScheduleName] = useLocalStorage('scheduleName', '');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);

    // Data from API/Context
    const [subjects, setSubjects] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState([]);
    const { data: allSubjectsData } = subjectGetter(); // All available subjects from your API
    console.log("Subjects Data (from subjectGetter):", allSubjectsData);
    const [instructorsList, setInstructorsList] = useState([]); // Fetched instructors
    const [allRoomsData, setAllRoomsData] = useState([]); // Fetched rooms from API

    // Section and Schedule Data
    const [sectionToSchedule, setSectionToSchedule] = useState({
        name: "",
        year_level_id: null,
        schedule: null
    });
    const [schedule, setSchedule] = useState({
        title: "",
        curriculum_year: "",
        week_length: null,
        semester_id: null,
        id: null, // Changed to null, as the DB will generate this
    });

    // Key selection states to be persisted
    const [selectedSem, setSelectedSem] = useLocalStorage('scheduleSelectedSem', undefined);
    const [selectedYearLevel, setSelectedYearLevel] = useLocalStorage('scheduleSelectedYearLevel', undefined);

    // State for managing subjects per section
    const [sectionSubjects, setSectionSubjects] = useLocalStorage('scheduleSectionSubjects', []);

    // Instructor Assignments (used for assigning instructors to SectionCourses)
    const [instructorAssignments, setInstructorAssignments] = useState([]);

    // For the instructor-schedule data (data that goes into InstructorSchedule model)
    const [instructorScheduleData, setInstructorScheduleData] = useState([]);

    // For the room-schedule data (data that goes into RoomSchedule model)
    const [roomScheduleData, setRoomScheduleData] = useState([]);


    // --- Effects ---
    // 1. Update subjects when data from subjectGetter changes
    useEffect(() => {
        setSubjects(allSubjectsData);
    }, [allSubjectsData]);

    // 2. Fetch Instructors
    useEffect(() => {
        getInstructors()
            .then((data) => setInstructorsList(data))
            .catch((err) => {
                console.error("Failed to fetch instructors:", err);
                setErrorMessage("Failed to load instructors. Please try again.");
            });
    }, []); // Runs once on mount

    // 3. Fetching Rooms from API
    useEffect(() => {
        getRooms()
            .then((data) => setAllRoomsData(data))
            .catch((err) => {
                console.error("Failed to fetch rooms:", err);
                setErrorMessage("Failed to load rooms. Please try again.");
            });
    }, []); // Runs once on mount


    // 4. Initialize/reset sectionSubjects when sectionCount or yearId changes
    useEffect(() => {
        if (sectionCount > 0 && yearId) {
            if (sectionSubjects.length !== sectionCount || sectionSubjects[0]?.year_level_id !== yearId) {
                   setSectionSubjects(
                    Array.from({ length: sectionCount }, (_, i) => ({
                        section: SECTIONS_ALPHABET[i],
                        subjects: [],
                        name: SECTIONS_ALPHABET[i], // section name like 'A', 'B'
                        year_level_id: yearId,
                        schedule: null
                    }))
                );
            }
        } else if (sectionCount === 0) {
            setSectionSubjects([]);
        }
    }, [sectionCount, yearId, setSectionSubjects]);


    // 5. Filter subjects for display and clear sectionSubjects when semester or year level changes
    useEffect(() => {
        if (semesterDbId && yearId && subjects.length > 0) {
            const matchedSubjects = subjects.filter(
                subject =>
                    subject.semester?.id === semesterDbId &&
                    subject.year_level?.id === yearId
            );
            setSelectedSubject(matchedSubjects);

            // Clear sectionSubjects when semester or year changes (to prevent old subjects from sticking)
            setSectionSubjects(
                Array.from({ length: sectionCount }, (_, i) => ({
                    section: SECTIONS_ALPHABET[i],
                    subjects: [],
                    name: SECTIONS_ALPHABET[i],
                    year_level_id: yearId,
                    schedule: null
                }))
            );
        } else {
            setSelectedSubject([]);
            setSectionSubjects([]);
        }
    }, [semesterDbId, yearId, subjects, sectionCount, setSectionSubjects]);

    // 6. Effect to re-run handleGenerateScheduleDetails when selectedSem or selectedYearLevel change
    useEffect(() => {
        handleGenerateScheduleDetails();
    }, [selectedSem, selectedYearLevel, subjects]);


    // 7. Instructor Assignment Logic (for SectionCourse assignments)
    const performInstructorAssignment = useCallback(() => {
        if (!allSubjectsData?.length || !instructorsList.length || !sectionSubjects.length) {
            setInstructorAssignments([]);
            return;
        }

        let currentAssignmentId = 1; // For local tracking if needed, not sent to DB directly for this
        const tempInstructorLoad = {};
        instructorsList.forEach((inst) => {
            tempInstructorLoad[inst.id] = 0;
        });

        const tempAssignments = [];

        sectionSubjects.forEach((sectionData) => {
            const sectionInteger = SECTIONS_ALPHABET.indexOf(sectionData.section) + 1;
            if (sectionInteger === 0 && sectionData.section !== SECTIONS_ALPHABET[0]) {
                   console.warn(`Could not convert section '${sectionData.section}' to integer.`);
                   return;
            }

            sectionData.subjects.forEach((subjectId) => {
                const subject = allSubjectsData.find((s) => s.id === subjectId);
                if (!subject) {
                    console.warn(`Subject with ID ${subjectId} not found for section ${sectionData.section}`);
                    return;
                }

                const totalUnits = (subject.lecture_units || 0) + (subject.lab_units || 0);

                // Filter eligible instructors based on subjects they can teach and their current load
                const eligibleInstructors = instructorsList.filter(
                    (inst) =>
                        inst.subjects.includes(subjectId) &&
                        (tempInstructorLoad[inst.id] + totalUnits <= inst.max_units)
                );

                let assigned = false;
                for (const instructor of eligibleInstructors) {
                    tempAssignments.push({
                        id: currentAssignmentId++, // Local ID for tracking
                        subject: subject.id,
                        section: sectionInteger,
                        instructor: instructor.id,
                        schedule: null, // Will be filled by backend on creation
                    });

                    tempInstructorLoad[instructor.id] += totalUnits;
                    assigned = true;
                    break; // Assign the first eligible instructor found
                }

                if (!assigned) {
                    console.warn(`No suitable instructor found for subject "${subject.title}" (ID: ${subjectId}) in section ${sectionData.section}.`);
                }
            });
        });

        setInstructorAssignments(tempAssignments);
        console.log("Instructor assignments generated (Desired Format):", tempAssignments);

    }, [allSubjectsData, instructorsList, sectionSubjects]);

    useEffect(() => {
        performInstructorAssignment();
    }, [performInstructorAssignment]);


    // 8. Generate the instructor-schedule data (for InstructorSchedule model)
    const generateInstructorScheduleData = useCallback(() => {
        if (!instructorsList.length) {
            setInstructorScheduleData([]);
            return;
        }

        let currentId = 1; // For local tracking, DB assigns primary key
        const tempInstructorScheduleData = [];
        
        instructorsList.forEach(instructor => {
            tempInstructorScheduleData.push({
                id: currentId++, // Local ID
                max_units: instructor.max_units,
                availability: instructor.availability, // This will be cleaned before POSTing
                instructor: instructor.id,
                schedule: null, // Will be filled by backend on creation
            });
        });

        setInstructorScheduleData(tempInstructorScheduleData);
        console.log("Generated Instructor Schedule Data (Schedule is null):", tempInstructorScheduleData);

    }, [instructorsList]);

    useEffect(() => {
        generateInstructorScheduleData();
    }, [generateInstructorScheduleData]);


    // 9. Generate the room-schedule data (for RoomSchedule model)
    const generateRoomScheduleData = useCallback(() => {
        if (!allRoomsData.length) {
            setRoomScheduleData([]);
            return;
        }

        let currentRoomId = 1; // For local tracking, DB assigns primary key
        const tempRoomScheduleData = allRoomsData.map(room => ({
            id: currentRoomId++, // Local ID
            name: room.name,
            availability: room.availability, // This will be cleaned before POSTing
            room_type: room.room_type,
            schedule: null, // Will be filled by backend on creation
        }));

        setRoomScheduleData(tempRoomScheduleData);
        console.log("Generated Room Schedule Data (Schedule is null):", tempRoomScheduleData);

    }, [allRoomsData]);

    useEffect(() => {
        generateRoomScheduleData();
    }, [generateRoomScheduleData]);


    // --- Handlers ---
    const handleSubmitSections = (e) => {
        e.preventDefault();
        setSectionCount(Number(e.target.sectionCount.value));
    };

    const handlePaginationChange = ({ action }) => {
        if (action === 'next') {
            if (page < slides.length - 1) {
                setPage(prevPage => prevPage + 1);
            }
        } else { // 'prev'
            if (page > 0) {
                setPage(prevPage => prevPage - 1);
            }
        }
    };

    const handleSelectAllSubjectsForSection = (sectionIdentifier) => {
        setSectionSubjects(prev =>
            prev.map(s =>
                s.section === sectionIdentifier
                    ? {
                        ...s,
                        subjects: selectedSubject.map(subject => subject.id),
                    }
                    : s
            )
        );
    };

    const handleDeselectAllSubjectsForSection = (sectionIdentifier) => {
        setSectionSubjects(prev => prev.map(s =>
            s.section === sectionIdentifier
                ? {
                    ...s,
                    subjects: [],
                }
                : s
        ));
    };

    const handleSubjectCheckboxChange = (sectionIdentifier, subjectId) => {
        setSectionSubjects(prev =>
            prev.map(s =>
                s.section === sectionIdentifier
                    ? {
                        ...s,
                        subjects: s.subjects.includes(subjectId)
                            ? s.subjects.filter(subId => subId !== subjectId)
                            : [...s.subjects, subjectId],
                    }
                    : s
            )
        );
    };

    const handleGenerateScheduleDetails = () => {
        if (selectedSem && selectedYearLevel) {
            const yearData = LEVELS.find(l => l.id === selectedYearLevel);
            const semesterData = SEMESTERS.find(s => s.id === selectedSem);
            const yearRange = getSchoolYearRange();

            setYearLabel(yearData?.value || "Unknown Year");
            setYearId(yearData?.level || 0); // Sets the numerical year level (1, 2, 3, 4)
            setSemesterLabel(semesterData?.value || "Unknown Sem");
            setSemesterDbId(semesterData?.dbId || 0); // Sets the numerical semester ID (1, 2, 3)
            setCurriculumYear(yearRange);

            const title = `${yearData?.value || "Unknown Year"} ${semesterData?.value || "Unknown Sem"} ${yearRange}`;
            setScheduleName(title);

            setSchedule(prevSchedule => ({
                ...prevSchedule,
                title,
                curriculum_year: yearRange,
                week_length: 18, // Assuming a fixed week length
                semester_id: semesterData?.dbId || 0,
            }));
        }
    };

    // Main function to handle the final generation process
    const handleFinalGenerate = async () => {
        setErrorMessage(null); // Clear previous errors
        setIsLoading(true);

        try {
            // Step 1: POST the main schedule data and get its ID
            const scheduleToPost = {
                title: schedule.title,
                curriculum_year: schedule.curriculum_year,
                week_length: schedule.week_length,
                semester_id: schedule.semester_id
            };
            console.log("Attempting to create main schedule with data:", scheduleToPost);
            const createdSchedule = await createSchedule(scheduleToPost);
            console.log("Main Schedule created successfully:", createdSchedule);

            const newScheduleId = createdSchedule.id;
            if (!newScheduleId) {
                throw new Error("Failed to retrieve new schedule ID from database response.");
            }

            // Update the schedule state with the new ID for local use/display
            setSchedule(prevSchedule => ({
                ...prevSchedule,
                id: newScheduleId
            }));

            // Step 2: Prepare and POST Section Courses (one by one)
            const sectionCoursePromises = [];
            sectionSubjects.forEach(sectionData => {
                const sectionInteger = SECTIONS_ALPHABET.indexOf(sectionData.section) + 1;
                sectionData.subjects.forEach(subjectId => {
                    const assignedInstructor = instructorAssignments.find(
                        assign => assign.subject === subjectId && assign.section === sectionInteger
                    )?.instructor;

                    const courseToPost = {
                        subject: subjectId,
                        section: sectionInteger,
                        instructor: assignedInstructor || null,
                        schedule: newScheduleId
                    };
                    console.log("Posting individual section course:", courseToPost);
                    sectionCoursePromises.push(createSectionCourse(courseToPost));
                });
            });
            await Promise.all(sectionCoursePromises); // Wait for all individual course posts to complete
            console.log("All section courses created successfully.");


            // Step 3: Prepare and POST Instructor Schedules (one by one)
            const instructorSchedulePromises = instructorScheduleData.map(instructorSchedule => {
                let cleanedAvailability = null;
                if (instructorSchedule.availability) {
                    // Availability is already an object, not a string. Deep copy and clean.
                    cleanedAvailability = { ...instructorSchedule.availability };
                    for (const day in cleanedAvailability) {
                        if (Array.isArray(cleanedAvailability[day])) {
                            cleanedAvailability[day] = cleanedAvailability[day].map(timeRange =>
                                timeRange.replace(/\s/g, '') // Remove all whitespace
                            );
                        }
                    }
                    // No JSON.stringify needed here, Axios handles objects
                }

                const dataToPost = {
                    max_units: instructorSchedule.max_units,
                    availability: cleanedAvailability, // Use the cleaned object directly
                    instructor: instructorSchedule.instructor,
                    schedule: newScheduleId
                };
                console.log("Posting individual instructor schedule:", dataToPost);
                return createInstructorSchedule(dataToPost);
            });
            await Promise.all(instructorSchedulePromises); // Wait for all individual instructor schedule posts to complete
            console.log("All instructor schedules created successfully.");

            // Step 4: Prepare and POST Room Schedules (one by one)
            const roomSchedulePromises = roomScheduleData.map(room => {
                let cleanedRoomAvailability = null;
                if (room.availability) {
                    // Availability is already an object, not a string. Deep copy and clean.
                    cleanedRoomAvailability = { ...room.availability };
                    for (const day in cleanedRoomAvailability) {
                        if (Array.isArray(cleanedRoomAvailability[day])) {
                            cleanedRoomAvailability[day] = cleanedRoomAvailability[day].map(timeRange =>
                                timeRange.replace(/\s/g, '') // Remove all whitespace
                            );
                        }
                    }
                    // No JSON.stringify needed here, Axios handles objects
                }

                const dataToPost = {
                    name: room.name,
                    availability: cleanedRoomAvailability, // Use the cleaned object directly
                    room_type: room.room_type,
                    schedule: newScheduleId
                };
                console.log("Posting individual room schedule:", dataToPost);
                return createRoomSchedule(dataToPost);
            });
            await Promise.all(roomSchedulePromises); // Wait for all individual room schedule posts to complete
            console.log("All room schedules created successfully.");

            // Step 5: Prepare and POST Generated Schedule Entry (singular post)
            const generatedScheduleEntryToPost = {
                year_level: yearId,
                name: schedule.title,
                schedule: newScheduleId
            };
            console.log("Attempting to create generated schedule entry with data:", generatedScheduleEntryToPost);
            const createdGeneratedScheduleEntry = await createGeneratedSchedule(generatedScheduleEntryToPost);
            console.log("Generated schedule entry created successfully:", createdGeneratedScheduleEntry);

            // ALL DATA INSERTION IS COMPLETE. NOW, TRIGGER THE GENERATION ALGORITHM.
            console.log("Triggering backend schedule generation algorithm...");
            const generateResponse = await sendGenerateRequest(
                true, // override: Set to true based on your current hardcoded value. Replace with a state variable if user input is needed.
                newScheduleId, // schedule_id
                yearId,        // year_level_id
                schedule.title // name (optional field, but sending it)
            );

            // Check for success based on Axios response structure
            if (generateResponse.status !== 200 && generateResponse.status !== 201) {
                const errorData = generateResponse.data; // Axios error data is in .data
                throw new Error(`Failed to run backend generation algorithm: ${generateResponse.status} - ${errorData.detail || JSON.stringify(errorData)}`);
            }
            console.log("Backend schedule generation algorithm triggered successfully:", generateResponse.data);


            alert(`Full schedule "${schedule.title}" (ID: ${newScheduleId}) and all related data successfully posted to the database, and generation triggered!`);
            // You might want to reset the form, navigate away, or show a success message here.

        } catch (error) {
            console.error("Error during final schedule generation:", error);
            // Enhanced error message for Axios errors
            setErrorMessage(`Failed to generate schedule: ${error.response?.data?.detail || error.response?.data?.message || error.message || "An unknown error occurred."}`);
        } finally {
            setIsLoading(false);
        }
    };


    // --- Slide Content Definitions ---
    const PopoverButton = ({ section }) => (
        <Popover modal={false}>
            <PopoverTrigger asChild>
                <Button variant='secondary'><Plus /></Button>
            </PopoverTrigger>
            <PopoverContent side="left" align="center" className="p-0 pt-2 w-[220px]">
                <Command>
                    <CommandInput placeholder={`Search subjects...`} />
                    <CommandList>
                        <CommandEmpty>No subjects found.</CommandEmpty>
                        <CommandGroup>
                            {selectedSubject.length > 0 ? (
                                selectedSubject.map((sub) => (
                                    <CommandItem key={sub.id} className="flex items-center gap-2">
                                        <Checkbox
                                            checked={sectionSubjects.find(s => s.section === section)?.subjects.includes(sub.id) || false}
                                            onCheckedChange={() => handleSubjectCheckboxChange(section, sub.id)}
                                        />
                                        {sub.title}
                                    </CommandItem>
                                ))
                            ) : (
                                <CommandItem disabled>No subjects available for selection.</CommandItem>
                            )}
                        </CommandGroup>
                    </CommandList>
                    <div className='flex p-1 gap-2'>
                        <Button
                            variant="secondary"
                            size='sm'
                            className='flex-1'
                            onClick={() => handleSelectAllSubjectsForSection(section)}
                        >
                            Select All
                        </Button>
                        <Button
                            variant="secondary"
                            size='sm'
                            onClick={() => handleDeselectAllSubjectsForSection(section)}
                        >
                            <Trash />
                        </Button>
                    </div>
                </Command>
            </PopoverContent>
        </Popover>
    );

    const slides = [
        {
            content: (
                <div className='h-full'>
                    <div className="flex justify-between items-center h-[55px]">
                        <div className='flex gap-4'>
                            <SelectComponent
                                items={LEVELS.map(level => level.id)}
                                value={selectedYearLevel}
                                onChange={(newValue) => {
                                    setSelectedYearLevel(newValue);
                                    const matchedYear = LEVELS.find(l => l.id === newValue);
                                    setYearId(matchedYear?.level || 0);
                                }}
                                label="Year"
                            />
                            <SelectComponent
                                items={SEMESTERS.map(sem => sem.id)}
                                label="Sem"
                                value={selectedSem}
                                onChange={(newValue) => {
                                    setSelectedSem(newValue);
                                    const matchedSem = SEMESTERS.find(sem => sem.id === newValue);
                                    setSemesterDbId(matchedSem?.dbId || 0);
                                }}
                                className='!text-[40px]'
                            />
                        </div>
                    </div>
                    <ScrollArea className='border rounded p-4 mt-4 h-[calc(100%-70px)]'>
                        {selectedSubject.length > 0 ? (
                            selectedSubject.map((subject, index) => (
                                <React.Fragment key={subject.id}>
                                    <div className="text-sm">{subject.title}</div>
                                    {index !== selectedSubject.length - 1 && <Separator className="my-2" />}
                                </React.Fragment>
                            ))
                        ) : (
                            <div className="text-center text-gray-500">
                                {selectedYearLevel || selectedSem ? "No subjects found for the selected criteria." : "Select a Year and Semester to view subjects."}
                            </div>
                        )}
                    </ScrollArea>
                </div>
            )
        },
        {
            content: (
                <>
                    <div>
                        <div className='flex justify-between items-center '>
                            <span className='ml-[9px] text-sm text-gray-300'>Example: 0 - 5 = A to E</span>
                            <div>
                                <form className="flex gap-4" onSubmit={handleSubmitSections}>
                                    <Input
                                        type="number"
                                        min={1}
                                        placeholder="Number of sections"
                                        name="sectionCount"
                                        disabled={sectionCount > 0}
                                        defaultValue={sectionCount > 0 ? sectionCount : ''}
                                    />
                                    <Button type="submit" variant="secondary" disabled={sectionCount > 0}>
                                        Done
                                    </Button>
                                    {sectionCount > 0 && (
                                        <Button variant="destructive" onClick={() => setSectionCount(0)}>
                                            <Trash />
                                        </Button>
                                    )}
                                </form>
                            </div>
                        </div>
                        <Separator className='my-4' />
                        <div className='px-4'>
                            Sections:
                            <div className='max-h-[calc(100vh-400px)]] overflow-y-auto'>
                                <Table>
                                    <TableBody>
                                        {sectionCount > 0 ? (
                                            SECTIONS_ALPHABET.slice(0, sectionCount).map((section, index) => {
                                                const currentSectionSubjects = sectionSubjects.find(s => s.section === section);
                                                const assignedSubjectCount = currentSectionSubjects ? currentSectionSubjects.subjects.length : 0;
                                                const firstSubjectTitle = assignedSubjectCount > 0
                                                    ? subjects.find(s => s.id === currentSectionSubjects.subjects[0])?.title
                                                    : '';

                                                return (
                                                    <TableRow key={section}>
                                                        <TableCell className="max-w-[80px] font-semibold">{section}</TableCell>
                                                        <TableCell className="flex items-center justify-between">
                                                            {assignedSubjectCount > 0 ? (
                                                                <div className="flex items-center">
                                                                    <span className="text-sm">
                                                                        {firstSubjectTitle}
                                                                    </span>
                                                                    {assignedSubjectCount > 1 && (
                                                                        <Badge variant="secondary" className='ml-2 text-sm'>
                                                                            +{assignedSubjectCount - 1} more
                                                                        </Badge>
                                                                    )}
                                                                </div>
                                                            ) : (
                                                                <span className="text-sm text-gray-500">No subjects assigned</span>
                                                            )}
                                                            <PopoverButton section={section} />
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={2} className="text-center text-gray-500">
                                                    Enter the number of sections above.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    </div>
                </>
            )
        },
        {
            content: (
                <div className="flex flex-col justify-center items-center h-full gap-4">
                    {/* Console log the data when this content is rendered */}
                    {useEffect(() => {
                        console.log("--- Final Schedule Data ---");
                        console.log("Schedule Details:", schedule);
                        console.log("Section Subjects:", sectionSubjects);
                        console.log("Instructor Assignments (for SectionCourse):", instructorAssignments);
                        console.log("Instructor Schedule Data (for InstructorSchedule model):", instructorScheduleData);
                        console.log("Room Schedule Data (for RoomSchedule model):", roomScheduleData);
                        console.log("-------------------------");
                    }, [schedule, sectionSubjects, instructorAssignments, instructorScheduleData, roomScheduleData])}

                    <h3 className="text-lg font-semibold text-gray-700 dark:text-white/70">Schedule Overview</h3>
                    <div className="p-4 rounded-lg  border shadow-sm w-full max-w-md text-center">
                        <p className="text-md mb-2">
                            <span className="font-medium">Title:</span> {schedule.title}
                        </p>
                        <p className="text-md mb-2">
                            <span className="font-medium">Curriculum Year:</span> {schedule.curriculum_year}
                        </p>
                        <p className="text-md mb-2">
                            <span className="font-medium">Sections to Create:</span> {sectionCount}
                        </p>
                        <p className="text-md mb-2">
                            <span className="font-medium">Subjects Assigned:</span>
                            {sectionSubjects.reduce((total, section) => total + section.subjects.length, 0)}
                        </p>
                        <p className="text-md mb-2">
                            <span className="font-medium">Instructor Schedules:</span> {instructorScheduleData.length}
                        </p>
                        <p className="text-md mb-2">
                            <span className="font-medium">Room Schedules:</span> {roomScheduleData.length}
                        </p>
                        {errorMessage && (
                            <p className="text-red-500 text-sm mt-4">{errorMessage}</p>
                        )}
                        <Button
                            onClick={handleFinalGenerate}
                            disabled={isLoading}
                            className="mt-6 w-full"
                        >
                            {isLoading ? (
                                <>
                                    <Play className="mr-2 h-4 w-4 animate-spin" />
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <Play className="mr-2 h-4 w-4" />
                                    Finalize and Generate
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            )
        }
    ];

    const currentSlide = slides[page];

    return (
        <Card className="w-full max-w-2xl mx-auto my-8 h-[calc(100vh-100px)] flex flex-col">
            <CardHeader>
                <CardTitle>Schedule Generation</CardTitle>
                <CardDescription>
                    Fill in the details to generate your academic schedule.
                </CardDescription>
                <Progress value={(page + 1) / slides.length * 100} className="w-full mt-4" />
            </CardHeader>
            <CardContent className="flex-grow p-6">
                {currentSlide.content}
            </CardContent>
            <CardFooter className="flex justify-between">
                <Button
                    variant="outline"
                    onClick={() => handlePaginationChange({ action: 'prev' })}
                    disabled={page === 0 || isLoading}
                >
                    Previous
                </Button>
                <Button
                    onClick={() => handlePaginationChange({ action: 'next' })}
                    disabled={page === slides.length - 1 || isLoading}
                >
                    Next
                </Button>
            </CardFooter>
        </Card>
    );
}

export default GenerateSchedule;