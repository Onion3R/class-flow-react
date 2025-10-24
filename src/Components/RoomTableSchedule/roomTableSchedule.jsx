
import React , {useState, useEffect}from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@Components/ui/table";

// Days of the week
const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// Map short names to full names
const dayMap = {
  Mon: "Monday",
  Tue: "Tuesday",
  Wed: "Wednesday",
  Thu: "Thursday",
  Fri: "Friday",
  Sat: "Saturday",
  Sun: "Sunday",
};



// Convert 24hr time to minutes
const toMinutes = (time) => {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
};

// Convert 12hr format (e.g., "1:30 PM") to minutes
const toMinutesFrom12Hr = (time) => {
  const [timeStr, ampm] = time.split(" ");
  let [hour, minute] = timeStr.split(":").map(Number);
  if (ampm === "PM" && hour !== 12) hour += 12;
  if (ampm === "AM" && hour === 12) hour = 0;
  return hour * 60 + minute;
};

// Generate time slots from 8:00 AM to 8:30 PM, skipping lunch
const generateTimeSlots = () => {
  const slots = [];
  let start = 8 * 60;
  const end = 20 * 60 + 30;

  while (start < end) {
    if (start === 12 * 60) {
      slots.push("12:00 PM - 1:00 PM (Lunch Break)");
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

    slots.push(`${format(start)} - ${format(endTime)}`);
    start = endTime;
  }

  return slots;
};

const timeSlots = generateTimeSlots();


export default function RoomScheduleTableComponent({availability}) {
  const [roomAvailability, setRoomAvailability] = useState({})

  useEffect(() => {
    setRoomAvailability(availability)
  }, [availability])
  
  
// Check if a slot falls within a day's availability
const isSlotAvailable = (day, slot) => {
  const ranges = roomAvailability[day];
  if (!ranges) return false;

  const [startStr, endStrRaw] = slot.split(" - ");
  const endStr = endStrRaw.replace(/ \(Lunch Break\)/, "");

  const startMin = toMinutesFrom12Hr(startStr);
  const endMin = toMinutesFrom12Hr(endStr);

  return ranges.some((range) => {
    const [from, to] = range.replace(/\s/g, "").split("-");
    return startMin >= toMinutes(from) && endMin <= toMinutes(to);
  });
};
  const mergedSlots = {};

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
          {timeSlots.map((slot, i) => {
            const isLunch = slot.includes("Lunch");

            return (
              <TableRow key={i} className='hover:bg-transparent'>
                <TableCell
                  colSpan={isLunch ? days.length + 1 : 1}
                  className={`text-center ${isLunch ? "font-bold text-red-500 bg-muted/50" : "font-sm"}`}
                >
                  {isLunch ? "Lunch" : slot}
                </TableCell>

                {!isLunch &&
                  days.map((day) => {
                    const dayFull = dayMap[day];
                    const ranges = roomAvailability[dayFull] || [];
                    const [slotStartStr] = slot.split(" - ");
                    const slotMin = toMinutesFrom12Hr(slotStartStr);

                    for (let range of ranges) {
                      const [from, to] = range.replace(/\s/g, "").split("-");
                      const rangeStart = toMinutes(from);
                      const rangeEnd = toMinutes(to);
                      const spanCount = (rangeEnd - rangeStart) / 30;

                      if (slotMin === rangeStart) {
                        for (let offset = 1; offset < spanCount; offset++) {
                          mergedSlots[`${day}-${slotMin + offset * 30}`] = true;
                        }

                        return (
                          <TableCell
                            key={`${day}-${slotMin}`}
                            rowSpan={spanCount}
                            className="text-center bg-accent font-semibold border-2"
                          >
                            Available
                          </TableCell>
                        );
                      }

                      if (slotMin > rangeStart && slotMin < rangeEnd && mergedSlots[`${day}-${slotMin}`]) {
                        return null;
                      }
                    }

                    const available = isSlotAvailable(dayFull, slot);
                    return (
                      <TableCell
                        key={`${day}-${i}`}
                        className={`text-center border-2 ${
                          available ? "bg-red-50 font-semibold" : "bg-muted/30 text-muted-foreground"
                        }`}
                      >
                        {available ? "Available" : ""}
                      </TableCell>
                    );
                  })}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}