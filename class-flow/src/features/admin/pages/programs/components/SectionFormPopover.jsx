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
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import SelectComponent from '../../../../../components/Select/selectComponent';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from '../../../../../components/ui/label';
import { Plus, Trash ,  AlertCircleIcon} from "lucide-react";
import { PulseLoader } from "react-spinners";
import { triggerToast } from '@/lib/utils/toast';
import { Alert, AlertTitle } from "@/components/ui/alert"
import { Switch } from '@/components/ui/switch';
// Import the API function
import { createSection } from '@/app/services/apiService';

// Import the refactored hooks with their local refresh functions
import useStrandGetter from '@/lib/hooks/useStrands';
import useYearLevelsGetter from '@/lib/hooks/useYearLevels';
import { sectionSchema } from '@/app/schema/schema';

function SectionFormPopover({ onRefresh }) {
  const { data: allYearlevelData, isLoading: yearLevelIsLoading } = useYearLevelsGetter();
  const { data: allStrandData, isLoading: strandIsLoading } = useStrandGetter();

  const [isLoading, setIsLoading] = useState(false)
  // State to manage dialog's open/close state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);
  const [entries, setEntries] = useState([
    { name: '', selectedStrand: '', selectedYearLevel: '', is_active: null},
  ]);

  const [openAccordionItem, setOpenAccordionItem] = useState("");
  const [entryErrors, setEntryErrors] = useState(() => ({ [entries.length]: true }));
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
    if (error) {
      setError({ message: "Please complete all fields, then click Done." });
    } else {
      if (!(entries[entries.length - 1].name )) {
        setError({ message: "Ensure all fields are filled in." });
      } else {
        setEntries((prev) => [...prev,  { name: '', selectedStrand: '', selectedYearLevel: '', is_active: null}]);
        setEntryErrors((prev) => ({ ...prev, [entries.length]: '' }));
        console.log('nadara',entries.length)
      }
    }
    // Add a new entry with initial values for all fields, but don't automatically open it.
  };

  const handleDoneClick = (e,idx) => {
    e.preventDefault();
    // Close the current accordion item
    if (
      entries[idx].name &&
      entries[idx].selectedStrand &&
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
    setIsFormSubmitting(true);
    setError(null);
    setIsLoading(true)

    // Check for empty fields
    for (const entry of entries) {
      if (!entry.name || !entry.selectedStrand || !entry.selectedYearLevel) {
        setError({ message: "All section fields must be filled out correctly." });
        setIsFormSubmitting(false);
        setIsLoading(false)
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
        setIsLoading(false)
        return;
      }

      const sectionData = {
        name: entry.name,
        strand_id: strand.id,
        year_level_id: yearLevel.id,
        max_students:'20',
        is_active: entry.is_active ?? false,
      };
      try {
        await sectionSchema.validate(sectionData, {abortEarly: false})
      } catch (validationError) { 
        setError({message: Array.isArray(validationError.errors) ? validationError.errors[0] : validationError.errors})
        setIsLoading(false)
        return;
      }

      console.log("Payload being sent to API:", sectionData);

      try {
        await createSection(sectionData);
        triggerToast({
          success: true,
          title: "Section added",
          desc: `The section "${entry.name}" has been successfully added.`,
        });
      } catch (err) {
        console.error("Failed to submit one or more sections:", err);
        console.error("API Response Data:", err.response?.data);
        setError(err.response?.data || { message: "An unexpected error occurred." });
        setIsFormSubmitting(false);
        setIsLoading(false)
        return;
      }
    }
    
    console.log('All sections submitted successfully!');
    setIsFormSubmitting(false);

    // Call the refresh function provided by the parent
    onRefresh();
    // Reset form entries and close the dialog manually
    setEntries([{ name: '', selectedStrand: '', selectedYearLevel: '', is_active: null}]);
    setIsDialogOpen(false);
    setIsLoading(false)
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
    setIsLoading(false)
  };

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
                    {entry.name || `Subject information`}
                  </AccordionTrigger>
                  <AccordionContent className="flex flex-col text-balance items-center justify-center">
                    <div className="gap-2 flex flex-col items-center justify-center w-[95%]">
                      <div className='w-full'>
                        <Label
                          htmlFor={`name-${idx}`}
                          className={`mb-2 text-xs text-foreground/80 ${((entryErrors[idx] && !entry.name) || (error && !entry.name)) && "text-red-600 font-semibold"}`}
                        >
                          Section Name *
                        </Label>
                        <Input
                          id={`name-${idx}`}
                          name="name"
                          value={entry.name}
                          onChange={(e) => handleChange(idx, e)}
                          placeholder="Section name"
                          required
                          className={`!w-full !max-w-none ${((entryErrors[idx] && !entry.name) || (error && !entry.name)) && "border border-red-500 placeholder:text-red-400"}`}
                        />
                      </div>
                      <div className="flex sm:flex-row flex-col items-center justify-between w-full gap-2 sm:gap-6">
                        {yearLevelIsLoading || !allYearlevelData ? (
                          <div>Loading year levels...</div>
                        ) : (
                          <div className='w-full md:w-[50%]'>
                            <Label
                              htmlFor={`selectedYearLevel-${idx}`}
                              className={`mb-2 text-xs text-foreground/80 ${((entryErrors[idx] && !entry.selectedYearLevel) || (error && !entry.selectedYearLevel)) && "text-red-600 font-semibold"}`}
                            >
                              Year Level *
                            </Label>
                            <SelectComponent
                              items={allYearlevelData.map((a) => a.name)}
                              label="Year level"
                              value={entry.selectedYearLevel}
                              onChange={(value) => handleChange(idx, { target: { name: 'selectedYearLevel', value } })}
                              className={`!w-full !max-w-none ${((entryErrors[idx] && !entry.selectedYearLevel) || (error && !entry.selectedYearLevel)) && "text-red-600 data-[placeholder]:text-red-400 border-red-500"}`}
                              required
                            />
                          </div>
                        )}
                        {strandIsLoading || !allStrandData ? (
                          <div>Loading strands...</div>
                        ) : (
                          <div className='w-full md:w-[50%]'>
                            <Label
                              htmlFor={`selectedStrand-${idx}`}
                              className={`mb-2 text-xs text-foreground/80 ${((entryErrors[idx] && !entry.selectedStrand) || (error && !entry.selectedStrand)) && "text-red-600 font-semibold"}`}
                            >
                              Strand *
                            </Label>
                            <SelectComponent
                              items={allStrandData.map((s) => s.code)}
                              label="Strand"
                              value={entry.selectedStrand}
                              onChange={(value) => handleChange(idx, { target: { name: 'selectedStrand', value } })}
                              className={`!w-full !max-w-none ${((entryErrors[idx] && !entry.selectedStrand) || (error && !entry.selectedStrand)) && "text-red-600 data-[placeholder]:text-red-400 border-red-500"}`}
                            />
                          </div>
                        )}
                      </div>
                      <Card className='w-full p-0 mt-2 shadow-xs'>
                        <div className='flex p-4 items-center'>
                          <Label className="flex-col items-start gap-1">
                            <span className="text-sm p-0">Set Section Active?</span>
                            <span className="text-sm font-normal text-muted-foreground">
                              Inactive sections won't appear in created schedules. You can disable instead of delete.
                            </span>
                          </Label>
                          <Switch
                            checked={entry.is_active}
                            onCheckedChange={(value) => handleChange(idx, { target: { name: 'is_active', value } })}
                          />
                        </div>
                      </Card>
                      <div className="flex w-full items-center justify-center mt-2 gap-7">
                        <Button
                          variant="outline"
                          onClick={(e) => handleDoneClick(e,idx)}
                          className="flex-1 w-full"
                        >
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
            <Button type="submit" variant="default" disabled={isLoading || isFormSubmitting}>
              {isLoading ? (
                'Loading...'
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
