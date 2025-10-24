import React, {useEffect, useState} from 'react'
import DataTableComponent from '@/components/DataTable/dataTableComponent'
import { getColumns } from './column'
import useSubjectsGetter from '@/lib/hooks/useSubjects'
import AddSubjectDialog from '../components/AddSubjectDialog'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { PulseLoader } from 'react-spinners'
function SubjectTest() {
  const {data, isLoading, refresh} = useSubjectsGetter()

    function handleRefresh() {
      refresh();
    }

  
  
  return (
    <div className='container mx-auto p-4'>
      <div className="flex items-center sm:items-center justify-between mb-4 sm:mb-none  ">
          <div className="flex sm:flex-row sm:gap-5 gap-2 sm:items-center items-start flex-col ">
              <h1 className="text-2xl font-bold">Subjects</h1>
          </div>
          <PulseLoader size={6} loading={isLoading} color={'#808080'} />
      </div>
      <Card className='bg-transparent !gap-2'>
        <CardHeader>
          <CardTitle>Add Subject</CardTitle>
          <CardDescription>You can manage subjects here.</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTableComponent 
            data={data ?? []} 
            getColumns={getColumns} 
            alertDialogData={{ // <-- Corrected spelling
                id: 'subject',
                desc: "This action is irreversible. It will permanently delete the subject and remove all associated data from our servers."
            }}
              filteredData={{ columnId: "title", label: "subject title" }}
              filterComboBoxes={[]}
              onRefresh={() => refresh()}
            addComponent={<AddSubjectDialog onRefresh={() => handleRefresh()}/>} 
            />
        </CardContent>
      </Card>
     
    </div>
  )
}

export default SubjectTest