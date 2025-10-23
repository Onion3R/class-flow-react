import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useParams } from 'react-router-dom';
import { PulseLoader } from 'react-spinners';
import { teacherHandleDownloadPng , teacherHandleDownloadPdf} from './handlers/handleDownload';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import TeacherPreviewSchedule from './components/TeacherPreviewSchedule';

function ViewTeacher() {
  const { teacherId, scheduleId, filters } = useParams(); // e.g., "476&track_id=1&section_ids=3"
  const [loading, setLoading] = useState(false);
  const [downloadCall, setDownloadCall] = useState('')

  // Decode for API call
  const decodedScheduleId = decodeURIComponent(scheduleId); 
  const decodedTeacherId = decodeURIComponent(teacherId); 
  const decodedFilters = decodeURIComponent(filters); 
  
 
console.log(decodedScheduleId, decodedTeacherId, filters)

const handleDownloadCall = () => {
 teacherHandleDownloadPng({scheduleId:decodedScheduleId, teacherId:decodedTeacherId, filters:decodedFilters, setLoading})
  setDownloadCall('png')
};
const handleDownloadCallPdf = () => {
 teacherHandleDownloadPdf({scheduleId:decodedScheduleId, teacherId:decodedTeacherId, filters:decodedFilters, setLoading})
  setDownloadCall('pdf')
};



  return (
    <div className="min-h-screen  space-y-3 bg-card p-4 md:p-10">
      <div className=' md:px-12 flex flex-col gap-2 md:gap-0 md:flex-row items-start  md:items-center  justify-between w-full '>
        <div className="xs flex items-center space-x-2">
          <Button variant='ghost' > 
            <Link to='/dashboard'>
            <ChevronLeft size={20} /> 
            </Link>
            </Button>
          <h1 className='font-bold'>Schedule Preview</h1>
    </div>
      <div className='flex h-full gap-5 w-full md:w-fit items-cent justify-center '>
         <Button onClick={handleDownloadCall} disabled={loading}>
        {loading && downloadCall==='png' ?  <PulseLoader size={8} color="#ffffff" /> : 'Download PNG'}
      </Button>
         <Button onClick={handleDownloadCallPdf} disabled={loading}>
        {loading && downloadCall==='pdf' ?  <PulseLoader size={8} color="#ffffff" /> : 'Download PDF  '}
      </Button>
      </div>
      </div>
     
      <div className='overflow-auto'>
      <div
        id="schedule-capture"
        className="bg-white dark:bg-secondary shadow-md text-black p-3 mx-auto w-[356mm] max-h-[216mm]"
      >

          <TeacherPreviewSchedule  teacherId={decodedTeacherId} setTableData={null} filters={null} scheduleId={decodedScheduleId} />
       
      </div>
      </div>
    </div>
  );
}

export default ViewTeacher;

