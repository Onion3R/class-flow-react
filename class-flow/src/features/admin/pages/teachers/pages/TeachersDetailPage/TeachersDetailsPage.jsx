import React, { useState, useEffect } from 'react'


import { Card, CardContent } from '@/components/ui/card'

import { getSpecificTeacher } from '@/app/services/apiService'
import { useParams } from 'react-router-dom'
import CryptoJS from 'crypto-js'
import ProfileInfo from './components/ProfileInfo'
import Specialization from './components/Specialization'
const SECRET_KEY = import.meta.env.VITE_SECRET_KEY


function TeachersDetail() {
  const { id } = useParams() // This is either plain or encrypted
  const [teachersId, setTeachersId] = useState(null)
  const [teacherDetail, setTeacherDetail] = useState(null)
  const [disable, setDisable] = useState(true)
  

  useEffect(() => {
    try {
      const bytes = CryptoJS.AES.decrypt(decodeURIComponent(id), SECRET_KEY)
      const originalId = bytes.toString(CryptoJS.enc.Utf8)
      setTeachersId(originalId)
    } catch (error) {
      console.error("Failed to decrypt ID:", error)
      setTeachersId(id) // fallback to plain ID
    }
  }, [id])

  async function getTeacher() {
  try {
    const data = await getSpecificTeacher(teachersId)
    setTeacherDetail(data)
    console.log('Fetched teacher data:', data)
  } catch (error) {
    console.log('Error fetching teacher:', error)
  }
}

useEffect(() => {
  if (teachersId) {
    getTeacher()
  }
}, [teachersId])

function onRefresh() {
  if (teachersId) {
    getTeacher()
  }
}

  

  return (
    
    <div className='container mx-auto p-4'>
     { teacherDetail &&(
      <Card className='min-h-[calc(100vh-79px)] bg-transparent border-none shadow-none'>
         

          <div className='flex bg-amber-30 h-full gap-7 lg:flex-row flex-col justify-between items-start'>
            <ProfileInfo teacherDetail={teacherDetail} disable={disable} setDisable={setDisable}  onRefresh={getTeacher}/>
           
              <Specialization teacherDetail={teacherDetail} teachersId={teachersId} onRefresh={() => onRefresh()}/>
          </div>
      </Card>
        )}
    </div>)

}

export default TeachersDetail
