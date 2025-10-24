"use client";
import { useState } from 'react';
import {
  Dialog,
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
import { Alert, AlertTitle } from "@/components/ui/alert"

import { triggerToast } from '@/lib/utils/toast';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash , AlertCircleIcon} from "lucide-react";
import { PulseLoader } from "react-spinners";
import {Label} from "@/components/ui/label";
// Import the API function provided by you

import { subjectSchema } from '@/app/schema/schema';
import { addSubject } from '../../assignment/pages/services/subjectService';
function AddSubjectDialog({ onRefresh }) {

  const [entries, setEntries] = useState([
    { code: '', title: '' , minutes_per_week: ''},
  ]);
  
  // State to manage the Dialog's open/closed state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [openAccordionItem, setOpenAccordionItem] = useState("");

  // State for API call feedback
  const [isLoading, setIsLoading] = useState(false);
  const [entryErrors, setEntryErrors] = useState({})
  const [error, setError] = useState();

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
      if (!(entries[entries.length - 1].title )) {
        setError({ message: "Ensure all fields are filled in." });
      } else {
        setEntries((prev) => [
          ...prev,
          { code: '', title: '', minutes_per_week: '' },
          ]);
        setEntryErrors((prev) => ({ ...prev, [entries.length]: '' }));
        console.log('nadara',entries.length)
      }
    }
  };

  const handleDoneClick = (e, idx) => {
    e.preventDefault();
    if (
      entries[idx].code &&
      entries[idx].title &&
      entries[idx].minutes_per_week
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

  // ✅ Validate all entries before sending
  for (const entry of entries) {
    try {
      console.log(entry)
      await subjectSchema.validate(entry, { abortEarly: false });
    } catch (validationError) {
      console.log(validationError.errors)
      setError({ message: Array.isArray(validationError.errors) ? validationError.errors[0]  : validationError.errors});
      setIsLoading(false);
      return;
    }
  }

  // ✅ If validation passed, continue API calls
  for (const entry of entries) {
    const subjectData = {
      code: entry.code,
      title: entry.title,
      minutes_per_week: entry.minutes_per_week,
    };

    console.log("Payload being sent to API:", subjectData);

    try {
      await addSubject(subjectData);
      triggerToast({
        success: true,
        title: "Subjects added",
        desc: `The subject "${entry.title}" has been successfully added.`,
      });

      onRefresh();
    } catch (error) {
      console.error("Failed to submit one or more subejcts:", error);
      setError({message: error.response.data.code} || { message: "An unexpected error occurred." });
      setIsLoading(false);
      return;
    }
  }

  console.log("All Subjectss submitted successfully!");
  setIsLoading(false);
  setEntries([{ title: "", code: "" , minutes_per_week:""}]);
  setIsDialogOpen(false);
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

  return (
    // The Dialog's open state is now controlled by a state variable
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen} className='gap-0'>
  
        <DialogTrigger asChild>
          <Button variant="default" className="ml-2" onClick={() => setIsDialogOpen(true)}>
            <Plus /> Add
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Subject</DialogTitle>
            <DialogDescription>You are about to add a new subject.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="flex flex-col w-full">
            {/* Display error message if present */}
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
            
            {entries.map((entry, idx) => {
              const itemId = `entry-${idx}`;
              return (
                <Accordion
                  type="single"
                  collapsible
                  value={openAccordionItem}
                  onValueChange={setOpenAccordionItem}
                  className="w-full border-t"
                  key={idx}
                >
                  <AccordionItem value={itemId}>
                   <AccordionTrigger
                    className={
                      entryErrors[idx] || (error && !entry.code)
                        ? "text-red-600 font-semibold"
                        : "text-black dark:text-muted-foreground"
                    }
                  >
                    {entry.code || `Subject information`}
                  </AccordionTrigger>
                    <AccordionContent className="flex flex-col text-balance items-center justify-center">
                      <div className="gap-2 flex flex-col items-center justify-center w-[95%]">
                        <div className="flex flex-row  gap-6 items-center justify-center mt-2">
                        <div className='w-full'>
                          <Label
                            htmlFor={`code-${idx}`}
                            className={`mb-2 text-xs text-foreground/80 ${((entryErrors[idx] && !entry.code) || (error && !entry.code)) && "text-red-600 font-semibold"}`}
                          >
                            Subject Code *
                          </Label>
                          <Input
                            id={`code-${idx}`}
                            name="code"
                            value={entry.code}
                            onChange={(e) => handleChange(idx, e)}
                            placeholder="PEH-01"
                            className={`!w-full !max-w-none ${((entryErrors[idx] && !entry.code) || (error && !entry.code)) && "border border-red-500 placeholder:text-red-400"}`}
                            required
                          />
                        </div>
                        <div className='w-full'>
                          <Label
                            htmlFor={`minutes_per_week-${idx}`}
                            className={`mb-2 text-xs text-foreground/80 ${((entryErrors[idx] && !entry.minutes_per_week) || (error && !entry.minutes_per_week)) && "text-red-600 font-semibold"}`}
                          >
                            Minutes per week *
                          </Label>
                          <Input
                            id={`minutes_per_week-${idx}`}
                            name="minutes_per_week"
                            type="number"
                            value={entry.minutes_per_week}
                            onChange={(e) => handleChange(idx, e)}
                            placeholder="240"
                            min="0"
                            className={`!w-full !max-w-none ${((entryErrors[idx] && !entry.minutes_per_week) || (error && !entry.minutes_per_week)) && "border border-red-500 placeholder:text-red-400"}`}
                            required
                          />
                        </div>
                      </div>
                      <div className='w-full'>
                        <Label
                          htmlFor={`title-${idx}`}
                          className={`mb-2 text-xs text-foreground/80 ${((entryErrors[idx] && !entry.title) || (error && !entry.title)) && "text-red-600 font-semibold"}`}
                        >
                          Subject Title *
                        </Label>
                        <Input
                          id={`title-${idx}`}
                          name="title"
                          value={entry.title}
                          onChange={(e) => handleChange(idx, e)}
                          placeholder="P. E. & Health 11"
                          className={`!w-full !max-w-none ${((entryErrors[idx] && !entry.title) || (error && !entry.title)) && "border border-red-500 placeholder:text-red-400"}`}
                          required
                        />
                      </div>
                        <div className="flex w-full items-center justify-center mt-4 gap-7">
                          <Button
                            variant="outline"
                            onClick={(e) => handleDoneClick(e, idx)}
                            className="flex-1 w-full"
                          >
                            Done
                          </Button>
                          {/* Only show the delete button if there's more than one entry */}
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
              <Button type="button" variant="secondary" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="default" disabled={isLoading}>
                {isLoading ? (
                  <PulseLoader size={8} color="#ffffff" />
                ) : (
                  'Submit All'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
    </Dialog>
  );
}

export default AddSubjectDialog;
