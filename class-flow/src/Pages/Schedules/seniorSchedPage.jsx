import React, { useEffect, useState, useRef} from 'react'
import { Lock } from 'lucide-react'
import { PulseLoader } from 'react-spinners'
import { getScheduleClasses, getSemester } from '@/services/apiService'
import ScheduleTableComponent from '@/Components/Tabs/sheduleTableComponent'
import  SelectComponent  from '@/Components/Select/selectComponent'
import { Button } from '@/Components/ui/button'
import { Search, Trash, Printer } from 'lucide-react'
import { triggerToast } from '@/Components/AlertSonner/alertSonner';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@Components/ui/tabs"

const pageYearLevel = 'Junior(3rd year)'


function SeniorSchedPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [yearScheduleClasses, setScheduleClasses] = useState([])
  const [semesters, setSemesters] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [hasDataFromDb, setHasDataFromDb] = useState(true)
  const [sectionCount, setSectionCount] = useState()
  const [selectedSection, setSelectedSection] = useState('')
  const [selectedSemester, setSelectedSemeter] = useState('')


  useEffect(() => {
    setIsLoading(true)
    getSemester()
      .then((data) => {
      const semesterNames = data.map((e) => e.name);
      setSemesters(semesterNames)
      })
      .catch((err) => console.log(err))
     GetScheduleClasses()
  }, []);


  useEffect(() => {
    setIsLoading(true)
    if (selectedSemester) {
      if (selectedSection) {
        setFilteredData([])
        setScheduleClasses([])
        setSectionCount(0)
        setSelectedSection('')
      }
     GetScheduleClasses()
    }
  
  }, [selectedSemester])
  

  useEffect(() => {
    if(selectedSection) {
     const example = filteredData.filter((e) => e.section_name.includes(`${selectedSection} (${pageYearLevel})`))
      console.log('heelo:',example)
      console.log(`${selectedSection} (${pageYearLevel})`)
      setScheduleClasses(example)
    }
  }, [selectedSection])
 

  function GetScheduleClasses() {
      getScheduleClasses()
        .then((data) => {
          // ✅ Filter by year level
          if(selectedSemester) {
              const filteredData = data.filter((e) =>
              e.section_name.includes(pageYearLevel) &&
              e.generated_schedule.toLowerCase().includes(selectedSemester.toLowerCase()
            )
            );

            const uniqueSections = new Set(filteredData.map((e) => e.section_name));
            const numberOfSections = uniqueSections.size;

            console.log('pageYearLevel: ', pageYearLevel , 'selectedSemester: ',selectedSemester )
            console.log("Filtered Data:", filteredData)
            console.log("Filtered Unique Sections:", [...uniqueSections]);
            console.log("Number of unique sections:", numberOfSections);
            setFilteredData(filteredData)
            setSectionCount(Math.max(0, numberOfSections));
            setIsLoading(false)
          } else {
              const checkData = data.filter((e) =>
              e.section_name.includes(pageYearLevel)
            );
            console.log(checkData)
            setHasDataFromDb(checkData.length > 0 ? true : false)
          }
          
          
          setIsLoading(false)
        })
      .catch((err) => {
        console.error("Failed to fetch schedule classes:", err);
      });
  }

  const items = {
    section: Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i)), // ["A", ..., "Z"]
    semester: semesters
  }
 
  const timeoutRef = useRef(null);

useEffect(() => {
    if (isLoading) {
      timeoutRef.current = setTimeout(() => {
        triggerToast(null); // Trigger toast after 1 second
      },  30000); // 1 second = 1000 ms
    } else {
      clearTimeout(timeoutRef.current);
    }

    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, [isLoading]);

const tracks = ['Tvl', 'Academic'];
  return (
    <div className='container mx-auto p-4 relative'>
      <div>
         <Tabs defaultValue={tracks[0]}>
          <div className='flex items-center justify-between'> 
            <div className='flex gap-5 items-center justify-center'>
              <h3 className='text-2xl font-semibold'>Senior Schedule</h3>
              <TabsList className="h-8" >
                {tracks.map((e) => (<TabsTrigger value={e}>{e}</TabsTrigger>))}
              </TabsList>
          </div>
          <PulseLoader size={6} loading={isLoading}/>
        </div>
          {tracks.map((e)=> (
            <TabsContent value={e}>
               <div className='bg-white dark:bg-accent p-4 rounded-lg shadow-md mb-4 justify-between sm:items-center items-start  lg:flex '>
                <div className='flex gap-[5%] mb-2 lg:mb-0  w-full min-w-[300px] max-w-[700px]'>
                  <SelectComponent 
                    items={items.semester} 
                    label="Semester"
                    value={selectedSemester}
                    onChange={setSelectedSemeter}  
                    />
                    <SelectComponent 
                    disabled={isLoading || !selectedSemester}
                    items={ (items.section.slice(0, sectionCount))} 
                    label="Sections"
                    value={selectedSection}
                    onChange={setSelectedSection}  
                  />
                <div className='gap-2 flex'>
                  {/* <Button variant="outline" className="border border-dashed"> <Search/><span className='hidden sm:block'>Filter</span></Button>
                  <Button  variant="outline" className="border border-dashed"> <Trash/><span className='hidden sm:block'>Delete</span></Button> */}
                </div>
              </div>
                <Button   className="border border-dashed "> <Printer/><span>Print</span></Button>
              </div>
                {hasDataFromDb ? 
                  (isLoading ?  (
                  <div className='p-4 items-center justify-center flex border rounded'>
                      <span className='text-foreground/40 text-sm mr-2'>Checking data from database</span>
                      <PulseLoader size={5} loading={true} color={'#D3D3D3'} /> 
                    </div> 
                  ) 
                  : 
                  (
                    (yearScheduleClasses && selectedSection && selectedSemester ?
                    (<ScheduleTableComponent schedules={yearScheduleClasses}/>) 
                    : 
                    (<div className='p-4 items-center justify-center flex border rounded'> 
                      <Search className='w-4 h-4 text-accent-foreground/40 mr-2'/>
                      <span className='text-foreground/40 text-sm'>Select { selectedSemester === '' ? <span>Filter</span> : <span>Section</span>}</span>
                    </div>)
                    ) 
                  ))
                  
                :
                <div className='p-4 items-center justify-center flex border rounded'>
                  <Lock className='w-4 h-4 text-accent-foreground/40 mr-2'/>
                  <span className='text-foreground/40 text-sm'>You haven't generated a schedule yet for this year level</span>
                </div> 
                }
                  </TabsContent>
          ))}
          
        </Tabs>
      </div>
     
      </div>
  )
}
export default SeniorSchedPage