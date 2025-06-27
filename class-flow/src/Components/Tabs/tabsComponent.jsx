import { useState } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import  TableComponent  from '@/Components/Table/tableComponent'
import { Card, CardContent } from "../ui/card";

const levels = ["Freshmen", "Sophomore","Junior", "Senior"];

export default function TabsComponent({data, getColumns, filteredData, comboFilteredData}) {
 const [activeTab, setActiveTab] = useState("Sophomore")
 
  return (
    <div className="flex w-full">
      <Tabs defaultValue="Sophomore" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          {levels.map((level) => (
            <TabsTrigger key={level} value={level}>{level}</TabsTrigger>
          ))}
        </TabsList>

       {levels.map((level) => (
        <TabsContent key={level} value={level}>
          <Card>
            <CardContent>
              <TableComponent
               data={data[level]} getColumns={getColumns} filteredData={filteredData} comboFilteredData={comboFilteredData}
              />
            </CardContent>
          </Card>
        </TabsContent>
      ))}
      </Tabs>
    </div>
  )
}
