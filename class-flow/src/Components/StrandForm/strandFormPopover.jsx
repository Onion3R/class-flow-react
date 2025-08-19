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
import SelectComponent from '../Select/selectComponent';
import { triggerToast } from '@/lib/utils/toast';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash } from "lucide-react";
import { PulseLoader } from "react-spinners";

// Import the API function provided by you
import useTrackGetter from '@/lib/hooks/useTracks';
import { createStrand } from '@/services/apiService';


// This component now accepts an 'onRefresh' function as a prop.
// The global triggerStrandRefresh function is no longer needed.
function StrandFormPopover({ onRefresh }) {
  const { data: allTrackData, isLoading: trackIsLoading} = useTrackGetter()
  const [activeAccordion, setActiveAccordion] = useState("");
  const [entries, setEntries] = useState([
    { name: '', code: '' , selectedTrack: ''},
  ]);
  
  // State to manage the Dialog's open/closed state
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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

  const handleParentTrackChange = (index, value) => {
    setEntries((prev) => {
      const updated = [...prev];
      updated[index].selectedTrack = value;
      return updated;
    });
  };

  const handleAddEntry = () => {
    setEntries((prev) => [
      ...prev,
      { name: '', code: '', selectedTrack: '' },
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

  const handleDeleteEntry = (index, e) => {
    e.preventDefault();
    setEntries((prev) => prev.filter((_, i) => i !== index));
    setActiveAccordion("");
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
                    <AccordionTrigger>Strand Information</AccordionTrigger>
                    <AccordionContent className="flex flex-col text-balance items-center justify-center">
                      <div className="gap-2 flex flex-col items-center justify-center w-[95%]">
                        <div className="flex gap-6 items-center justify-between mt-2">
                          <Input
                            name="name"
                            value={entry.name}
                            onChange={(e) => handleChange(idx, e)}
                            placeholder="Strand name"
                            required
                          />
                          <Input
                            name="code"
                            value={entry.code}
                            onChange={(e) => handleChange(idx, e)}
                            placeholder="Strand code"
                            required
                          />
                        </div>
                          {trackIsLoading ? (
                            <div>Loading tracks...</div>
                          ) : (
                            <SelectComponent
                              items={allTrackData.map((s) => s.name)}
                              label="Select Parent Track"
                              value={entry.selectedTrack}
                              onChange={(value) => handleParentTrackChange(idx, value)}
                              className="!max-w-none !w-full my-2 !min-w-none"
                            />
                          )}
                        <div className="flex w-full items-center justify-center mt-4 gap-7">
                          <Button
                            variant="outline"
                            onClick={(e) => handleFillingTrackInfo(idx, e)}
                            className="flex-1 w-full"
                          >
                            Done
                          </Button>
                          {/* Only show the delete button if there's more than one entry */}
                          {entries.length > 1 && (
                            <Button
                              onClick={(e) => handleDeleteEntry(idx, e)}
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
