import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import CryptoJS from 'crypto-js';
import { Separator } from '@/Components/ui/separator';
import { getSpecificSubjectStrand } from '@/services/apiService';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from '@/Components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/Components/ui/avatar'
import useTeachersGetter from '@/lib/hooks/useTeachers';
import { Link } from "react-router-dom";
const SECRET_KEY = import.meta.env.VITE_SECRET_KEY;

function SubjectDetail() {
  const [assignedTeacher, setAssignedTeacher] = useState(null);

  const { data: allTeachersData } = useTeachersGetter()

  const { id } = useParams(); // This is either plain or encrypted
  const [subjectId, setSubjectId] = useState(null);
  const [data, setData] = useState();

  useEffect(() => {
    try {
      const bytes = CryptoJS.AES.decrypt(decodeURIComponent(id), SECRET_KEY);
      const originalId = bytes.toString(CryptoJS.enc.Utf8);
      setSubjectId(originalId);
    } catch (error) {
      console.error("Failed to decrypt ID:", error);
      setSubjectId(id); // fallback to plain ID
    }
  }, [id]);

  useEffect(() => {
    if (subjectId) {
      getSpecificSubjectStrand(subjectId)
        .then((data) => {
          setData(data);
          console.log(subjectId);
          console.log("Fetched subject strand data:", data);
        })
        .catch((error) => {
          console.error("Error fetching subject strand data:", error);
        });
    }
  }, [subjectId]);

  useEffect(() => {
    if (data && allTeachersData?.length > 0) {
      console.log("All teachers data:", allTeachersData);
      console.log("Current subject data:", data);
      console.log("Finding teacher for subject code:", data?.subject?.code);
      const teacher = allTeachersData.find(
        (t) => t.specializations.find((s) => s.subject_code === data?.subject?.code)
      );
      setAssignedTeacher(teacher);
      console.log("Assigned teacher:", teacher);
    }
  }, [data, allTeachersData]);

  return (
    <div className='container mx-auto p-6'>
      <h1 className='text-2xl font-bold mb-4'>Subject Detail</h1>
      {/* grid [grid-template-columns:1fr_2fr] */}
      <div className=' w-full flex gap-7'>
        <Card className='max-w-[500px] w-[40%] bg-transparent'>
          <CardHeader>
            <CardTitle>
              {data?.subject.code}: {data?.subject.title}
            </CardTitle>
            <CardDescription>
              {data?.subject?.description === '' ? 'Subject has no description' : data?.subject.description}
            </CardDescription>
          </CardHeader>
          <Separator />
          <CardContent className='px-10'>
            <CardTitle>Info:</CardTitle>
            <CardDescription className='mt-2'>
              Track: {data?.strand.track.name} <br />
              Strand: {data?.strand.name} <br />
             Semester: {data?.semester.name} <br />
              Year Level: {data?.year_level.name} <br />
              Minutes per Week: {data?.subject.minutes_per_week}  <br />
              {/* Teacher: { data?.teacher.name} <br /> */}
            </CardDescription>
          </CardContent>
        </Card>
        <div className='w-[60%]'>
          <h1 className='mb-2'>Teachers assigned to this subject:</h1>
          <div className='p-2'>
            {assignedTeacher && assignedTeacher.length != 0 ? (
              <Card className='bg-muted'>
                <CardContent className='flex gap-5 bg-re'>
                  <Avatar className="h-20 w-20">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <div className='w-full'>
                    <div className='flex justify-between'>
                      <div>
                        <CardTitle>
                          {assignedTeacher.full_name}
                        </CardTitle>
                        <CardDescription className='w-full'>
                          {assignedTeacher.first_name} @gmail.com
                        </CardDescription>
                      </div>
                      <CardAction>
                        <Link to={`/admin/teachers/`} passHref>
                          <Button variant="link" className="cursor-pointer">
                            Check profile
                          </Button>
                        </Link>
                      </CardAction>
                    </div>
                    <Separator className='my-2' />
                    <div className=' w-full  flex h-5 '>
                      <span className='text-sm font-medium'>Subjects:</span>
                      {assignedTeacher.specializations.map((spec) => (
                        <>
                        <span 
                        key={spec.id}
                        className='text-sm text-muted-foreground ml-2'
                        > {spec.subject_title}
                        </span>
                         </>
                      ))}
                     
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className='text-gray-500'>No teacher assigned to this subject.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SubjectDetail;
