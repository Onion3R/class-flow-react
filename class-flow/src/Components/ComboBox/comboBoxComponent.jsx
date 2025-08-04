// "use client"
import React, { useEffect, useState } from "react"
// import { Separator } from "@/Components/ui/separator"
import { Checkbox } from "@/Components/ui/checkbox"
// import { cn } from "@/lib/utils"


import { CirclePlus } from "lucide-react"
import { Button } from "@/Components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/Components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/Components/ui/popover"



export function ComboBox({data,label, setComboBoxHasSelectedItem, setFilterValue ,comboFilteredData}) {
  const [comboFilters, setComboFilters] = useState([])
  const [open, setOpen] = useState(false)
  const [selectedItems, setSelectedItems] = useState([])
  
      useEffect(() => {
      
      if (data && data.length > 0) {
        // --- FIX WAS MADE HERE ---
        // Changed from: const raw = data.flatMap((item) => item[comboFilteredData] || []);
        // Changed from: const unique = Array.from(new Map(raw.map((opt) => [opt.value, opt])).values());
        const formattedData = data.map(item => ({
            ...item,
            value: String(item.value) // Ensure value is a string for consistent comparison
        }));
          setComboFilters(formattedData);
        } else {
            // Added this else block to clear filters if data is empty
            setComboFilters([]);
        }

      }, [data]); 

      useEffect(() => {
         setFilterValue(selectedItems);
          setComboBoxHasSelectedItem(selectedItems.length > 0 && selectedItems.length != comboFilters.length)
         
      }, [selectedItems ])

      const toggle = (value) => {
        setSelectedItems((prev) =>
          prev.includes(value)
            ? prev.filter((v) => v !== value)
            : [...prev, value]
        )
       
      
         //
      }


  return (
    <div className="flex items-center justify-between"> 
      <Popover open={open} onOpenChange={setOpen} className="">
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-auto flex justify-between items-center border-dashed mr-1 rounded-md"
          >
            <CirclePlus className="shrink-0 " />
            <div className="hidden sm:flex">
            {
              selectedItems.length > 0 && selectedItems.length <= 3 ? selectedItems.map((value, index) => (
               
              <span className="mx-0.5 text-[13px] p-1 bg-secondary rounded" key={index}>{value}</span> 
              
             
            )) : selectedItems.length >= 3 ? 
              (<span className="mx-0.5 text-[13px] p-1 bg-secondary rounded">{selectedItems.length} selected</span>)
             : label
            }
            </div>
            <div className="flex sm:hidden">
            {selectedItems.length > 0 ? (
              (<span className="mx-0.5 text-[13px] p-1 bg-secondary rounded">{selectedItems.length} selected</span>)
            ) : (
              comboFilteredData
            )}
          </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0 rounded-lg">
          <Command>
            <CommandInput placeholder={`Search ${label}...`} />
            <CommandList>
              <CommandEmpty>No subjects found.</CommandEmpty>
              <CommandGroup>
                {comboFilters.map((comboFilter) => (
                  <CommandItem
                    key={comboFilter.value}
                    value={comboFilter.value}
                    className="rounded"
                  >
                    <Checkbox 
                      checked={selectedItems.includes(comboFilter.value)}
                      onCheckedChange={() => toggle(comboFilter.value)}
                    />
                    {comboFilter.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
          <div className="flex items-center justify-center p-0.5">
            <Button variant="ghost" className="w-full" size={'sm'} 
            onClick={()=> {
              setSelectedItems([]);
              }}>
                Clear filters
            </Button>
          </div>
        </PopoverContent>
      </Popover>
     
    </div>
  )
}
