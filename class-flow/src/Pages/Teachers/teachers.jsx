import React, {useState, useEffect} from 'react'
import { PulseLoader } from 'react-spinners';
import {getColumns} from './Config/column'
import DataTableComponent from '@/Components/DataTable/dataTableComponent'
import  ShareDialog  from '@/Components/ShareDialog/shareDialog'
import { transformInstructorData } from './Config/transformInstructorData'
import useTeachersGetter from '@/lib/hooks/useTeachers';
import AlertComponent from '@/Components/Alert/alertComponent';
import { Card, CardContent, CardDescription, CardTitle, CardHeader } from '@/Components/ui/card';

import LoadingCard from '../../Components/LoadingCard/loadingCard';


function Teachers() {
  const [teachers, setTeachers] = useState({});
  const { data, isLoading, error, refresh } = useTeachersGetter();

  useEffect(() => {
  if(data) {
    const transformed = transformInstructorData(data);
    setTeachers(transformed);
  }
  }, [data])
  
    


  return (
    // h-screen max-h-[calc(100vh-29px)] 
    <div className='container p-4 mx-auto'>
      <div className="sm:w-auto   ">
        <div className='flex justify-between items-center mb-4'>
          <h1 className="text-2xl font-bold  container mx-auto">Teachers</h1>
           <PulseLoader size={6} loading={isLoading} color={'#808080'}/>
        </div>
        {isLoading ? 
        <LoadingCard variant="database" />
        :
        <div>
    {    error &&
          (<AlertComponent />)}
        <Card className='bg-transparent'>
        <CardHeader>
          <CardTitle>Add teacher</CardTitle>
          <CardDescription>Manage your teachers here. Share the link with users assigned the appropriate role. </CardDescription>
        </CardHeader>
        <CardContent>
            <DataTableComponent 
        data={teachers} 
        getColumns={getColumns} 
        alertDialogData={{ // <-- Corrected spelling
                          id: 'section',
                          desc: "This action cannot be undone. This will permanently delete your account and remove your data from our servers."
                      }}
        filteredData={{ columnId: "name", label: "section name" }}
         filterComboBoxes={[]}
        addComponent={<ShareDialog  />} />
        </CardContent>
      </Card>
      </div>
        }
     
      </div>
    </div>
  )
}

export default Teachers;
