import React from 'react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Button } from '../ui/button'
import {  ChevronDown} from 'lucide-react'
function TeacherRolePopover({roles, selectedRole, setSelectedRole, setRoleId, disabled}) {
 return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="ml-2" disabled={disabled ?? false}>
          {selectedRole || 'Select Role'} <ChevronDown />
        </Button>
      </PopoverTrigger>

      {/* 👇 Important: give it a high z-index so it's above the Dialog overlay */}
       <PopoverContent
    side="bottom"
    align="center"
    className="w-auto p-1  pointer-events-auto"
  >
        <Command>
      <CommandInput placeholder="Search..." />
      <CommandList>
        <CommandEmpty>No roles found.</CommandEmpty>
        {roles?.length > 0 && (
          <CommandGroup>
            {roles.map((role) => (
              <CommandItem
                key={role.value}
                value={role.value}
                onSelect={() => {
                  setSelectedRole(role.label);
                  setRoleId(role.id);
                  }}
                className={`cursor-pointer rounded px-2 py-1 mb-1.5 !hover:bg-red ${
                  selectedRole === role.label
                    ? 'bg-muted'
                    : ''
                }`}
              >
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{role.label}</span>
                  <span className="text-muted-foreground text-xs">{role.desc}</span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>
    </Command>
      </PopoverContent>
    </Popover>
  )
}

export default TeacherRolePopover


