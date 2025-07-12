import React from 'react'
import { fetchData } from './data'
import {getColumns} from './column'
import DataTableComponent from '@/Components/DataTable/dataTableComponent'

function Page1() {
  return (
    <div className="h-screen max-h-[calc(100vh-29px)]  ">
      <div className="p-4 sm:w-auto   ">
        <h1 className="text-2xl font-bold mb-4 container mx-auto">Instructors</h1>
        <DataTableComponent data={fetchData} getColumns={getColumns} filteredData='email' comboFilteredData="subject" />
      </div>
    </div>
  )
}

export default Page1
