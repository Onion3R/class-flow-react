import { useState } from 'react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import SelectComponent from '../Select/selectComponent';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash } from "lucide-react";
import { PulseLoader } from "react-spinners";

// Import the data fetching hooks
import yearLevelsGetter from '@/lib/hooks/useYearLevels';
import semesterGetter from '@/lib/hooks/useSemester';
import { createSubjectWithAssignments } from '@/services/apiService';
import { triggerSubjectStrandRefresh } from '@/lib/hooks/useSubjectStrand';

// Import the API function provided by you
function SubjectWithAssignmentFormPopover({ track, strand, strandId }) {
  // Use the new data fetching hooks
  const { data: allYearLevelData, isLoading: yearLevelIsLoading } = yearLevelsGetter();
  const { data: allSemesterData, isLoading: semesterIsLoading } = semesterGetter();

  const [selectedSemester, setSelectedSemester] = useState('');
  const [selectedYearLevel, setSelectedYearLevel] = useState('');
  const [activeAccordion, setActiveAccordion] = useState("");
  const [entries, setEntries] = useState([
    { subjectCode: '', subjectTitle: '', minutesPerWeek: '' },
  ]);
  
  // State for API call feedback
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
    setEntries((prev) => [
      ...prev,
      { subjectCode: '', subjectTitle: '', minutesPerWeek: '' },
    ]);
  };

  const handleFillingSubjectInfo = (index, e) => {
    e.preventDefault();
    setActiveAccordion("");
  };

  // The main function to collect and send all data
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Find the semester and year level IDs from the data fetched by the hooks
    const semesterId = allSemesterData.find(s => s.name === selectedSemester)?.id;
    const yearLevelId = allYearLevelData.find(yl => yl.name === selectedYearLevel)?.id;

    // Log the values for debugging before the API call
    console.log("Values from form selections:", {
      selectedSemester,
      selectedYearLevel,
      strandId
    });

    console.log("Resulting IDs from data hooks:", {
      semesterId,
      yearLevelId,
      strandId
    });

    if (!strandId || !semesterId || !yearLevelId) {
      const errorMessage = "Invalid or missing IDs for assignments. Please ensure all selections are made and valid data is being passed.";
      console.error(errorMessage);
      setError({ message: errorMessage });
      setIsLoading(false);
      return;
    }
    
    // Check if subject entries are valid before sending
    for (const entry of entries) {
      if (!entry.subjectCode || !entry.subjectTitle || !entry.minutesPerWeek || isNaN(parseInt(entry.minutesPerWeek))) {
        setError({ message: "All subject fields must be filled out correctly." });
        setIsLoading(false);
        return;
      }
    }


    // Loop through all entries and create a request for each subject
    for (const entry of entries) {
      // 1. Format the subject data from the form entry
      const subjectData = {
        code: entry.subjectCode,
        title: entry.subjectTitle,
        minutes_per_week: parseInt(entry.minutesPerWeek),
      };

      // 2. Create a single assignment object for this subject
      const assignmentsData = [{
        strand_id: strandId,
        year_level_id: yearLevelId,
        semester_id: semesterId,
        is_required: true,
      }];

      // 3. Create a single payload object that combines subject and assignments data
      const payload = {
        subject: subjectData,
        assignments: assignmentsData
      };

      // Log the single payload object to be sent for debugging
      console.log("Payload being sent to API:", payload);

      try {
        // Now pass the single combined payload object to the API function
        await createSubjectWithAssignments(payload);
        triggerSubjectStrandRefresh()
        setEntries([ { subjectCode: '', subjectTitle: '', minutesPerWeek: '' }])
        // Success is handled by the component.
      } catch (err) {
        console.error("Failed to submit one or more subjects:", err);
        // Log the detailed API error response for better debugging
        console.error("API Response Data:", err.response?.data);
        setError(err.response?.data || { message: "An unexpected error occurred." });
        // Stop the process if an error occurs and handle it
        setIsLoading(false);
        return;
      }
    }
    
    // Log success after all entries are processed
    console.log('All subjects submitted successfully!');
    setIsLoading(false);
  };

  const handleDeleteEntry = (index, e) => {
    e.preventDefault();
    setEntries((prev) => prev.filter((_, i) => i !== index));
    setActiveAccordion("");
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
            {/* Display error message if present */}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                <strong className="font-bold">Error: </strong>
                <span className="block sm:inline">{error.message}</span>
              </div>
            )}
            
            {entries.map((entry, idx) => {
              const itemId = `entry-${idx}`;
              return (
                <Accordion
                  type="single"
                  collapsible
                  value={activeAccordion}
                  onValueChange={setActiveAccordion}
                  className="w-full border-t"
                  key={idx}
                >
                  <AccordionItem value={itemId}>
                    <AccordionTrigger >Subject Information</AccordionTrigger>
                    <AccordionContent className="flex flex-col text-balance items-center justify-center">
                      <div className="gap-2 flex flex-col items-center justify-center w-[95%]">
                        <div className="flex gap-6 items-center justify-between mt-2">
                          <Input
                            name="subjectCode"
                            value={entry.subjectCode}
                            onChange={(e) => handleChange(idx, e)}
                            placeholder="Subject code"
                            required
                          />
                          <Input
                            name="minutesPerWeek"
                            type="number"
                            value={entry.minutesPerWeek}
                            min="0"
                            onChange={(e) => handleChange(idx, e)}
                            placeholder="Minutes per week"
                          />
                        </div>
                        <Input
                          name="subjectTitle"
                          value={entry.subjectTitle}
                          onChange={(e) => handleChange(idx, e)}
                          placeholder="Subject title"
                          className="my-4"
                          required
                        />
                        <div className='flex w-full gap-6'>
                          {semesterIsLoading ? (
                            <div>Loading semesters...</div>
                          ) : (
                            <SelectComponent
                              items={allSemesterData.map((s) => s.name)}
                              label="Semester"
                              value={selectedSemester}
                              onChange={setSelectedSemester}
                              className="!max-w-none !w-full !min-w-none"
                            />
                          )}
                          {yearLevelIsLoading ? (
                            <div>Loading year levels...</div>
                          ) : (
                            <SelectComponent
                              items={allYearLevelData.map((s) => s.name)}
                              label="Year Level"
                              value={selectedYearLevel}
                              onChange={setSelectedYearLevel}
                              className="!max-w-none !w-full !min-w-none"
                            />
                          )}
                        </div>
                        <div className="flex w-full items-center justify-center mt-4 gap-7">
                          <Button
                            variant="outline"
                            onClick={(e) => handleFillingSubjectInfo(idx, e)}
                            className="flex-1 w-full"
                          >
                            Done
                          </Button>
                          <Button
                            onClick={(e) => handleDeleteEntry(idx, e)}
                            className="bg-red-600 hover:bg-red-500"
                          >
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
              <Button
                type="button"
                variant="outline"
                className="border-dashed border-gray-white"
                onClick={handleAddEntry}
              >
                <Plus className="h-4 w-4" />
                Add
              </Button>
            </div>

            <DialogFooter className="flex gap-2 justify-end mt-2">
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Cancel
                </Button>
              </DialogClose>
              <DialogClose asChild>
                <Button type="submit" variant="default" disabled={isLoading}>
                  {isLoading ? (
                    <PulseLoader size={8} color="#ffffff" />
                  ) : (
                    'Submit All'
                  )}
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
