import React, { useState } from 'react';
import PreviewScheduleTable from './components/SheduleTableComponent';
import { Button } from '@/components/ui/button';
import { useParams } from 'react-router-dom';
import { PulseLoader } from 'react-spinners';
import { handleDownload, handleDownloadPdf } from './handlers/handleDownload';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
function View() {
  const { scheduleId: encodedId } = useParams(); // e.g., "476&track_id=1&section_ids=3"
  const [loading, setLoading] = useState(false);
  const [downloadCall, setDownloadCall] = useState('')

  // Decode for API call
  const decodedId = decodeURIComponent(encodedId); // "476&track_id=1&section_ids=3"
  const [scheduleId, ...queryParts] = decodedId.split("&");
  const queryParams = Object.fromEntries(
    queryParts.map(part => {
      const [key, value] = part.split("=");
      return [key, value];
    })
  );


const handleDownloadCall = () => {
  handleDownload({ queryParams, scheduleId, setLoading });
  setDownloadCall('png')
};
const handleDownloadCallPdf = () => {
  handleDownloadPdf({ queryParams, scheduleId, setLoading });
  setDownloadCall('pdf')
};



  return (
   <div className="min-h-screen  space-y-3 bg-card p-4 md:p-10">
      <div className=' md:px-12 flex flex-col gap-2 md:gap-0 md:flex-row items-start  md:items-center  justify-between w-full '>
        <div className="flex items-center space-x-2">
          <Button variant='ghost' > 
            <Link to='/admin'>
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
        className="bg-white dark:bg-secondary shadow-md text-black p-3 mx-auto w-[330mm] h-[216mm]"
      >

        {/* Pass full encoded string for the table to parse filters */}
        <PreviewScheduleTable scheduleId={encodedId} />
      </div>
      </div>
    </div>
  );
}

export default View;
