import React,{useState, useEffect} from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Header from './config/header'
import { Progress } from "@/components/ui/progress"
import { TextRoll } from '@/components/ui/text-roll'
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


function TeacherView() {
const [progress, setProgress] = useState(0);

useEffect(() => {
  const interval = setInterval(() => {
    setProgress(prev => {
      if (prev >= 110) {
        clearInterval(interval);
        return 110;
      }
      return prev + 0.5; // You can adjust the step size here
    });
  }, 10); // Adjust speed here (20ms per step = ~2 seconds total)

  return () => clearInterval(interval);
}, []);
   
  return (
    <div className='w-full h-full  '>
        
        <div className='min-h-screen bg-accent dark:bg-neutral-900'>
            <Tabs defaultValue="schedule" >
              <Header/>
              <div className='   border-dashed border-b-2 relative sm:p-0  p-5'>
                {progress != 110 && 
                  <Progress className='h-[3px] bg-transparent absolute -top-2' value={progress} />
                  }
                <div className='container mx-auto h-full flex flex-col justify-center  items-start py-7 pt-4'>
                  
                  <span className='h-13 flex items-center'>
                  {progress === 110 ? (
                   <TextRoll
                    className='overflow-clip text-4xl font-bold '
                    variants={{
                      enter: {
                        initial: { y: 0 },
                        animate: { y: 40 },
                      },
                      exit: {
                        initial: { y: -40 },
                        animate: { y: 0 },
                      },
                    }}
                    duration={0.3}
                    getEnterDelay={(i) => i * 0.05}
                    getExitDelay={(i) => i * 0.05 + 0.05}
                    transition={{
                      ease: [0.175, 0.885, 0.32, 1.1],
                    }}
                  >
                    Dashboard
                  </TextRoll>
                  ) : (
                    <span className='py-4'>
                <h1 class="text-3xl font-bold bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-600 text-transparent bg-clip-text inline-block">
                  Hello, John
                  </h1>
                  <p className='font-medium text-foreground dark:text-neutral-300'>Welcome back to ClassFlow!</p>
                  
                  </span>
                  )}

                  </span>
                  
              <TabsList className={"mt-6 border-dashed border"}>
                {
                  tabItems.map(({key, label}) => (
                     <TabsTrigger value={key} key={key}>{label}</TabsTrigger>
                  ))
                }
               
              </TabsList>
              
                </div>
              </div>
              <div className='h-full container mx-auto mt-5  sm:p-0  p-5'>
              <TabsContent value='schedule'>
                Hello WOrld
              </TabsContent>
              </div>
            </Tabs>
          
        </div>
      
      
    </div>
  )
}

export default TeacherView



// <TabsContent value="schedule">
//                  <h3 className='text-2xl'>Class today</h3>
//                  <div className='mt-7'>
//                   <TableComponent data={data.class} columns={columns}/>  
//                 </div>
//               </TabsContent>
//               <TabsContent value="students" >
//                 <h3 className='text-2xl mt-5'>Schedule</h3>
//                 <div className="mt-7  rounded-md shadow-sm overflow-auto">
//                   <div>
//                      <div className='bg-white dark:bg-accent p-4 rounded-lg shadow-md mb-4    justify-between  lg:flex relative '>
//                        <div className="gap-[2%] mb-2 lg:mb-0 w-full   lg:flex align-start justify-start  ">

//                           <div className='flex gap-5 justify-between lg:just mb-2 sm:mb-0  '>
//                           <SelectComponent items={items.year} label="Year"/>
//                           <SelectComponent items={items.section} label="Sections"/>
//                           <SelectComponent items={items.semester} label="Semester"/>
//                           </div>
//                           <div className='gap-2  lg:mt-0 mt-2 flex'>
//                             <Button variant="outline" className="border border-dashed"> <Search/><span className='hidden sm:block'>Filter</span></Button>
//                             <Button  variant="outline" className="border border-dashed"> <Trash/><span className='hidden sm:block'>Delete</span></Button>
//                           </div>
//                         </div>
//                           <Button   className="border  absolute right-4 bottom-6 lg:relative lg:right-0 lg:bottom-0 "> <Printer/><span>Print</span></Button>
//                         </div>
                     
//                   </div>
                
//                 </div>
//               </TabsContent>