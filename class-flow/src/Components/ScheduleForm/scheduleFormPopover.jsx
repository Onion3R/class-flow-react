"use client";

import { useState, useEffect } from "react";
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
import SelectComponent from "../Select/selectComponent";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { PulseLoader } from "react-spinners";
import semesterGetter from "@/lib/hooks/useSemester";
import DatePickerComponent from "../DataPicker/datePickerComponent";
import { createSchedule } from "@/services/apiService";
import { triggerScheduleRefresh } from "@/lib/hooks/useSchedules";
triggerScheduleRefresh
function ScheduleFormPopover() {
  const { data: allSemesterData, isLoading: semesterIsLoading } = semesterGetter();
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [scheduleName, setScheduleName] = useState("");
  const [academicYear, setAcademicYear] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (startDate) {
      console.log("Selected Start Date:", startDate);
    }
  }, [startDate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
     const formattedStartDate = `${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, "0")}-${String(startDate.getDate()).padStart(2, "0")}`;
      const formattedEndDate = `${endDate.getFullYear()}-${String(endDate.getMonth() + 1).padStart(2, "0")}-${String(endDate.getDate()).padStart(2, "0")}`;
      const semesterId = allSemesterData.find((e) => e.name = selectedSemester)?.id
      alert(`start: ${formattedStartDate}, end: ${formattedEndDate}`);

      const scheduleData = 
        {
          semester_id: semesterId,
          title: scheduleName,
          academic_year: academicYear,
          start_date: formattedStartDate,
          end_date: formattedEndDate,
          is_active: true,
        }
      

    try {
       console.log(scheduleData)
      await createSchedule(scheduleData)
      triggerScheduleRefresh()
      // await submitSchedule(scheduleData); // ← your API call here
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog>
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

        <form onSubmit={handleSubmit} className="flex flex-col w-full">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              <strong>Error:</strong> {error.message}
            </div>
          )}

          <Input
            type="text"
            placeholder="Schedule name"
            value={scheduleName}
            onChange={(e) => setScheduleName(e.target.value)}
            required
          />

          <div className="flex my-4 gap-5">
            <Input
              type="text"
              placeholder="Academic year"
              value={academicYear}
              onChange={(e) => setAcademicYear(e.target.value)}
              required
            />
            <SelectComponent
              items={allSemesterData?.map((s) => s.name) ?? []}
              label="Semester"
              value={selectedSemester}
              onChange={setSelectedSemester}
              className="!max-w-none !w-full !min-w-none"
            />
          </div>

          <div className="flex gap-5">
            <DatePickerComponent setData={setStartDate} />
            <DatePickerComponent setData={setEndDate} />
          </div>

          <DialogFooter className="flex gap-2 justify-end mt-4">
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Cancel
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button type="submit" variant="default" disabled={isLoading}>
                {isLoading ? <PulseLoader size={8} color="#ffffff" /> : "Add"}
              </Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default ScheduleFormPopover;
