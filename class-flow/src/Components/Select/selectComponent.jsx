import * as React from "react"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
export default function SelectComponent({disabled, items, label, value, onChange, className }) {

  
  return (
    <Select disabled={disabled} value={value} onValueChange={onChange} >
   <SelectTrigger className={`w-[180px] min-w-[70px] max-w-[200px] sm:min-w-0  ${className} `} >

        <SelectValue  placeholder={label + " " +"Options"} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>{label}</SelectLabel>
          {items.map((item, index) => (
             <SelectItem value={item} key={index}>{item}</SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
