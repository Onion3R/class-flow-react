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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash ,AlertCircleIcon} from "lucide-react";
import { PulseLoader } from "react-spinners";
import { Alert, AlertTitle } from "@/components/ui/alert"
import { Label } from '../../../../../components/ui/label';
// Import the API function provided by you
import { createTrack } from '@/app/services/apiService';
import { triggerToast } from '@/lib/utils/toast'; 
import { trackSchema } from '@/app/schema/schema';



// This component now accepts an 'onRefresh' function as a prop.
// We no longer need to import the global triggerTrackRefresh function.
function TrackFormPopover({ onRefresh }) {

   const [openAccordionItem, setOpenAccordionItem] = useState("");
  const [entries, setEntries] = useState([
    { name: '', code: '' },
  ]);

  const [entryErrors, setEntryErrors] = useState(() => ({ [entries.length]: true }));
  const [error, setError] = useState(null);
  // State to manage the Dialog's open/closed state
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // State for API call feedback
  const [isLoading, setIsLoading] = useState(false);

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
      if (!(entries[entries.length - 1].code )) {
        setError({ message: "Ensure all fields are filled in." });
      } else {
        setEntries((prev) => [...prev, { code: '', name: '' }]);
        setEntryErrors((prev) => ({ ...prev, [entries.length]: '' }));
        console.log('nadara',entries.length)
      }
    }
    
  };

  const handleDoneClick = (e , idx) => {
    e.preventDefault();
    if (
      entries[idx].code &&
      entries[idx].name  
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
      await trackSchema.validate(entry, { abortEarly: false });
    } catch (validationError) {
      console.log(validationError.errors)
      setError({ message: Array.isArray(validationError.errors) ? validationError.errors[0]  : validationError.errors});
      setIsLoading(false);
      return;
    }
  }

  // ✅ If validation passed, continue API calls
  for (const entry of entries) {
    const trackData = {
      name: entry.name,
      code: entry.code,
    };

    console.log("Payload being sent to API:", trackData);

    try {
      await createTrack(trackData);
      triggerToast({
        success: true,
        title: "Track added",
        desc: `The track "${entry.name}" has been successfully added.`,
      });

      onRefresh();
    } catch (error) {
      console.error("Failed to submit one or more tracks:", error);
      setError({message: error.response.data.code} || { message: "An unexpected error occurred." });
      setIsLoading(false);
      return;
    }
  }

  console.log("All tracks submitted successfully!");
  setIsLoading(false);
  setEntries([{ name: "", code: "" }]);
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
            <DialogTitle>Add Track</DialogTitle>
            <DialogDescription>You are about to add a new track.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="flex flex-col w-full">
            {/* Display error message if present */}
             {error && (
           <Alert variant="destructive" className="border-red-500  mb-4  bg-red-100 dark:bg-red-900/30">
              <AlertCircleIcon className="h-4 w-4" />
              <AlertTitle className=" !break-words ">
                Error:
                <span className="!text-sm font-normal ml-1">
                  {error.message}
                </span>
              </AlertTitle>
            </Alert> ) }
            
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
                    {entry.name || `Track information`}
                  </AccordionTrigger>
                    <AccordionContent className="flex flex-col text-balance items-center justify-center">
                      <div className="gap-2 flex flex-col items-center justify-center w-[95%]">
                        <div className="flex gap-6 items-center justify-between mt-2">
                            <div>
                          <Label
                            htmlFor={`name-${idx}`}
                            className={`mb-2 text-xs text-foreground/80 ${((entryErrors[idx] && !entry.name) || (error && !entry.name)) && "text-red-600 font-semibold"}`}
                          >
                            Track Name *
                          </Label>
                          <Input
                            name='name'
                            id={`name-${idx}`}
                            value={entry.name}
                            onChange={(e) => handleChange(idx, e)}
                            placeholder="Arts and Design Track"
                            className={`!w-full !max-w-none ${((entryErrors[idx] && !entry.name) || (error && !entry.name)) && "border border-red-500 placeholder:text-red-400"}`}
                            required
                          />
                          </div>
                          <div>
                            <Label
                              htmlFor={`code-${idx}`}
                              className={`mb-2 text-xs text-foreground/80 ${((entryErrors[idx] && !entry.code) || (error && !entry.code)) && "text-red-600 font-semibold"}`}
                            >
                              Track Code *
                            </Label>
                          <Input
                            name='code'
                            id={`code-${idx}`}
                            value={entry.code}
                            onChange={(e) => handleChange(idx, e)}
                            placeholder="A&D"
                            className={`!w-full !max-w-none ${((entryErrors[idx] && !entry.code) || (error && !entry.code)) && "border border-red-500 placeholder:text-red-400"}`}
                            required
                          />
                          </div>
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
                              onClick={(e) => handleDeleteEntry(idx)}
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

export default TrackFormPopover;
