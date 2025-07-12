import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

// Generate time slots from 8:00 AM to 8:30 PM
const generateTimeSlots = () => {
  const slots = []
  let start = 8 * 60 // 8:00 AM
  const end = 20 * 60 + 30 // 8:30 PM

  while (start < end) {
    // Skip 12:00 PM to 1:00 PM as a special "Lunch Break" slot
    if (start === 12 * 60) {
      slots.push("12:00 PM - 1:00 PM (Lunch Break)")
      start += 60 // Skip full hour
      continue
    }

    const endTime = start + 30
    const format = (min) => {
      const h = Math.floor(min / 60)
      const m = min % 60
      const ampm = h >= 12 ? "PM" : "AM"
      const h12 = h % 12 === 0 ? 12 : h % 12
      return `${h12}:${m.toString().padStart(2, "0")} ${ampm}`
    }

    slots.push(`${format(start)} - ${format(endTime)}`)
    start = endTime
  }

  return slots
}

const timeSlots = generateTimeSlots()

export default function ScheduleTableComponent() {
  return (
      <div className="overflow-hidden border bg-white dark:bg-black rounded-md">
     
      <Table >
        <TableHeader className=" text-center !hover:bg-none">
          <TableRow>
            <TableHead className="w-44">Time</TableHead>
            {days.map((day) => (
              <TableHead key={day} className="text-center ">{day}</TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
         {timeSlots.map((slot, i) => (
            <TableRow key={i}>
              {!slot.includes('Lunch') && (
                <TableCell
                  colSpan={1}
                  className={`font-sm`}
                >
                  {slot}
                </TableCell>
              )}

              {slot.includes('Lunch') && (
                <TableCell
                  colSpan={days.length+1}
                  className="text-center font-bold text-red-500 bg-muted/50"
                >
                  Lunch
                </TableCell>
              )}

              {/* Only show the day columns if it's NOT a lunch row */}
              {!slot.includes('Lunch') &&
                days.map((day) => (
                  <TableCell
                    key={`${day}-${i}`}
                    className="text-center border-2 border-accent"
                  >
                    {/* Your content here */}
                  </TableCell>
                ))}
            </TableRow>
          ))}

        </TableBody>
          
      </Table>
    </div>
  )
}
