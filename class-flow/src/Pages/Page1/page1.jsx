import React, {useState, useEffect} from 'react'
import { fetchData } from './data'
import {getColumns} from './column'
import DataTableComponent from '@/Components/DataTable/dataTableComponent'
import  ShareDialog  from '@/Components/ShareDialog/shareDialog'
import { transformInstructorData } from './transformInstructorData'
import { getTeachers } from '@/services/apiService'
function Page1() {
  const [teachers, setTeachers] = useState({});
    
      useEffect(() => {
        getTeachers()
          .then((data) => {
            console.log('Raw subjects from API:', data);
            const transformed = transformInstructorData(data);
            console.log(transformed)
            setTeachers(transformed);
          })
          .catch((err) => console.error('Failed to fetch subjects', err));
      }, []);

  return (
    <div className="h-screen max-h-[calc(100vh-29px)]  ">
      <div className="p-4 sm:w-auto   ">
        <h1 className="text-2xl font-bold mb-4 container mx-auto">Instructors</h1>
        <DataTableComponent data={teachers} getColumns={getColumns} filteredData='email' comboFilteredData="subject" addComponent={<ShareDialog />} />
      </div>
    </div>
  )
}

export default Page1
