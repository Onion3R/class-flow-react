// Inside SubjectWithAssignmentFormPopover.jsx

import { useState } from 'react';
import {
  Dialog, DialogClose, DialogContent, DialogDescription,
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
import yearLevelsGetter from '@/lib/hooks/useYearLevels';
import semesterGetter from '@/lib/hooks/useSemester';
import { getSubjects, getSubjectStrand, createSubjectStrand, createSubjectWithAssignments } from '@/services/apiService';
import { triggerSubjectStrandRefresh } from '@/lib/hooks/useSubjectStrand';

function SubjectWithAssignmentFormPopover({  track, strand, strandId }) {
  const { data: allYearLevelData, isLoading: yearLevelIsLoading } = yearLevelsGetter();
  const { data: allSemesterData, isLoading: semesterIsLoading } = semesterGetter();

  const [selectedSemester, setSelectedSemester] = useState('');
  const [selectedYearLevel, setSelectedYearLevel] = useState('');
  const [activeAccordion, setActiveAccordion] = useState("");
  const [entries, setEntries] = useState([
    { subjectCode: '', subjectTitle: '', minutesPerWeek: '' },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (index, e) => {
    const { name, value } = e.target;
    setEntries((prev) => {
      const updated = [...prev];
      updated[index][name] = value;
      return updated;
    });
  };

  const handleAddEntry = () => {
    setEntries((prev) => [...prev, { subjectCode: '', subjectTitle: '', minutesPerWeek: '' }]);
  };

  const handleDeleteEntry = (index, e) => {
    e.preventDefault();
    setEntries((prev) => prev.filter((_, i) => i !== index));
    setActiveAccordion("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const allSubjects = await getSubjects();
      const allStrandAssignments = await getSubjectStrand();

      const semesterId = allSemesterData.find(s => s.name === selectedSemester)?.id;
      const yearLevelId = allYearLevelData.find(yl => yl.name === selectedYearLevel)?.id;

      if (!strandId || !semesterId || !yearLevelId) {
        setError({ message: "Missing IDs. Please complete all selections." });
        setIsLoading(false);
        return;
      }

      for (const entry of entries) {
        const subjectCode = entry.subjectCode.trim();
        const subjectTitle = entry.subjectTitle.trim();
        const minutesPerWeek = parseInt(entry.minutesPerWeek);

        if (!subjectCode || !subjectTitle || isNaN(minutesPerWeek)) {
          setError({ message: "Fill all subject fields correctly." });
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
      triggerSubjectStrandRefresh();
      setEntries([{ subjectCode: '', subjectTitle: '', minutesPerWeek: '' }]);
      setIsLoading(false);
    } catch (err) {
      setError(err.response?.data || { message: "An unexpected error occurred." });
      setIsLoading(false);
    }
  };

  return (
    <Dialog className='gap-0'>
      <form>
        <DialogTrigger asChild>
          <Button variant="default" className="ml-2">
            <Plus /> Add
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Subjects</DialogTitle>
            <DialogDescription>You are about to add the track <u>{track}</u>, categorized under the strand <u>{strand}</u>.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="flex flex-col w-full">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                <strong className="font-bold">Error: </strong>
                <span className="block sm:inline">{error.message}</span>
              </div>
            )}

            {entries.map((entry, idx) => {
              const itemId = `entry-${idx}`;
              return (
                <Accordion type="single" collapsible value={activeAccordion} onValueChange={setActiveAccordion} className="w-full border-t" key={idx}>
                  <AccordionItem value={itemId}>
                    <AccordionTrigger>Subject Information</AccordionTrigger>
                    <AccordionContent className="flex flex-col items-center">
                      <div className="gap-2 flex flex-col sm:w-[90%] w-[90%]">
                        <div className="flex sm:flex-row flex-col gap-6 items-center mt-2">
                          <Input name="subjectCode" value={entry.subjectCode} onChange={(e) => handleChange(idx, e)} placeholder="Subject code" required />
                          <Input name="minutesPerWeek" type="number" value={entry.minutesPerWeek} onChange={(e) => handleChange(idx, e)} placeholder="Minutes per week" min="0" />
                        </div>
                        <Input name="subjectTitle" value={entry.subjectTitle} onChange={(e) => handleChange(idx, e)} placeholder="Subject title" className="my-4" required />
                        <div className='flex w-full gap-6 sm:flex-row flex-col'>
                          {semesterIsLoading ? <div>Loading semesters...</div> : <SelectComponent items={allSemesterData.map(s => s.name)} label="Semester" value={selectedSemester} onChange={setSelectedSemester} className="!w-full !max-w-none" />}
                          {yearLevelIsLoading ? <div>Loading year levels...</div> : <SelectComponent items={allYearLevelData.map(s => s.name)} label="Year Level" value={selectedYearLevel} onChange={setSelectedYearLevel} className="!w-full !max-w-none" />}
                        </div>
                        <div className="flex w-full justify-center mt-4 gap-7">
                          <Button variant="outline" onClick={(e) => e.preventDefault()} className="flex-1">Done</Button>
                          <Button onClick={(e) => handleDeleteEntry(idx, e)} className="bg-red-600 hover:bg-red-500">
                            <Trash className="text-red-200" />
                          </Button>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              );
            })}

            <div className="flex justify-start mt-4">
              <Button type="button" variant="outline" onClick={handleAddEntry}>
                <Plus className="h-4 w-4" /> Add
              </Button>
            </div>

            <DialogFooter className="flex gap-2 justify-end mt-2">
              <DialogClose asChild>
                <Button type="button" variant="secondary">Cancel</Button>
              </DialogClose>
              <DialogClose asChild>
                <Button type="submit" variant="default" disabled={isLoading}>
                  {isLoading ? <PulseLoader size={8} color="#ffffff" /> : 'Submit All'}
                </Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </DialogContent>
      </form>
    </Dialog>
  );
}

export default SubjectWithAssignmentFormPopover;
