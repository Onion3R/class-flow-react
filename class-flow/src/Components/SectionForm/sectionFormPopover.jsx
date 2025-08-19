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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash } from "lucide-react";
import { PulseLoader } from "react-spinners";
import { triggerToast } from '@/lib/utils/toast';

// Import the API function
import { createSection } from '@/services/apiService';

// Import the refactored hooks with their local refresh functions
import useStrandGetter from '@/lib/hooks/useStrands';
import useYearLevelsGetter from '@/lib/hooks/useYearLevels';

function SectionFormPopover({ onRefresh }) {
  const { data: allYearlevelData, isLoading: yearLevelIsLoading } = useYearLevelsGetter();
  const { data: allStrandData, isLoading: strandIsLoading } = useStrandGetter();

  // State to manage dialog's open/close state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState("");
  const [entries, setEntries] = useState([
    { name: '', selectedStrand: '', selectedYearLevel: ''},
  ]);
  
  const [error, setError] = useState(null);

  const handleChange = (index, e) => {
    const { name, value } = e.target;
    setEntries((prev) => {
      const updated = [...prev];
      updated[index][name] = value;
      return updated;
    });
  };

  const handleYearLevelChange = (index, value) => {
    setEntries((prev) => {
      const updated = [...prev];
      updated[index].selectedYearLevel = value;
      return updated;
    });
  };

  const handleStrandChange = (index, value) => {
    setEntries((prev) => {
      const updated = [...prev];
      updated[index].selectedStrand = value;
      return updated;
    });
  };

  const handleAddEntry = () => {
   setEntries((prev) => [
      ...prev,
       { name: '', selectedStrand: '', selectedYearLevel: ''},
    ]);
  };

  const handleFillingTrackInfo = (index, e) => {
    e.preventDefault();
    setActiveAccordion("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsFormSubmitting(true);
    setError(null);

    // Check for empty fields
    for (const entry of entries) {
      if (!entry.name || !entry.selectedStrand || !entry.selectedYearLevel) {
        setError({ message: "All section fields must be filled out correctly." });
        setIsFormSubmitting(false);
        return;
      }
    }

    // Loop through all entries and create a request for each section
    for (const entry of entries) {
      const strand = allStrandData.find(s => s.code === entry.selectedStrand);
      const yearLevel = allYearlevelData.find(y => y.name === entry.selectedYearLevel);
      
      if (!strand || !yearLevel) {
          setError({ message: "Could not find corresponding strand or year level IDs." });
          setIsFormSubmitting(false);
          return;
      }

      const sectionData = {
        name: entry.name,
        strand_id: strand.id,
        year_level_id: yearLevel.id,
        max_students:'20',
        is_active: false,
      };

      console.log("Payload being sent to API:", sectionData);

      try {
        await createSection(sectionData);
        triggerToast({
            success: true,
            title: "Section added",
            desc: "The section has been successfully added.",
          });
      } catch (err) {
        console.error("Failed to submit one or more sections:", err);
        console.error("API Response Data:", err.response?.data);
        setError(err.response?.data || { message: "An unexpected error occurred." });
        setIsFormSubmitting(false);
        return;
      }
    }
    
    console.log('All sections submitted successfully!');
    setIsFormSubmitting(false);

    // Call the refresh function provided by the parent
    onRefresh();
    // Reset form entries and close the dialog manually
    setEntries([{ name: '', selectedStrand: '', selectedYearLevel: ''}]);
    setIsDialogOpen(false);
  };

  const handleDeleteEntry = (index, e) => {
    e.preventDefault();
    setEntries((prev) => prev.filter((_, i) => i !== index));
    setActiveAccordion("");
  };

  const allLoading = yearLevelIsLoading || strandIsLoading || isFormSubmitting;

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="ml-2">
          <Plus /> Add
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Section</DialogTitle>
          <DialogDescription>You are about to add a new section.</DialogDescription>
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
              <Accordion
                type="single"
                collapsible
                value={activeAccordion}
                onValueChange={setActiveAccordion}
                className="w-full border-t"
                key={idx}
              >
                <AccordionItem value={itemId}>
                  <AccordionTrigger>Section Information {idx + 1}</AccordionTrigger>
                  <AccordionContent className="flex flex-col text-balance items-center justify-center">
                    <div className="gap-2 flex flex-col items-center justify-center w-[95%]">
                      <Input
                        name="name"
                        value={entry.name}
                        onChange={(e) => handleChange(idx, e)}
                        placeholder="Section name"
                        required
                      />
                      <div className="flex sm:flex-row flex-col gap-6 items-center justify-between mt-2 w-full">
                        {yearLevelIsLoading || !allYearlevelData ? (
                          <div>Loading year levels...</div>
                        ) : (
                          <SelectComponent
                            items={allYearlevelData.map((a) => a.name)}
                            label="Select year level"
                            value={entry.selectedYearLevel}
                            onChange={(value) => handleYearLevelChange(idx, value)}
                            className="!max-w-none !w-full sm:my-2 my-0 !min-w-none"
                          />
                        )}
                        {strandIsLoading || !allStrandData ? (
                          <div>Loading strands...</div>
                        ) : (
                          <SelectComponent
                            items={allStrandData.map((s) => s.code)}
                            label="Select Strand"
                            value={entry.selectedStrand}
                            onChange={(value) => handleStrandChange(idx, value)}
                            className="!max-w-none !w-full sm:my-2 my-0 !min-w-none"
                          />
                        )}
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
            <Button type="button" variant="secondary" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="default" disabled={allLoading}>
              {allLoading ? (
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

export default SectionFormPopover;
