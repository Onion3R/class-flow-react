import { useState } from 'react';
import {
  Dialog, DialogContent, DialogDescription,
  DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import SelectComponent from '../Select/selectComponent';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash } from "lucide-react";
import { PulseLoader } from "react-spinners";

// Hooks and Services
import useYearLevels from '@/lib/hooks/useYearLevels';
import useSemester from '@/lib/hooks/useSemester';
import {
  getSubjects,
  getSubjectStrand,
  createSubjectStrand,
  createSubjectWithAssignments
} from '@/services/apiService';

/**
 * A popover form to add new subjects and assign them to a specific strand.
 * The onRefresh prop is used to trigger a data refresh after a successful submission.
 *
 * @param {object} props - Component props.
 * @param {string} props.track - The name of the track.
 * @param {string} props.strand - The name of the strand.
 * @param {string} props.strandId - The ID of the strand.
 * @param {function} props.onRefresh - A function to call to refresh data.
 */
function SubjectWithAssignmentFormPopover({ track, strand, strandId, onRefresh }) {
  const { data: allYearLevelData, isLoading: yearLevelIsLoading } = useYearLevels();
  const { data: allSemesterData, isLoading: semesterIsLoading } = useSemester();

  // State to manage the dialog's open/closed status
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [entries, setEntries] = useState([
    // Initialize with properties for the selects to prevent uncontrolled to controlled error
    { subjectCode: '', subjectTitle: '', minutesPerWeek: '', selectedSemester: '', selectedYearLevel: '' },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // State to manage the active accordion item
  const [openAccordionItem, setOpenAccordionItem] = useState("");

  const handleChange = (index, e) => {
    const { name, value } = e.target;
    setEntries((prev) => {
      const updated = [...prev];
      updated[index][name] = value;
      return updated;
    });
  };

  const handleAddEntry = () => {
    // Add a new entry with initial values for all fields, but don't automatically open it.
    setEntries((prev) => [...prev, { subjectCode: '', subjectTitle: '', minutesPerWeek: '', selectedSemester: '', selectedYearLevel: '' }]);
  };

  const handleDeleteEntry = (index) => {
    setEntries((prev) => prev.filter((_, i) => i !== index));
    // Also, close the accordion if the deleted item was the active one
    if (`entry-${index}` === openAccordionItem) {
      setOpenAccordionItem("");
    }
  };

  const handleDoneClick = (e) => {
    e.preventDefault();
    // Close the current accordion item
    setOpenAccordionItem("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Fetch data needed for validation
      const allSubjects = await getSubjects();
      const allStrandAssignments = await getSubjectStrand();

      for (const entry of entries) {
        // Find the IDs based on selected names for this specific entry
        const semesterId = allSemesterData.find(s => s.name === entry.selectedSemester)?.id;
        const yearLevelId = allYearLevelData.find(yl => yl.name === entry.selectedYearLevel)?.id;

        const subjectCode = entry.subjectCode.trim();
        const subjectTitle = entry.subjectTitle.trim();
        const minutesPerWeek = parseInt(entry.minutesPerWeek, 10);

        if (!subjectCode || !subjectTitle || isNaN(minutesPerWeek) || minutesPerWeek <= 0 || !semesterId || !yearLevelId) {
          setError({ message: "Please fill all subject fields and selections correctly with valid values." });
          setIsLoading(false);
          return;
        }

        const existingSubject = allSubjects.find(
          (s) => s.code === subjectCode || s.title === subjectTitle
        );

        if (existingSubject) {
          const existingAssignment = allStrandAssignments.find(
            (a) =>
              a.subject_id === existingSubject.id &&
              a.strand_id === strandId &&
              a.year_level_id === yearLevelId &&
              a.semester_id === semesterId
          );

          if (existingAssignment) {
            continue; // Skip, already assigned
          }

          await createSubjectStrand({
            subject_id: existingSubject.id,
            strand_id: strandId,
            year_level_id: yearLevelId,
            semester_id: semesterId,
            is_required: true,
          });
        } else {
          const payload = {
            subject: {
              code: subjectCode,
              title: subjectTitle,
              minutes_per_week: minutesPerWeek,
            },
            assignments: [{
              strand_id: strandId,
              year_level_id: yearLevelId,
              semester_id: semesterId,
              is_required: true,
            }],
          };

          await createSubjectWithAssignments(payload);
        }
      }

      // Refresh the data after all submissions are successful
      onRefresh();
      // Reset form state and close the dialog
      setEntries([{ subjectCode: '', subjectTitle: '', minutesPerWeek: '', selectedSemester: '', selectedYearLevel: '' }]);
      setOpenAccordionItem(""); // Reset accordion state
      setIsDialogOpen(false); // Close the dialog
      setIsLoading(false);
    } catch (err) {
      setError(err.response?.data || { message: "An unexpected error occurred." });
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen} className='gap-0'>
      <DialogTrigger asChild>
        <Button variant="default" className="ml-2">
          <Plus /> Add
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Subjects</DialogTitle>
          <DialogDescription>You are about to add subjects for the track <u>{track}</u>, in the strand <u>{strand}</u>.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col w-full">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{error.message}</span>
            </div>
          )}
          
          <Accordion 
            type="single" 
            collapsible 
            value={openAccordionItem} 
            onValueChange={setOpenAccordionItem} 
            className="w-full"
          >
            {entries.map((entry, idx) => {
              const itemId = `entry-${idx}`;
              return (
                <AccordionItem value={itemId} key={idx}>
                  <AccordionTrigger>{entry.subjectCode || `Subject information`}</AccordionTrigger>
                  <AccordionContent className="flex flex-col items-center">
                    <div className="gap-2 flex flex-col sm:w-[90%] w-[90%]">
                      <div className="flex sm:flex-row flex-col gap-6 items-center mt-2">
                        <Input name="subjectCode" value={entry.subjectCode} onChange={(e) => handleChange(idx, e)} placeholder="Subject code" required />
                        <Input name="minutesPerWeek" type="number" value={entry.minutesPerWeek} onChange={(e) => handleChange(idx, e)} placeholder="Minutes per week" min="0" />
                      </div>
                      <Input name="subjectTitle" value={entry.subjectTitle} onChange={(e) => handleChange(idx, e)} placeholder="Subject title" className="my-4" required />
                      <div className='flex w-full gap-6 sm:flex-row flex-col'>
                        {semesterIsLoading ? <div>Loading semesters...</div> : <SelectComponent items={allSemesterData.map(s => s.name)} label="Semester" value={entry.selectedSemester} onChange={(value) => handleChange(idx, { target: { name: 'selectedSemester', value } })} className="!w-full !max-w-none" />}
                        {yearLevelIsLoading ? <div>Loading year levels...</div> : <SelectComponent items={allYearLevelData.map(s => s.name)} label="Year Level" value={entry.selectedYearLevel} onChange={(value) => handleChange(idx, { target: { name: 'selectedYearLevel', value } })} className="!w-full !max-w-none" />}
                      </div>
                      <div className="flex w-full justify-center mt-4 gap-7">
                        <Button variant="outline" onClick={handleDoneClick} className="flex-1">Done</Button>
                        <Button type="button" onClick={() => handleDeleteEntry(idx)} className="bg-red-600 hover:bg-red-500">
                          <Trash className="text-red-200" />
                        </Button>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>

          <div className="flex justify-start mt-4">
            <Button type="button" variant="outline" onClick={handleAddEntry}>
              <Plus className="h-4 w-4" /> Add
            </Button>
          </div>

          <DialogFooter className="flex gap-2 justify-end mt-2">
            <Button type="button" variant="secondary" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button type="submit" variant="default" disabled={isLoading}>
              {isLoading ? <PulseLoader size={8} color="#ffffff" /> : 'Submit All'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default SubjectWithAssignmentFormPopover;
