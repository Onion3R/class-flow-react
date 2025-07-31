import React, { useEffect, useState} from 'react'
import { Lock } from 'lucide-react'
import { getScheduleClasses, getSemester } from '@/services/apiService'
import ScheduleTableComponent from '@/Components/Tabs/sheduleTableComponent'
import  SelectComponent  from '@/Components/Select/selectComponent'
import { Button } from '@/Components/ui/button'
import { Search, Trash, Printer } from 'lucide-react'

const pageYearLevel = 'Sophomore(2nd year)'

function FreshmenSchedPage() {
  const [yearScheduleClasses, setScheduleClasses] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [semesters, setSemesters] = useState([])
  const [sectionCount, setSectionCount] = useState()
  const [selectedSection, setSelectedSection] = useState('')
  const [selectedSemester, setSelectedSemeter] = useState('')


  useEffect(() => {
    getSemester()
      .then((data) => {
      const semesterNames = data.map((e) => e.name);
      setSemesters(semesterNames)
      })
      .catch((err) => console.log(err))
    
      GetScheduleClasses()
  }, []);


  useEffect(() => {
    if (selectedSemester) {
      if (selectedSection) {
        setFilteredData([])
        setScheduleClasses([])
        setSectionCount(0)
        setSelectedSection(null)
      }
     
     
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
  
  useEffect(() => {
    GetScheduleClasses()
  }, [])
  

  function GetScheduleClasses() {
     getScheduleClasses()
        .then((data) => {
          // ✅ Filter by year level
          let filteredData

          if(selectedSemester) {
              filteredData = data.filter((e) =>
              e.section_name.includes(pageYearLevel) &&
              e.generated_schedule.toLowerCase().includes(selectedSemester.toLowerCase())
            );
          } else {
              filteredData = data.filter((e) =>
              e.section_name.includes(pageYearLevel)
            );
          }
          setFilteredData(filteredData);

          // ✅ Get unique sections only from the filtered data
          const uniqueSections = new Set(filteredData.map((e) => e.section_name));
          const numberOfSections = uniqueSections.size;

          console.log('pageYearLevel: ', pageYearLevel , 'selectedSemester: ',selectedSemester )
          console.log("Filtered Data:", filteredData)
          console.log("Filtered Unique Sections:", [...uniqueSections]);
          console.log("Number of unique sections:", numberOfSections);

          setSectionCount(Math.max(0, numberOfSections));
        })
        .catch((err) => {
          console.error("Failed to fetch schedule classes:", err);
        });
  }

  const items = {
    section: Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i)), // ["A", ..., "Z"]
    semester: semesters
  }

  

  return (
    <div className='container mx-auto p-4'>
      <h3 className='text-2xl font-semibold mb-4'>Freshmen Schedule</h3>
      <div className='bg-white dark:bg-accent p-4 rounded-lg shadow-md mb-4   justify-between sm:items-center items-start  lg:flex '>
        <div className='flex gap-[5%] mb-2 lg:mb-0  w-full min-w-[300px] max-w-[700px]'>
          <SelectComponent 
            items={items.semester} 
            label="Semester"
            value={selectedSemester}
            onChange={setSelectedSemeter}  
            />
            <SelectComponent 
            items={ (items.section.slice(0, sectionCount))} 
            label="Sections"
            value={selectedSection}
            onChange={setSelectedSection}  
          />
        <div className='gap-2 flex'>
          <Button variant="outline" className="border border-dashed"> <Search/><span className='hidden sm:block'>Filter</span></Button>
          <Button  variant="outline" className="border border-dashed"> <Trash/><span className='hidden sm:block'>Delete</span></Button>
        </div>
      </div>
        <Button   className="border border-dashed "> <Printer/><span>Print</span></Button>
      </div>
        {filteredData.length > 0 ? 
        (yearScheduleClasses && 
        (<ScheduleTableComponent schedules={yearScheduleClasses}/>)) 
        :
         <div className='p-4 items-center justify-center flex border rounded'>
          <Lock className='w-4 h-4 text-accent-foreground/40 mr-2'/>
          <span className='text-foreground/40 text-sm'>You haven't generated a schedule yet for this year level</span>
         </div> }
      
      </div>
  )
}

export default FreshmenSchedPage