"use client";

import { useState, useEffect, useMemo } from "react";
import { AlertCircleIcon, Plus } from "lucide-react";
import { Alert, AlertTitle } from "../ui/alert";
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
import { triggerToast } from '@/lib/utils/toast';
import SelectComponent from "../Select/selectComponent";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PulseLoader } from "react-spinners";
import semesterGetter from "@/lib/hooks/useSemester";
import DatePickerComponent from "../DatePicker/datePickerComponent";
import { createSchedule } from "@/app/services/apiService";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { scheduleSchema } from "@/app/schema/schema";
function ScheduleFormPopover({ onRefresh }) {
  const { data: allSemesterData, isLoading: semesterIsLoading } = semesterGetter();
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [scheduleName, setScheduleName] = useState("");
  const [academicYear, setAcademicYear] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");

   const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (startDate) {
      console.log("Selected Start Date:", startDate);
    }
  }, [startDate]);

  const semesterId = useMemo(() => {
  return allSemesterData.find((e) => e.name === selectedSemester)?.id;
    }, [allSemesterData, selectedSemester])

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!startDate || !endDate || !academicYear || !scheduleName || !selectedSemester) {
      setError({ message: "Please fill all fields" });
      setIsLoading(false);
      return;
    }

    const formattedStartDate = `${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, "0")}-${String(startDate.getDate()).padStart(2, "0")}`;
    const formattedEndDate = `${endDate.getFullYear()}-${String(endDate.getMonth() + 1).padStart(2, "0")}-${String(endDate.getDate()).padStart(2, "0")}`;
   
    
    const scheduleData = {
      semester_id: semesterId,
      title: scheduleName,
      academic_year: academicYear,
      start_date: formattedStartDate,
      end_date: formattedEndDate,
      is_active: true,
    };

    try {
  await scheduleSchema.validate(scheduleData, { abortEarly: false });
  await createSchedule(scheduleData);

  triggerToast({
    success: true,
    title: "Schedule added",
    desc: `The schedule "${scheduleName}" has been successfully added.`,
  });

  setIsDialogOpen(false);
  setAcademicYear('');
  setScheduleName('');
  setSelectedSemester('');
  setStartDate('');
  setEndDate('');
  setError('');
} catch (err) {
  if (err.name === 'ValidationError') {
    setError({
      message: Array.isArray(err.errors) ? err.errors[0] : err.message,
    });
  } else {
    setError({ message: err?.message || "Something went wrong." });
  }
  return;
} finally {
  setIsLoading(false);
  onRefresh();
}

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
          <DialogTitle>Add Schedule</DialogTitle>
          <DialogDescription>You are about to create a new schedule.</DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive" className="border-red-500  bg-red-100 dark:bg-red-900/30">
            <AlertCircleIcon className="h-4 w-4" />
            <AlertTitle className="!truncate-none !whitespace-normal !break-words">
              Error:
              <span className="!text-sm font-normal ml-1">{error.message}</span>
            </AlertTitle>
          </Alert>
        )}
          <Separator />
        <form onSubmit={handleSubmit} className="flex flex-col w-full px-2">
          <div>
            <Label
              htmlFor='name'
              className={`mb-2 text-xs text-foreground/80 ${(!scheduleName && error)&& "text-red-600 font-semibold"}`}
            >
              Name *
            </Label>
            <Input
            id='name'
            type="text"
            placeholder="Example"
            value={scheduleName}
            onChange={(e) => setScheduleName(e.target.value)}
            className={`!w-full !max-w-none ${(!scheduleName && error)  ? "text-red-600 border-red-500" : ""}`}
            required
          />
          </div>
          

          <div className="flex my-4 gap-5 w-full ">
            <div className="w-[50%] ">
               <Label
              htmlFor='year'
              className={`mb-2 text-xs text-foreground/80 ${(!academicYear && error)&& "text-red-600 font-semibold"}`}
            >
              Academic Year *
            </Label>
            <Input
              id='year'
              type="text"
              placeholder="2024-2025"
              value={academicYear}
              onChange={(e) => setAcademicYear(e.target.value)}
              className={`!w-full !max-w-none ${(!academicYear && error)  ? "text-red-600 border-red-500" : ""}`}
              required
            />
            </div>
            
            <div className="w-[50%]">
               <Label
              htmlFor='name'
              className={`mb-2 text-xs text-foreground/80 ${(!selectedSemester && error)&& "text-red-600 font-semibold"}`}
            >
              Semester *
            </Label>
             <SelectComponent
              items={allSemesterData?.map((s) => s.name) ?? []}
              label="Semester"
              value={selectedSemester}
              onChange={setSelectedSemester}
              className={`!w-full !max-w-none ${(!selectedSemester && error)  ? "text-red-600 data-[placeholder]:text-red-400 border-red-500" : ""}`}
            />
            </div>
           
          </div>
          <div>
              <Label
              htmlFor='name'
              className={`mb-2 text-xs text-foreground/80 ${((!startDate || !endDate) && error)&& "text-red-600 font-semibold"}`}
            >
              Date Range *
            </Label>
            <div className="flex gap-5">
              <DatePickerComponent
                setData={setStartDate}
                className={`!w-full !max-w-none ${(!startDate && error) ? "text-red-400 border-red-500" : ""}`}
              />
              <DatePickerComponent
                setData={setEndDate}
                className={`!w-full !max-w-none ${(!endDate && error)  ? "text-red-400 border-red-500" : ""}`}
              />
            </div>
          </div>
          

          <DialogFooter className="flex gap-2 justify-end mt-4">
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" variant="default" disabled={isLoading}>
              {isLoading ? <PulseLoader size={8} color="#ffffff" /> : "Add"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default ScheduleFormPopover;
