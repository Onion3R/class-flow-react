import React, { useEffect, useState, useMemo } from "react";
import { getScheduleClasses, getYearLevels } from "@/services/apiService";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";


const timeToMinutes = (timeStr) => {
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours * 60 + minutes;
};

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const generateTimeSlots = () => {
  const slots = [];
  let start = 8 * 60;
  const end = 20 * 60 + 30;

  while (start < end) {
    if (start === 12 * 60) {
      slots.push({
        display: "12:00 PM - 1:00 PM (Lunch Break)",
        startMinutes: start,
        endMinutes: start + 60,
        isLunch: true,
      });
      start += 60;
      continue;
    }

    const endTime = start + 30;
    const format = (min) => {
      const h = Math.floor(min / 60);
      const m = min % 60;
      const ampm = h >= 12 ? "PM" : "AM";
      const h12 = h % 12 === 0 ? 12 : h % 12;
      return `${h12}:${m.toString().padStart(2, "0")} ${ampm}`;
    };

    slots.push({
      display: `${format(start)} - ${format(endTime)}`,
      startMinutes: start,
      endMinutes: endTime,
      isLunch: false,
    });

    start = endTime;
  }

  return slots;
};

const timeSlots = generateTimeSlots();

export default function ScheduleTableComponent({schedules}) {
  const [scheduledClasses, setScheduledClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const targetScheduleName = "Third Year second semester sy. 2025-2026 - Junior(3rd year) - Third Year second semester sy. 2025-2026";
  const targetSectionName = "A (Junior(3rd year))";

  useEffect(() => {
    // const fetchSchedule = async () => {
    //   try {
    //     setLoading(true);
    //     const data = await getScheduleClasses();
    //     const filtered = data.filter(
    //       (c) => c.generated_schedule === targetScheduleName &&
    //              c.section_name === targetSectionName
    //     );
    //     setScheduledClasses(filtered);
    //   } catch (err) {
    //     console.error("Error fetching:", err);
    //     setError("Failed to load schedule");
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // fetchSchedule();

     const fetchSchedule = async () => {
      try {
        setLoading(true);    
        setScheduledClasses(schedules);
      } catch (err) {
        console.error("Error fetching:", err);
        setError("Failed to load schedule");
      } finally {
        setLoading(false);
      }
    };
    fetchSchedule();
    
  }, [schedules]);

  const scheduleGrid = useMemo(() => {
    const grid = days.map(() => Array(timeSlots.length).fill(null));
    const occupied = {};

    scheduledClasses.forEach((item) => {
      const dayIndex = days.indexOf(item.day);
      if (dayIndex === -1) return;

      const startMin = timeToMinutes(item.start_time);
      const endMin = timeToMinutes(item.end_time);

      let startSlot = -1;
      let span = 0;

      timeSlots.forEach((slot, index) => {
        const slotStartsBeforeClassEnds = slot.startMinutes < endMin;
        const slotEndsAfterClassStarts = slot.endMinutes > startMin;

        if (slotStartsBeforeClassEnds && slotEndsAfterClassStarts) {
          if (startSlot === -1) startSlot = index;
          span++;
        }
      });

      if (startSlot !== -1) {
        grid[dayIndex][startSlot] = { classItem: item, rowSpan: span };
        for (let i = 1; i < span; i++) {
          occupied[`${dayIndex}-${startSlot + i}`] = true;
        }
      }
    });

    return { grid, occupied };
  }, [scheduledClasses]);

  if (loading) return <div className="p-4 text-center">Loading schedule...</div>;
  if (error) return <div className="p-4 text-center text-red-500">{error}</div>;

  return (
    <div className="overflow-hidden border bg-white dark:bg-black rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-44">Time</TableHead>
            {days.map((day) => (
              <TableHead key={day} className="text-center">{day}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {timeSlots.map((slot, rowIdx) => (
            <TableRow key={rowIdx}>
              {slot.isLunch ? (
                <TableCell colSpan={days.length + 1} className="text-center font-bold text-red-500 bg-muted/50">
                  Lunch Break
                </TableCell>
              ) : (
                <>
                  <TableCell className="font-sm w-44">{slot.display}</TableCell>
                  {days.map((_, colIdx) => {
                    const key = `${colIdx}-${rowIdx}`;
                    if (scheduleGrid.occupied[key]) return null;

                    const cell = scheduleGrid.grid[colIdx][rowIdx];
                    if (cell) {
                      const { classItem, rowSpan } = cell;
                      return (
                        <TableCell
                          key={key}
                          rowSpan={rowSpan}
                          className="text-center border-2 border-accent p-2 max-w-[70px] !min-w-[70px] align-center bg-gray-600/10 hover:  "
                        >
                          <div className="flex flex-col justify-center items-center  text-accent-foreground h-full min-h-full py-2 px-1 break-words text-wrap w-full">
                            <span className="w-full break-words text-center text-[12px] font-semibold">
                              {classItem.subject_title}
                            </span>
                            {/* <span className="">({classItem.class_type})</span> */}
                            <span>{classItem.room}</span>
                            <span>{classItem.instructor_name}</span>
                            {/* <span>{classItem.section_name.split('(')[0].trim()}</span> */}
                          </div>
                        </TableCell>


                      );
                    }

                    return (
                      <TableCell
                        key={key}
                        className="text-center border-2 border-muted p-1 min-h-[40px]"
                      />
                    );
                  })}
                </>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
