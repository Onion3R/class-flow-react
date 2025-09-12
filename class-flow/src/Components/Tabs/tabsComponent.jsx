// src/Components/Tabs/tabsComponent.jsx
import { useEffect, useState } from "react";
import { PulseLoader } from "react-spinners";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import DataTableComponent from '@/components/DataTable/dataTableComponent'; // Your wrapper DataTableComponent

// This component manages the inner strand tabs and passes data to DataTableComponent
export default function TabsComponent({
  data,
  getColumns,
  alertDialogData,
  tabList,
  filteredData,
  // IMPORTANT: Add filterComboBoxes to props destructuring here!
  filterComboBoxes = [], // <-- New prop, default to empty array
  onRefresh,
  addComponent,
  isLoading,
  onStrandChange,
  selectedStrandTab
}) {
 
    
  useEffect(() => {
    if (tabList && tabList.length > 0) {
      const isCurrentStrandValid = selectedStrandTab && tabList.some(tab => tab.value === selectedStrandTab);
      if (!isCurrentStrandValid) {
        onStrandChange(tabList[0].value); // Set initial selected strand to the value of the first one
      }
    }
    console.log(tabList)
  }, [tabList, selectedStrandTab, onStrandChange]);


  // Handler for when an inner tab is changed
  const handleInnerTabChange = (newTabValue) => {
    onStrandChange(newTabValue); // Notify the parent (SubjectPage) of the change
  };

  return (
    <div className="flex w-full">
      <Tabs
        value={selectedStrandTab || ""}
        onValueChange={handleInnerTabChange}
        className="w-full"
      >
        <div className="container mx-auto">
          <TabsList className="my-2 ">
            {Array.isArray(tabList) && tabList.map((strandTab) => (
              <TabsTrigger key={strandTab.value} value={strandTab.value}>
                {strandTab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        {Array.isArray(tabList) && tabList.map((strandTab) => (
          <TabsContent key={strandTab.value} value={strandTab.value}>
            <div>
              {isLoading ? (
                <div className='p-4 items-center justify-center flex border rounded'>
                  <span className='text-foreground/40 text-sm mr-2'>Checking data from database</span>
                  <PulseLoader size={5} loading={true} color={'#D3D3D3'} />
                </div>
              ) : (
                <DataTableComponent
                  data={data}
                  getColumns={getColumns}
                  alertDialogData={alertDialogData}
                  filteredData={filteredData}
                  // Pass the new prop down to the DataTableComponent
                  filterComboBoxes={filterComboBoxes}
                  addComponent={addComponent}
                  onRefresh={onRefresh}
                />
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}