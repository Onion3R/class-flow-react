import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import OverrideDialogGenerateSchedule from './components/OverrideDialogGenerateSchedule';
import  { triggerToast } from "@lib/utils/toast"
import { Input } from '@/components/ui/input';
import { AlertCircleIcon, ExternalLink , TriangleAlert} from 'lucide-react';
import { Button } from '@/components/ui/button';
import useScheduleGetter from '@/lib/hooks/useSchedules';
import SelectComponent from '@/components/Select/selectComponent';
import { generateSchedule } from '@/app/services/apiService';
import { Alert, AlertDescription, AlertTitle } from "@Components/ui/alert";
import useGeneratedScheduleGetter from '@/lib/hooks/useGeneratedSchedules';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TextShimmer } from '@/components/motion-primitives/text-shimmer';
let LOCAL_STORAGE_KEY = import.meta.env.VITE_SCHED_LOCAL_STORAGE_KEY
function GenerateSchedule() {
  const { data: allScheduleData = [], isLoading: scheduleIsLoading } = useScheduleGetter();
  const { data: allGeneratedScheduleData = [], isLoading: generatedScheduleIsLoading } = useGeneratedScheduleGetter();

  const [selectedSchedule, setSelectedSchedule] = useState('');
  const [selectedScheduleId, setSelectedScheduleId] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isOverride, setIsOverride] = useState(false);
  const [scheduleName, setScheduleName] = useState('');
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const found = allScheduleData.find(a => a.title === selectedSchedule);
    setSelectedScheduleId(found?.id || '');
  
  }, [selectedSchedule, allScheduleData]);

  const handleGenerate = async () => {
    if (!selectedScheduleId) return;

    const alreadyGenerated = allGeneratedScheduleData.some(e => e.schedule.id === selectedScheduleId);

    if (alreadyGenerated) {
      setDialogOpen(true);
      return;
    }

    await submitGenerate(false);
  };

const submitGenerate = async (override) => {
  try {
    setLoading(true);
    const data = {
      schedule_id: selectedScheduleId,
      name: scheduleName,
      override,
    };
    
    console.log("Sending data to API:", data);
    const responseData = await generateSchedule(data);
    setErrorMessage('');
    setSuccessMessage(responseData.message);

    triggerToast({
      success: true,
      title: "Generate Success",
      desc: 'You have succesfully generate a timetable ', // Use the specific message from the API
    });

  } catch (error) {
    // This catch block handles errors thrown by generateSchedule.
    console.error("Error in submitGenerate:", error.message);
    
    // Set the state with the error message.
    setErrorMessage(error.message);
    setSuccessMessage(''); // Clear any previous success messages
    
    // Provide a toast message for user feedback on failure.
    triggerToast({
      success: false,
      title: "Generate Failed",
      desc: 'Unable to generate schedule',
    });
    
  } finally {
    setLoading(false);
    setDialogOpen(false);
    setIsOverride(false);
    setSelectedScheduleId(null)
    setSelectedScheduleId(null)
    localStorage.removeItem(LOCAL_STORAGE_KEY)
  }
};


  const handleDialogContinue = () => {
    setIsOverride(true);
    submitGenerate(true);
  };

  useEffect(() => {
  setErrorMessage('')
  setSuccessMessage('')
  }, [selectedSchedule])
  

  return (
    <div className='container mx-auto p-4 '>
        <OverrideDialogGenerateSchedule dialogOpen={dialogOpen} setDialogOpen={setDialogOpen} handleDialogContinue={handleDialogContinue}/>

      <div className='sm:w-[60%] w-full h-full'>
        <Alert variant="default" className='my-2 bg-accent'>
          <AlertCircleIcon />
          <AlertTitle>Schedule Generation Notice</AlertTitle>
          <AlertDescription>
            <p>Please review the following before generating a schedule:</p>
            <ul className="list-inside list-disc text-sm">
              <li>All year levels (e.g., Grade 11, Grade 12) in the selected schedule will be processed.</li>
              <li>You may enter an optional name to help identify this generation attempt.</li>
              <li>Generated schedules can be overridden; verify your selections before proceeding.</li>
            </ul>
          </AlertDescription>
        </Alert>
        <Card className='bg-transparent '>
          <CardHeader>
            <CardTitle>Generate New Schedule Instance</CardTitle>
            <CardDescription>
              Select a schedule from the list below and click "Generate" to create a new schedule instance.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Input
              type='text'
              placeholder='Schedule name'
              value={scheduleName}
              onChange={e => setScheduleName(e.target.value)}
            />
            <SelectComponent
              items={allScheduleData.map((s) => s.title)}
              label="Schedules"
              value={selectedSchedule}
              onChange={setSelectedSchedule}
              className="!max-w-none !w-full !min-w-none mt-4"
            />
            <div className='my-4'>
              <h1 className='font-bold mb-2'>Terminal log</h1>
              <ScrollArea className='h-55 w-full border rounded-md gap-2 flex flex-col  p-4'  >
               
                  <div className="text-sm text-gray-400">
                   <span className='text-sm'> Ready to generate. Any messages or errors will appear here. </span> <br />
                  {!selectedSchedule ? <span>Select a schedule to generate</span> :  <span>Selected: {selectedSchedule}.</span> } <br />
                  {errorMessage && <span className='text-sm !text-red-400'>{errorMessage}</span>} 
                  {successMessage && <span className='text-sm '>Success: {successMessage}  Check your generated schedule in "Schedule"</span>}
                   
                 <span className={`text-sm text-gray-400  ${!loading ? 'hidden' : 'block'}`}>
                    Generating schedule, please wait...
                  </span>
                
                  </div>
                {errorMessage && <span className='text-sm !text-red-400'>{errorMessage}</span>}
              </ScrollArea>
            </div>
            <Button variant='outline' size='lg' 
            onClick={handleGenerate} disabled={!selectedScheduleId || loading}>
              {loading ?   <TextShimmer duration={1.5} className="text-sm font-medium ">
 Generating...
</TextShimmer> :  'Generate'}
            </Button>
          </CardContent>
          <CardFooter>
            <div className="flex flex-col sm:flex-row items-center justify-center w-full text-center sm:text-left text-sm text-muted-foreground">
              <span>
                To check your generated schedules, go to
                <span className="font-medium mx-1 flex items-center justify-center">Schedules  <ExternalLink className="w-4 h-4 mt-2 sm:mt-0 sm:ml-1" /></span>
              </span>
             
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

export default GenerateSchedule;
