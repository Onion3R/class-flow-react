import { useState } from 'react';
import {
  Dialog, DialogContent, DialogDescription,
  DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import SelectComponent from '../../../../../../../components/Select/selectComponent';
import { Button } from "@/components/ui/button";
import { Plus, CheckIcon, Trash, AlertCircleIcon, ChevronDown } from "lucide-react";
import { PulseLoader } from "react-spinners";
import { Separator } from "@/components/ui/separator";
import { Label } from '@/components/ui/label';
import { strandSubjectSchema } from '@/app/schema/schema';
// Hooks and Services
import { addStrandSubject } from '../../services/strandSubject';
import useYearLevels from '@/lib/hooks/useYearLevels';
import useSemester from '@/lib/hooks/useSemester';
import { triggerToast } from '@/lib/utils/toast';
import { Alert, AlertTitle } from "@/components/ui/alert"
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover"
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command"

import useSubjectsGetter from '@/lib/hooks/useSubjects';
function AssignStrandDialog({ track, strand, onRefresh }) {

  const [open, setOpen] = useState(false)
const [openPopoverIndex, setOpenPopoverIndex] = useState(null);

  const { data: allYearLevelData, isLoading: yearLevelIsLoading } = useYearLevels();
  const { data: allSemesterData, isLoading: semesterIsLoading } = useSemester();
  const { data: allSubjectsdata, isLoading: subjectsIsLoading } = useSubjectsGetter();
  

  console.log(allSubjectsdata)
  // State to manage the dialog's open/closed status
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [entries, setEntries] = useState([
    // Initialize with properties for the selects to prevent uncontrolled to controlled error
    { subjectCode: '', selectedYearLevel: '',selectedSemester: '',  },
  ]);
  const [entryErrors, setEntryErrors] = useState(() => ({}));
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
      if (!(entries[entries.length - 1].subjectCode)) {
        setError({ message: "Ensure all fields are filled in." });
      } else {
        setEntries((prev) => [...prev, { subjectCode:  '', selectedSemester: '', selectedYearLevel: '' }]);
        setEntryErrors((prev) => ({ ...prev, [entries.length]: '' }));
        console.log('nadara', entries.length)
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
      entries[idx].selectedSemester &&
      entries[idx].selectedYearLevel
    ) {
      setEntryErrors(prev => {
        const { [idx]: _, ...others } = prev
        return (others)
      });

      setError(null);
      setOpenAccordionItem("");


      console.log('check strand and track', strand, track)
    } else {
      setError({ message: "Please fill all fields." });
      setEntryErrors(prev => ({ ...prev, [idx]: true }));
    }
  };
const handleSubmit = async (e) => {
  e.preventDefault();
  setError(null);
  setIsLoading(true);

  // Step 1: Validate missing fields first
  for (const entry of entries) {
    if (!entry.subjectCode || !entry.selectedSemester || !entry.selectedYearLevel) {
      setError({ message: "All section fields must be filled out correctly." });
      setIsLoading(false);
      return;
    }
  }

  try {
    // Step 2: Prepare all promises
    const promises = entries.map(async (entry) => {
      const data = {
        subject_id: allSubjectsdata?.find(e => e.code === entry.subjectCode)?.id,
        strand_id: strand.id,
        track_id: track.id,
        year_level_id: allYearLevelData?.find(e => e.name === entry.selectedYearLevel)?.id,
        semester_id: allSemesterData?.find(e => e.name === entry.selectedSemester)?.id
      };

      console.log(data)

      // Validate data
      await strandSubjectSchema.validate(data, { abortEarly: false });

      // Send API request
      return addStrandSubject(data);
    });

    // Step 3: Run all requests in parallel
    await Promise.all(promises);
        const toastInfo = {
          success: true, 
          title: 'Assigment added ',
          desc: 'Sucessfully updated'
        }
    triggerToast(toastInfo)

  } catch (error) {
    // Step 4: Handle any errors
    if (error.name === "ValidationError") {
      setError({
        message: Array.isArray(error.errors) ? error.errors[0] : error.errors,
      });
    } else {
      setError(error.response?.data || { message: "An unexpected error occurred." });
    }
    
  } finally {
    setIsLoading(false);
     onRefresh();
    // Reset form entries and close the dialog manually
    setEntries([{ name: '', selectedStrand: '', selectedYearLevel: '', is_active: null}]);
    setIsDialogOpen(false);
    setIsLoading(false)
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
          <DialogTitle>Assign Subject</DialogTitle>
          <DialogDescription>
            You are about to assign subjects for the track <u>{track.code}</u>, in the strand <u>{strand.code}</u>.
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
                      <div className='flex flex-col w-full gap-6 '>
                        <div className='w-full'>
                           <Label
                              className={`mb-2 text-xs text-foreground/80 ${((entryErrors[idx] && !entry.subjectCode) || (error && !entry.subjectCode)) && "text-red-600 font-semibold"}`}
                            >
                              Subject *
                            </Label>
                          <Popover 
                            open={openPopoverIndex === idx}
                            onOpenChange={(isOpen) => setOpenPopoverIndex(isOpen ? idx : null)}
                          className='!w-full'>
                            <PopoverTrigger asChild>
                              <Button variant="outline" className={` w-full justify-between font-normal ${entry.subjectCode ? 'text-accent-foreground': 'text-muted-foreground'} hover:text-none ${((entryErrors[idx] && !entry.subjectCode) || (error && !entry.subjectCode)) && "text-red-400  !border-red-500"}` }>
                              {  entry.subjectCode ?  entry.subjectCode :  'Select a subject'}
                              <ChevronDown className='text-gray-600' />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent     align="start" className="p-0 pointer-events-auto w-[var(--radix-popover-trigger-width)]  ">
                              <Command className='!w-full'  >
                                <CommandInput placeholder="Search subject code..."  />
                                <CommandList >
                                  <CommandEmpty>No subject found.</CommandEmpty>
                                  <CommandGroup>
                                    {allSubjectsdata && allSubjectsdata.map(sub => (
                                      <CommandItem
                                        key={sub.code}
                                        value={sub.code}
                                        onSelect={() => {
                                       handleChange(idx, { target: { name: 'subjectCode', value: sub.code } })
                                          setOpen(false)
                                        }}
                                       
                                      >
                                        <span>
                                       <span className='font-bold'> {sub.code}:</span>   {sub.title}</span>
                                        {entry.subjectCode === sub.code && (
                                          <CheckIcon className="ml-auto h-4 w-4" />
                                        )}
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>
                        </div>
                        <div className='flex gap-4'>
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

export default AssignStrandDialog;
