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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash } from "lucide-react";
import { PulseLoader } from "react-spinners";

// Import the API function provided by you
import { createTrack } from '@/services/apiService';

import { triggerTrackRefresh } from '@/lib/hooks/useTracks'; 

function TrackFormPopover() {
  const [activeAccordion, setActiveAccordion] = useState("");
  const [entries, setEntries] = useState([
    { name: '', code: '' },
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
      { name: '', code: '' },
    ]);
  };

  const handleFillingTrackInfo = (index, e) => {
    e.preventDefault();
    setActiveAccordion("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Check if track entries are valid before sending
    for (const entry of entries) {
      if (!entry.name || !entry.code) {
        setError({ message: "All track fields must be filled out correctly." });
        setIsLoading(false);
        return;
      }
    }

    // Loop through all entries and create a request for each track
    for (const entry of entries) {
      // 1. Format the track data from the form entry
      const trackData = {
        name: entry.name,
        code: entry.code,
      };

      // Log the single payload object to be sent for debugging
      console.log("Payload being sent to API:", trackData);

      try {
        await createTrack(trackData);
        triggerTrackRefresh();
        setEntries([{name: '', code: '' }]);
      } catch (err) {
        console.error("Failed to submit one or more tracks:", err);
        console.error("API Response Data:", err.response?.data);
        setError(err.response?.data || { message: "An unexpected error occurred." });
        setIsLoading(false);
        return;
      }
    }
    
    console.log('All tracks submitted successfully!');
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
            <DialogTitle>Add Track</DialogTitle>
            <DialogDescription>You are about to add a new track.</DialogDescription>
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
                    <AccordionTrigger>Track Information</AccordionTrigger>
                    <AccordionContent className="flex flex-col text-balance items-center justify-center">
                      <div className="gap-2 flex flex-col items-center justify-center w-[95%]">
                        <div className="flex gap-6 items-center justify-between mt-2">
                          <Input
                            name="name"
                            value={entry.name}
                            onChange={(e) => handleChange(idx, e)}
                            placeholder="Track name"
                            required
                          />
                          <Input
                            name="code"
                            value={entry.code}
                            onChange={(e) => handleChange(idx, e)}
                            placeholder="Track code"
                            required
                          />
                        </div>
                        
                        <div className="flex w-full items-center justify-center mt-4 gap-7">
                          <Button
                            variant="outline"
                            onClick={(e) => handleFillingTrackInfo(idx, e)}
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

export default TrackFormPopover;
