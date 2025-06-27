import React from 'react'
import TabsComponent from '@/Components/Tabs/tabsComponent'
import { fetchData } from './data'
import {getColumns} from './column'

function subject() {
  return (
    <div className=' h-screen max-h-[calc(100vh-29px)] '>
        <div className="p-4 sm:w-auto w-screen max-w-[calc(100vw-16px)]  "> 
          <h1 className="text-2xl font-bold mr-2   ">Subjects</h1>
             <TabsComponent data={fetchData} getColumns={getColumns}  filteredData="courseNo" comboFilteredData="sem"/>
      </div>
    </div>
  )
}

export default subject