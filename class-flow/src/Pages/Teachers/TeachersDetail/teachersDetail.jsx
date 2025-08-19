import React, {useState, useEffect} from 'react'
import { UserPen } from 'lucide-react'
import { Avatar, AvatarImage, AvatarFallback } from '@/Components/ui/avatar'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { getSpecificTeacher } from '@/services/apiService'
import { useParams } from 'react-router-dom';
import CryptoJS from 'crypto-js';


const SECRET_KEY = import.meta.env.VITE_SECRET_KEY;
const AvatarComponent = () => (
  
  <div className='relative w-fit'>
    <Avatar className="h-25 w-25">
      <AvatarImage src="https://github.com/shadcn.png" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
    <div className='absolute right-3 bottom-0 bg-white rounded-full h-7 w-7 flex items-center justify-center border border-l-white'>
      <UserPen className='text-primary w-4 h-4' />
    </div>
  </div>
);

function TeachersDetail() {
  
  const { id } = useParams(); // This is either plain or encrypted
  const [teachersId, setTeachersId] = useState(null);
  const [teacherDetail, setTeacherDetail] = useState(null);
  useEffect(() => {
    try {
      const bytes = CryptoJS.AES.decrypt(decodeURIComponent(id), SECRET_KEY);
      const originalId = bytes.toString(CryptoJS.enc.Utf8);
      setTeachersId(originalId);
    } catch (error) {
      console.error("Failed to decrypt ID:", error);
      setTeachersId(id); // fallback to plain ID
    }
  }, [id]);

  useEffect(() => {
  async function getTeacher() {
    try {
      await getSpecificTeacher(teachersId).then((data) => {
        setTeacherDetail(data);
        console.log('Fetched teacher data:', data);
      });
    } catch (error) {
      console.log('Error fetching teacher:', error);
    }
  }
  getTeacher()
  }, [teachersId])
  

  return (
    <div className='container mx-auto p-4'>
      <Card >
        <CardContent>
          <div className='flex items-center gap-4 mb-4'>
           <AvatarComponent />
              <div>
            <h1 className='text-2xl font-bold'>
              {teacherDetail?.full_name} <br/>
            </h1>
            <p className='text-sm  text-muted-foreground'>{teacherDetail?.full_name}@gmail.com</p>
            <CardDescription className='px-2'>
            </CardDescription>
            </div>
        </div>

          <div className='flex bg-amber-30 h-full'>
            
          <div className='p-4 w-[50%] flex'>
              hehhe
          </div>
          <div className='w-[50%]'>
            
            <Card className='shadow-none'>
              <CardHeader>
                <CardTitle>Specialization</CardTitle>
                <CardDescription>Here are the speciliazation that the teachers </CardDescription>
                <CardContent>
                  <div>
                    
                  </div>
                </CardContent>
              </CardHeader>
            </Card>
          </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default TeachersDetail

