import { useState } from 'react';
import {
  Dialog, DialogContent, DialogDescription,
  DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import SelectComponent from '../../../../../../../components/Select/selectComponent';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash, AlertCircleIcon } from "lucide-react";
import { PulseLoader } from "react-spinners";
import { Separator } from "@/components/ui/separator";
import { Label } from '@/components/ui/label';
// Hooks and Services
import useYearLevels from '@/lib/hooks/useYearLevels';
import useSemester from '@/lib/hooks/useSemester';
import {
  getSubjects,
  getSubjectStrand,
  createSubjectStrand,
  createSubjectWithAssignments
} from '@/app/services/apiService';
import { Alert, AlertTitle } from "@/components/ui/alert"
import { triggerToast } from '@/lib/utils/toast';
import { subjectWithAssignmentsSchema, subjectWithStrand } from '@/app/schema/schema';

function SubjectWithAssignmentFormPopover({ track, strand, strandId, onRefresh }) {
  const { data: allYearLevelData, isLoading: yearLevelIsLoading } = useYearLevels();
  const { data: allSemesterData, isLoading: semesterIsLoading } = useSemester();

  // State to manage the dialog's open/closed status
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [entries, setEntries] = useState([
    // Initialize with properties for the selects to prevent uncontrolled to controlled error
    { subjectCode: '', subjectTitle: '', minutesPerWeek: '', selectedSemester: '', selectedYearLevel: '' },
  ]);
  const [entryErrors, setEntryErrors] = useState(() => ({ [entries.length]: true }));
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
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
    if (error) {
      setError({ message: "Please complete all fields, then click Done." });
    } else {
      if (!(entries[entries.length - 1].subjectCode )) {
        setError({ message: "Ensure all fields are filled in." });
      } else {
        setEntries((prev) => [...prev, { subjectCode: '', subjectTitle: '', minutesPerWeek: '', selectedSemester: '', selectedYearLevel: '' }]);
        setEntryErrors((prev) => ({ ...prev, [entries.length]: '' }));
        console.log('nadara',entries.length)
      }
    }
    // Add a new entry with initial values for all fields, but don't automatically open it.
  };

  const handleDeleteEntry = (index) => {
    if (entries.length > 1) {
      setEntries((prev) => prev.filter((_, i) => i !== index));
    }
    if (entryErrors[index]) {
        setEntryErrors((prev) => {
          const { [index]: _, ...rest } = prev;
          return rest;
        });
      }
      setError(null)
    // Also, close the accordion if the deleted item was the active one
    if (`entry-${index}` === openAccordionItem) {
      setOpenAccordionItem("");
    }
  };

  const handleDoneClick = (e, idx) => {
    e.preventDefault();
    // Close the current accordion item
    if (
      entries[idx].subjectCode &&
      entries[idx].subjectTitle &&
      entries[idx].minutesPerWeek &&
      entries[idx].selectedSemester &&
      entries[idx].selectedYearLevel
    ) {
      setEntryErrors(prev => {
        const { [idx]: _, ...others } = prev
        return (others)
      });
      setError(null);
      setOpenAccordionItem("");
    } else {
      setError({ message: "Please fill all fields." });
      setEntryErrors(prev => ({ ...prev, [idx]: true }));
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);
  setError(null);

  try {
    const allSubjects = await getSubjects();
    const allStrandAssignments = await getSubjectStrand();

    for (const entry of entries) {
      const semesterId = allSemesterData.find(s => s.name === entry.selectedSemester)?.id;
      const yearLevelId = allYearLevelData.find(yl => yl.name === entry.selectedYearLevel)?.id;

      const subjectCode = entry.subjectCode.trim();
      const subjectTitle = entry.subjectTitle.trim();
      const minutesPerWeek = parseInt(entry.minutesPerWeek, 10);

      if (!subjectCode || !subjectTitle || isNaN(minutesPerWeek) || minutesPerWeek <= 0 || !semesterId || !yearLevelId) {
        setError({ message: "Please fill all field." });
        return;
      }

      const existingSubject = allSubjects.find(
        s => s.code === subjectCode || s.title === subjectTitle
      );

      if (existingSubject) {
        const alreadyAssigned = allStrandAssignments.find(
          a => a.subject_id === existingSubject.id &&
               a.strand_id === strandId &&
               a.year_level_id === yearLevelId &&
               a.semester_id === semesterId
        );

        if (alreadyAssigned) continue;

        const subjectWithStrandData = {
          subject_id: existingSubject.id,
          strand_id: strandId,
          year_level_id: yearLevelId,
          semester_id: semesterId,
          is_required: true,
        };

        try {
          await subjectWithStrand.validate(subjectWithStrandData, { abortEarly: false });
          await createSubjectStrand(subjectWithStrandData);
          triggerToast({
            success: true,
            title: "Subject added",
            desc: `The subject "${subjectTitle}" has been successfully added.`,
          });
          await onRefresh()
       } catch (error) {
        console.log(error)
          let message;

          if (error?.name === 'ValidationError') {
            message = Array.isArray(error.errors)
              ? error.errors[0]
              : error.errors;
          } else {
            message = error.message || error;
          }

          setError({ message });
          return;
        }
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

        try {
          await subjectWithAssignmentsSchema.validate(payload, { abortEarly: false });
          await createSubjectWithAssignments(payload);
          triggerToast({
            success: true,
            title: "Subject added",
            desc: `The subject "${subjectTitle}" has been successfully added.`,
          });
          await onRefresh()
        } catch (error) {
            console.log(error)
          let message;

          if (error?.name === 'ValidationError') {
            message = Array.isArray(error.errors)
              ? error.errors[0]
              : error.errors;
          } else {
            message = error.message || error;
          }

          setError({ message });
          return;
        }
      }
    }

    await onRefresh();
    setEntries([{ subjectCode: '', subjectTitle: '', minutesPerWeek: '', selectedSemester: '', selectedYearLevel: '' }]);
    setOpenAccordionItem('');
    setIsDialogOpen(false);

  } catch (err) {
    setError(err.response?.data || { message: "An unexpected error occurred." });
  } finally {
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
          <DialogDescription>
            You are about to add subjects for the track <u>{track}</u>, in the strand <u>{strand}</u>.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col w-full">
          {error && (
           <Alert variant="destructive" className="border-red-500  mb-4  bg-red-100 dark:bg-red-900/30">
              <AlertCircleIcon className="h-4 w-4" />
              <AlertTitle className="!truncate-none !whitespace-normal !break-words ">
                Error:
                <span className="!text-sm font-normal ml-1">
                  {error.message}
                </span>
              </AlertTitle>
            </Alert>
          )}
          <Separator />

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
                  <AccordionTrigger
                    className={
                      entryErrors[idx] || (error && !entry.subjectCode)
                        ? "text-red-600 font-semibold"
                        : "text-black dark:text-muted-foreground"
                    }
                  >
                    {entry.subjectCode || `Subject information`}
                  </AccordionTrigger>
                  <AccordionContent className="flex flex-col items-center">
                    <div className="gap-4 flex flex-col sm:w-[90%] w-[90%]">
                      <div className="flex flex-row  gap-6 items-center justify-center mt-2">
                        <div className='w-full'>
                          <Label
                            htmlFor={`subjectCode-${idx}`}
                            className={`mb-2 text-xs text-foreground/80 ${((entryErrors[idx] && !entry.subjectCode) || (error && !entry.subjectCode)) && "text-red-600 font-semibold"}`}
                          >
                            Subject Code *
                          </Label>
                          <Input
                            id={`subjectCode-${idx}`}
                            name="subjectCode"
                            value={entry.subjectCode}
                            onChange={(e) => handleChange(idx, e)}
                            placeholder="Subject code"
                            className={`!w-full !max-w-none ${((entryErrors[idx] && !entry.subjectCode) || (error && !entry.subjectCode)) && "border border-red-500 placeholder:text-red-400"}`}
                            required
                          />
                        </div>
                        <div className='w-full'>
                          <Label
                            htmlFor={`minutesPerWeek-${idx}`}
                            className={`mb-2 text-xs text-foreground/80 ${((entryErrors[idx] && !entry.minutesPerWeek) || (error && !entry.minutesPerWeek)) && "text-red-600 font-semibold"}`}
                          >
                            Minutes per week *
                          </Label>
                          <Input
                            id={`minutesPerWeek-${idx}`}
                            name="minutesPerWeek"
                            type="number"
                            value={entry.minutesPerWeek}
                            onChange={(e) => handleChange(idx, e)}
                            placeholder="Minutes per week"
                            min="0"
                            className={`!w-full !max-w-none ${((entryErrors[idx] && !entry.minutesPerWeek) || (error && !entry.minutesPerWeek)) && "border border-red-500 placeholder:text-red-400"}`}
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <Label
                          htmlFor={`subjectTitle-${idx}`}
                          className={`mb-2 text-xs text-foreground/80 ${((entryErrors[idx] && !entry.subjectTitle) || (error && !entry.subjectTitle)) && "text-red-600 font-semibold"}`}
                        >
                          Subject Title *
                        </Label>
                        <Input
                          id={`subjectTitle-${idx}`}
                          name="subjectTitle"
                          value={entry.subjectTitle}
                          onChange={(e) => handleChange(idx, e)}
                          placeholder="Subject title"
                          className={`!w-full !max-w-none ${((entryErrors[idx] && !entry.subjectTitle) || (error && !entry.subjectTitle)) && "border border-red-500 placeholder:text-red-400"}`}
                          required
                        />
                      </div>
                      <div className='flex w-full gap-6 flex-row   '>
                        {semesterIsLoading ? (
                          <div>Loading semesters...</div>
                        ) : (
                          <div className='md:w-[50%] w-full'>
                            <Label
                              className={`mb-2 text-xs text-foreground/80 ${((entryErrors[idx] && !entry.selectedSemester) || (error && !entry.selectedSemester)) && "text-red-600 font-semibold"}`}
                            >
                              Semester *
                            </Label>
                            <SelectComponent
                              items={allSemesterData.map(s => s.name)}
                              label="Semester"
                              value={entry.selectedSemester}
                              onChange={(value) => handleChange(idx, { target: { name: 'selectedSemester', value } })}
                              className={`!w-full !max-w-none ${((entryErrors[idx] && !entry.selectedSemester) || (error && !entry.selectedSemester)) && "text-red-600 data-[placeholder]:text-red-400 border-red-500"}`}
                              required
                            />
                          </div>
                        )}
                        {yearLevelIsLoading ? (
                          <div>Loading year levels...</div>
                        ) : (
                          <div className='md:w-[50%] w-full'>
                            <Label
                              className={`mb-2 text-xs text-foreground/80 ${((entryErrors[idx] && !entry.selectedYearLevel) || (error && !entry.selectedYearLevel)) && "text-red-600 font-semibold"}`}
                            >
                              Year Level *
                            </Label>
                            <SelectComponent
                              items={allYearLevelData.map(s => s.name)}
                              label="Year Level"
                              value={entry.selectedYearLevel}
                              onChange={(value) => handleChange(idx, { target: { name: 'selectedYearLevel', value } })}
                              className={`!w-full !max-w-none ${((entryErrors[idx] && !entry.selectedYearLevel) || (error && !entry.selectedYearLevel)) && "text-red-600 data-[placeholder]:text-red-400 border-red-500"}`}
                              required
                            />
                          </div>
                        )}
                      </div>
                      <div className="flex w-full justify-center mt-4 gap-7">
                        <Button variant="outline" onClick={(e) => handleDoneClick(e, idx)} className="flex-1">
                          Done
                        </Button>
                        {entries.length > 1 && (
                            <Button
                              onClick={() => handleDeleteEntry(idx)}
                              className="bg-red-600 hover:bg-red-500"
                            >
                              <Trash className="text-red-200" />
                            </Button>
                          )}
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
            <Button type="button" variant="secondary" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
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
