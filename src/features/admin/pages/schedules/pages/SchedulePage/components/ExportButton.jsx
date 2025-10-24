import React, { useState } from 'react'
import { FileSpreadsheet } from 'lucide-react'
import { Button } from '@/components/ui/button'
import qs from 'qs';
import { exportAdminScheduleExcel } from '../services/exportService'

import { PulseLoader } from 'react-spinners';
function ExportButton({scheduleId, filters, disabled}) {
  const [isLoading, setIsLoading] = useState(false)

const handleExportExcel = async () => {
  if (!filters) return;
  setIsLoading(true);

  const cleanedFilters = filters.replace(`${scheduleId}&`, '');
  const filtersObject = qs.parse(cleanedFilters);

  try {
    const response = await exportAdminScheduleExcel(scheduleId, filtersObject);

    const contentType = response.headers["content-type"];

if (
  !contentType ||
  !contentType.includes("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
) {
  console.error("Unexpected response:", response.data);
  throw new Error("Server did not return a valid Excel file.");
}

    const blob = response.data ?? response; // Axios returns blob in `data`, fetch returns it directly
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `schedule-${scheduleId}.xlsx`;
    a.click();
    window.URL.revokeObjectURL(url);

  } catch (error) {
    console.error("❌ Failed to export Excel:", error);
    alert("Export failed. Please try again.");
  } finally {
    setIsLoading(false);
  }
};


  return (
   <Button variant='secondary' size='sm' className='text-xs ' onClick={handleExportExcel} disabled={disabled}>
      <FileSpreadsheet className="!w-3 !h-3 " />
      {isLoading ? <PulseLoader /> : 'Export'}
    </Button>
  )
}



export default ExportButton;
