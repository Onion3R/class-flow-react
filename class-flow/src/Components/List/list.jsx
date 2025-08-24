import React, {useState}from 'react';
import { Plus } from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import useSubjectsGetter from '@/lib/hooks/useSubjects';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardAction,
  CardTitle,
} from "@/components/ui/card";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { addSpecializationToTeacher } from '@/services/apiService';
export default function SubjectList({teachersId, onRefresh}) {
  const [open, setOpen] = useState(false)
  const { data: subjects, isLoading } = useSubjectsGetter();

  const handleAssign = async (subjectId) => {
    console.log(`Assigning subject with ID: ${subjectId}`);
    try {
      if(teachersId && subjectId) {
          const data ={
        teacher_id: Number(teachersId),
        subject_id: subjectId,
        proficiency_level: 'Proficient'
      }
      console.log('Data to be sent:', data);
       await addSpecializationToTeacher( data ).then(() => {
         console.log(`Successfully assigned subject with ID: ${subjectId}`);
       });
      onRefresh();
      }
    } catch (error) {
        console.log('Error assigning subject:', error);
    }

  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="default">Assign</Button>
      </PopoverTrigger>

      <PopoverContent className="p-0 w-[400px]" side="left" align="center" sideOffset={8}>
        <Card className="bg-transparent border-none shadow-none m-0 w-full gap-4">
          <CardHeader className="px-4">
            <CardTitle>Subject</CardTitle>
            <CardDescription>Add subjects to a teacher</CardDescription>
            <CardAction><Button variant='default' onClick={() => setOpen(false)}>Cancel</Button></CardAction>
          </CardHeader>

          <CardContent className="px-2">
           
              <Command  className='px-2 '>
                <CommandInput  placeholder="Search subject" />
                <CommandList>
                   <ScrollArea className="rounded-md h-[300px]">
                  {isLoading ? (
                    <div className="p-4 text-sm text-muted-foreground">Loading subjects...</div>
                  ) : subjects?.length === 0 ? (
                    <CommandEmpty>No subjects found.</CommandEmpty>
                  ) : (
                    <CommandGroup className='px-2'>
                      {subjects.map((s) => (
                        <CommandItem key={s.id} className="text-sm text-muted-foreground p-1 h-auto flex flex-col  !bg-transparent">
                          <div className="flex justify-between items-center w-full">
                            <span>
                              <span className="font-bold">{s.code}: </span> {s.title}
                            </span>
                            <Button variant="outline" onClick={() => handleAssign(s.id)}>
                              <Plus />
                            </Button>
                          </div>
                          <Separator  />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  )}
                   </ScrollArea>
                </CommandList>
              </Command>
           
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  );
}
