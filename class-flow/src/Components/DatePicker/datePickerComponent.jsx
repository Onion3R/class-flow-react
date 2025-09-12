"use client"

import React, { useState } from "react"
import { ChevronDownIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export default function DatePickerComponent({ setData, className}) {
  const [open, setOpen] = useState(false)
  const [date, setDate] = useState(undefined)

  return (
    <div className="w-full">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild className>
          <Button
            variant="outline"
            id="date"
            className={`w-full justify-between font-normal hover:bg-transparent hover:text-red ${
              date ? "" : "text-muted-foreground"
            } ${className}`}
          >


            {date ? date.toLocaleDateString() : "Select date"}
            <ChevronDownIcon className="text-gray-400/80" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            captionLayout="dropdown"
            onSelect={(selectedDate) => {
              setDate(selectedDate)       // updates local state for display
              setData(selectedDate)       // sends data to parent
              setOpen(false)              // closes popover
            }}
            fromYear={2025}
            toYear={2035}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
