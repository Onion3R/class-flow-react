import React, {useState, useEffect} from 'react'
import { PulseLoader } from 'react-spinners';
import {getColumns} from './config/column'
import DataTableComponent from '@/components/DataTable/dataTableComponent'
import  ShareDialog  from '@/features/admin/pages/teachers/pages/TeachersPage/component/ShareDialog'
import { transformInstructorData } from './config/transformInstructorData'
import useTeachersGetter from '@/lib/hooks/useTeachers';
import AlertComponent from '@/components/Alert/AlertComponent';
import { Card, CardContent, CardDescription, CardTitle, CardHeader } from '@/components/ui/card';
import LoadingCard from '@/components/LoadingCard/loadingCard';


function Teachers() {
  const [teachers, setTeachers] = useState({});
  const { data, isLoading, error, refresh: refreshTeachers} = useTeachersGetter();

  useEffect(() => {
  if(data) {
    const transformed = transformInstructorData(data);
    setTeachers(transformed);
  }
  }, [data])
  
const handleRefresh = () => refreshTeachers();



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
                          id: 'teacher',
                          desc: "This action cannot be undone. This will permanently delete your account and remove your data from our servers."
                      }}
        filteredData={{ columnId: "name", label: "teacher name" }}
         filterComboBoxes={[]}
         onRefresh={handleRefresh}
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
