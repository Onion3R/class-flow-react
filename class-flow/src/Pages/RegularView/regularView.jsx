import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from '@Components/ui/button'
import AvatarPopUpComponent from '@/Components/AvatarPopUp/avatarPopUpComponent'
// import  ScheduleTableComponent  from '@/Components/Tabs/sheduleTableComponent'
import columns from "./column"
import { TableComponent } from '@/Components/Table/tableComponent'
import {data} from "./class-data"
import { MessageSquare, Search, Trash, Printer} from 'lucide-react'
import { Separator } from '@Components/ui/separator'
import  PanelSwticherVreg from '@/Components/PanelSwitcher/PanelSwticherVreg'
import { SidebarTrigger,  useSidebar,} from "@/Components/ui/sidebar";
import  SelectComponent  from '@/Components/Select/selectComponent'
const tabItems = [
  {
    key: "schedule",
    label: "Schedule",
  },
  {
    key: "students",
    label: "Students",
  },
  {
    key: "classes",
    label: "Classes",
  },
]

const items = 
  {
    year: ["Freshman", "Sophomore", "Junior", "Senior"],
    section: ["A", "B", "C", "D", "E", "F"],
    semester: ["1st Semester", "2nd Semester"]
  }


function RegularView() {
   const { isMobile } = useSidebar()
  return (
    <div className='w-full h-full '>
      <div className='border-b h-[50px] flex items-center justify-between px-5 dark:bg-accent'>
        <div className='h-[50px] flex items-center'>
          { isMobile ?  <SidebarTrigger/> : <h1>Header</h1>}
         
          <Separator orientation='vertical' className="mx-4 !h-[70%] "/>
          <PanelSwticherVreg panels={data.panels}/>
          </div>
          <div className=' sm:flex hidden '  >
            <Button>
              <MessageSquare />
              Feedback
            </Button>
            <Button variant="ghost" className="hover:bg-transparent">
              Support
            </Button>
           <AvatarPopUpComponent />
          </div>
        </div>
        <div className='min-h-screen bg-accent dark:bg-black'>
            <Tabs defaultValue="schedule" >
              <div className='   border-b bg-white dark:bg-accent sm:p-0  p-5'>
                <div className='container mx-auto h-full flex flex-col justify-center items-start py-5'>
                <h1 className='text-3xl mt-8 '>Class Information</h1>
              <TabsList className={"mt-6 border-dashed border"}>
                {
                  tabItems.map(({key, label}) => (
                     <TabsTrigger value={key} key={key}>{label}</TabsTrigger>
                  ))
                }
               
              </TabsList>
                </div>
              </div>
              <div className='h-full container mx-auto py-3  sm:p-0  p-5'>
              <TabsContent value="schedule">
                 <h3 className='text-2xl'>Class today</h3>
                 <div className='mt-7'>
                  <TableComponent data={data.class} columns={columns}/>  
                </div>
              </TabsContent>
              <TabsContent value="students" >
                <h3 className='text-2xl mt-5'>Schedule</h3>
                <div className="mt-7  rounded-md shadow-sm overflow-auto">
                  <div>
                     <div className='bg-white dark:bg-accent p-4 rounded-lg shadow-md mb-4    justify-between  lg:flex relative '>
                       <div className="gap-[2%] mb-2 lg:mb-0 w-full   lg:flex align-start justify-start  ">

                          <div className='flex gap-5 justify-between lg:just mb-2 sm:mb-0  '>
                          <SelectComponent items={items.year} label="Year"/>
                          <SelectComponent items={items.section} label="Sections"/>
                          <SelectComponent items={items.semester} label="Semester"/>
                          </div>
                          <div className='gap-2  lg:mt-0 mt-2 flex'>
                            <Button variant="outline" className="border border-dashed"> <Search/><span className='hidden sm:block'>Filter</span></Button>
                            <Button  variant="outline" className="border border-dashed"> <Trash/><span className='hidden sm:block'>Delete</span></Button>
                          </div>
                        </div>
                          <Button   className="border  absolute right-4 bottom-6 lg:relative lg:right-0 lg:bottom-0 "> <Printer/><span>Print</span></Button>
                        </div>
                      <ScheduleTableComponent/>
                  </div>
                
                </div>
              </TabsContent>
              </div>
            </Tabs>
          
        </div>
      
      
    </div>
  )
}

export default RegularView