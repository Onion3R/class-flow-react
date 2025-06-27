import React from 'react'
import { fetchData } from './data'
import {getColumns} from './column'
import TableComponent from '@/Components/Table/tableComponent'

function Page1() {
  return (
    <div className="h-screen max-h-[calc(100vh-29px)]">
      <div className="p-4 sm:w-auto w-screen max-w-[calc(100vw-16px)]">
        <h1 className="text-2xl font-bold mb-4">Professors</h1>
        <TableComponent data={fetchData} getColumns={getColumns} filteredData='email' comboFilteredData="subject" />
      </div>
    </div>
  )
}

export default Page1
