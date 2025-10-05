import React, {useState, useEffect} from 'react'
import { getTeacherSchedule } from '@/features/teacher/service/teacherService'
import ScheduleTableComponent from '@/features/teacher/components/ScheduleComponent'
function Test() {


const [data, setData] = useState()
  useEffect(() => {
   async function getTeachers() {
    try {
    const result = await getTeacherSchedule()
    setData(result)
   } catch (error) {
    console.log(error)
   }
   }

   getTeachers()
  }, [])
  

  return (
    <div>
      <pre>
        {JSON.stringify(data, null, 2)}
       
      </pre>
    </div>
  )
}

export default Test