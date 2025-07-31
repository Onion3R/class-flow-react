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

 const semester = [
    { id: '1', value: '1st Semester' },
    { id: '2', value: '2nd Semester' },
  ];

  const levels = ['Junior' ,' Senior']
function CourseFormDialog({track, strand}) {
  const [selectedSemester, setSelectedSemester] = useState('');
  const [selectedYearLevel, setSelectedYearLevel] = useState('');
  const [activeAccordion, setActiveAccordion] = useState(""); // added

 
  const [entries, setEntries] = useState([
    { courseNumber: '', courseDescription: '', semester: '', lecHours: '', labHours: '' },
  ]);

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
      { courseNumber: '', courseDescription: '', semester: '', lecHours: '', labHours: '' },
    ]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitted Entries:', entries);
    // Add your API or state logic here
  };

  const handleDeleteEntry = (index, e) => {
    e.preventDefault();
    setEntries((prev) => prev.filter((_, i) => i !== index));
    setActiveAccordion(""); // close after delete
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
                            name="courseNumber"
                            value={entry.courseNumber}
                            onChange={(e) => handleChange(idx, e)}
                            placeholder="Course Number"
                            required
                          />
                          <Input
                            name="lecHours"
                            type="number"
                            value={entry.lecHours}
                            min="0"
                            onChange={(e) => handleChange(idx, e)}
                            placeholder="Class Hours"
                          />
                        </div>
                        <Input
                          name="courseDescription"
                          value={entry.courseDescription}
                          onChange={(e) => handleChange(idx, e)}
                          placeholder="Description"
                          className="my-4"
                          required
                        />
                        <div className='flex w-full gap-6'>
                        <SelectComponent
                          items={semester.map((s) => s.value)}
                          label="Semester"
                          value={selectedSemester}
                          onChange={setSelectedSemester}
                          className="!max-w-none !w-full !min-w-none"
                        />
                        <SelectComponent
                          items={levels.map((s) => s)}
                          label="level"
                          value={selectedYearLevel}
                          onChange={setSelectedYearLevel}
                          className="!max-w-none !w-full !min-w-none"
                        />
                        </div>
                        <div className="flex w-full items-center justify-center mt-4 gap-7">
                          <Button
                            variant="outline"
                            onClick={() => setActiveAccordion("")}
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
                <Button type="submit" variant="default">
                  Submit All
                </Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </DialogContent>
      </form>
    </Dialog>
  );
}

export default CourseFormDialog;
