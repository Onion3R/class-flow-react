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

export default function DatePickerComponent({ setData, className }) {
  const [open, setOpen] = useState(false)
  const [date, setDate] = useState(undefined)

  return (
    <div className="w-full">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
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
       <PopoverContent
            className="w-auto overflow-hidden p-0 relative z-[3000]"
            align="start"
            side="bottom"
            sideOffset={8}
            forceMount
            initialFocus
          >
          <Calendar
            mode="single"
            selected={date}
            captionLayout="dropdown"
            onSelect={(selectedDate) => {
              setDate(selectedDate)
              setData(selectedDate)
              setOpen(false)
            }}
            fromYear={2025}
            toYear={2035}
             className="pointer-events-auto p-3"
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
