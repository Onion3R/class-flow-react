// import React, {useState, useEffect} from 'react'
// import { getTeacherSchedule } from '@/features/teacher/service/teacherService'
// import ScheduleTableComponent from '@/features/teacher/components/ScheduleComponent'
// function Test() {


// const [data, setData] = useState()
//   useEffect(() => {
//    async function getTeachers() {
//     try {
//     const result = await getTeacherSchedule()
//     setData(result)
//    } catch (error) {
//     console.log(error)
//    }
//    }

//    getTeachers()
//   }, [])
  

//   return (
//     <div>
//       <pre>
//         {JSON.stringify(data, null, 2)}
      
//       </pre>
//     </div>
//   )
// }

// export default Test

import React from 'react'
import { Button } from '@/components/ui/button'
import { addTeacher } from '@/app/services/teacherService'
export default function Test() {

  const handleSubmit = () => {
   const  data = {
      first_name: "john",
      last_name: "example",
      is_active: false,
      firebase_uid: 'test',
      role: 1,
      firstTime: true,
      base_max_minutes_per_week: 240,
    }

    const submit = async () =>{
      try {
        await addTeacher(data)
        console.log('guamana yehey')
      } catch (error) {
        console.log(error)
      }
    }

    submit()
  }
  return (
    <div>
      <Button onClick={handleSubmit}>hello</Button>
    </div>
  )
}
