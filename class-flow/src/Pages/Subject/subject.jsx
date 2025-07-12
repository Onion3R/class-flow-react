import React from 'react'
import TabsComponent from '@/Components/Tabs/tabsComponent'
import { fetchData } from './data'
import {getColumns} from './column'

function subject() {
  return (
    <div className=' h-screen '>
        <div className="p-4 sm:w-auto w-screen "> 
          <h1 className="text-2xl font-bold my-2  container mx-auto ">Subjects</h1>
             <TabsComponent data={fetchData} getColumns={getColumns}  filteredData="courseNo" comboFilteredData="sem"/>
      </div>
    </div>
  )
}

export default subject