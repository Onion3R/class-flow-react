import React from 'react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
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
function TeacherRolePopover({roles, selectedRole, setSelectedRole, disabled}) {
  return (
    <Popover >
            <PopoverTrigger asChild disabled={disabled ?? false}>
              <Button variant="outline" className="ml-2" >
                { selectedRole ? selectedRole : 'Select Role' } <ChevronDown/>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-1">
             <Command>
            <CommandInput placeholder={`Search ...`} />
            <CommandList>
              <CommandEmpty>No subjects found.</CommandEmpty>
              <CommandGroup>
                {roles.map((role) => (
                  <CommandItem
                    key={role.value}
                    value={role.value}
                    onSelect={() => setSelectedRole(role.label)}
                    className={`cursor-pointer rounded px-2 py-1 mb-1.5 ${
                      selectedRole === role.label
                        ? 'bg-muted-foreground  dark:bg-secondary '
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
            </CommandList>
          </Command>
            </PopoverContent>
          </Popover>
  )
}

export default TeacherRolePopover