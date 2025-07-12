import { useState } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import  DataTableComponent  from '@/Components/DataTable/dataTableComponent'

const levels = ["Freshmen", "Sophomore","Junior", "Senior"];

export default function TabsComponent({data, getColumns, filteredData, comboFilteredData}) {
 const [activeTab, setActiveTab] = useState("Sophomore")
 
  return (
    <div className="flex w-full">
      <Tabs defaultValue="Sophomore" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="container mx-auto">
          <TabsList className=" my-2 ">
            {levels.map((level) => (
              <TabsTrigger key={level} value={level}>{level}</TabsTrigger>
            ))}
          </TabsList>
      </div>
       {levels.map((level) => (
        <TabsContent key={level} value={level}>
          <div>
              <DataTableComponent
               data={data[level]} getColumns={getColumns} filteredData={filteredData} comboFilteredData={comboFilteredData}
              />
            </div>
        </TabsContent>
      ))}
      </Tabs>
    </div>
  )
}
