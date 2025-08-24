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

import SelectComponent from '../Select/selectComponent';
import { triggerToast } from '@/lib/utils/toast';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash , AlertCircleIcon} from "lucide-react";
import { PulseLoader } from "react-spinners";
import {Label} from "@/components/ui/label";
// Import the API function provided by you
import useTrackGetter from '@/lib/hooks/useTracks';
import { createStrand } from '@/services/apiService';


// This component now accepts an 'onRefresh' function as a prop.
// The global triggerStrandRefresh function is no longer needed.
function StrandFormPopover({ onRefresh }) {

  const { data: allTrackData, isLoading: trackIsLoading} = useTrackGetter()
  const [entries, setEntries] = useState([
    { name: '', code: '' , selectedTrack: ''},
  ]);
  
  // State to manage the Dialog's open/closed state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [openAccordionItem, setOpenAccordionItem] = useState("");

  // State for API call feedback
  const [isLoading, setIsLoading] = useState(false);
  const [entryErrors, setEntryErrors] = useState({[entries.length]: true})
  const [error, setError] = useState();

  const handleChange = (index, e) => {
    const { name, value } = e.target;
    setEntries((prev) => {
      const updated = [...prev];
      updated[index][name] = value;
      return updated;
    });
  };

  const handleParentTrackChange = (index, value) => {
    setEntries((prev) => {
      const updated = [...prev];
      updated[index].selectedTrack = value;
      return updated;
    });
  };

  const handleAddEntry = () => {
    if (error) {
      setError({ message: "Please complete all fields, then click Done." });
    } else {
      if (!(entries[entries.length - 1].name )) {
        setError({ message: "Ensure all fields are filled in." });
      } else {
        setEntries((prev) => [
          ...prev,
          { name: '', code: '', selectedTrack: '' },
          ]);
        setEntryErrors((prev) => ({ ...prev, [entries.length]: '' }));
        console.log('nadara',entries.length)
      }
    }
  };

  const handleDoneClick = (e, idx) => {
    e.preventDefault();
    if (
      entries[idx].name &&
      entries[idx].code &&
      entries[idx].selectedTrack
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

    // Check if entries are valid before sending
    for (const entry of entries) {
      if (!entry.name || !entry.code || !entry.selectedTrack) {
        setError({ message: "All strand fields must be filled out correctly." });
        setIsLoading(false);
        return;
      }
    }
    
    // Loop through all entries and create a request for each strand
    for (const entry of entries) {
      const track = allTrackData.find(
        (track) => track.name === entry.selectedTrack
      );

      // 1. Format the strand data from the form entry
      const strandData = {
        track_id: track.id,
        name: entry.name,
        code: entry.code,
      };

      // Log the single payload object to be sent for debugging
      console.log("Payload being sent to API:", strandData);

      try {
        await createStrand(strandData);
        triggerToast({
            success: true,
            title: "Strand added",
            desc: `The strand "${entry.name}" has been successfully added.`,
        });
        
        // Call the passed-down onRefresh function on successful submission
        onRefresh();
        
      } catch (err) {
        console.error("Failed to submit one or more strands:", err);
        console.error("API Response Data:", err.response?.data);
        setError(err.response?.data || { message: "An unexpected error occurred." });
        setIsLoading(false);
        return;
      }
    }
    
    console.log('All strands submitted successfully!');
    setIsLoading(false);

    // Reset the form and close the dialog
    setEntries([{name: '', code: '', selectedTrack: '' }]);
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
      <form>
        <DialogTrigger asChild>
          <Button variant="default" className="ml-2" onClick={() => setIsDialogOpen(true)}>
            <Plus /> Add
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Strand</DialogTitle>
            <DialogDescription>You are about to add a new strand.</DialogDescription>
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
                      entryErrors[idx] || (error && !entry.name)
                        ? "text-red-600 font-semibold"
                        : "text-black dark:text-muted-foreground"
                    }
                  >
                    {entry.name || `Strand information`}
                  </AccordionTrigger>
                    <AccordionContent className="flex flex-col text-balance items-center justify-center">
                      <div className="gap-2 flex flex-col items-center justify-center w-[95%]">
                        <div className="flex gap-6 items-center justify-between mt-2">
                          <div>
                            <Label
                            htmlFor={`name-${idx}`}
                            className={`mb-2 text-xs text-foreground/80 ${((entryErrors[idx] && !entry.name) || (error && !entry.name)) && "text-red-600 font-semibold"}`}
                          >
                            Strand Name *
                          </Label>
                          <Input
                            id={`name-${idx}`}
                            name="name"
                            value={entry.name}
                            onChange={(e) => handleChange(idx, e)}
                            placeholder="Strand name"
                            className={`!w-full !max-w-none ${((entryErrors[idx] && !entry.name) || (error && !entry.name)) && "border border-red-500 placeholder:text-red-400"}`}
                            required
                          />
                          </div>
                          <div>
                          <Label
                            htmlFor={`code-${idx}`}
                            className={`mb-2 text-xs text-foreground/80 ${((entryErrors[idx] && !entry.code) || (error && !entry.code)) && "text-red-600 font-semibold"}`}
                          >
                            Strand Code *
                          </Label>
                          <Input
                             id={`code-${idx}`}
                             name="code"
                            value={entry.code}
                            onChange={(e) => handleChange(idx, e)}
                            placeholder="Strand code"
                            className={`!w-full !max-w-none ${((entryErrors[idx] && !entry.code) || (error && !entry.code)) && "border border-red-500 placeholder:text-red-400"}`}
                            required
                          />
                          </div>
                        </div>
                          {trackIsLoading ? (
                            <div>Loading tracks...</div>
                          ) : (
                            <div className='w-full'> 
                              <Label
                              htmlFor={`selectedSemester-${idx}`}
                              className={`mb-2 text-xs text-foreground/80 ${((entryErrors[idx] && !entry.selectedTrack) || (error && !entry.selectedTrack)) && "text-red-600 font-semibold"}`}
                            >
                              Semester *
                            </Label>
                            <SelectComponent
                              items={allTrackData.map((s) => s.name)}
                              label="Select Parent Track"
                              value={entry.selectedTrack}
                              onChange={(value) => handleParentTrackChange(idx, value)}
                              className={`!w-full !max-w-none ${((entryErrors[idx] && !entry.selectedTrack) || (error && !entry.selectedTrack)) && "text-red-600 data-[placeholder]:text-red-400 border-red-500"}`}
                            />
                            </div>
                          )}
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
      </form>
    </Dialog>
  );
}

export default StrandFormPopover;
