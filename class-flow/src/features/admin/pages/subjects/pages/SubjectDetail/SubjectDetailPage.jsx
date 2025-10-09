import React, { useEffect, useState, useMemo } from 'react';
import { redirect, useParams, useNavigate} from 'react-router-dom';
import CryptoJS from 'crypto-js';
import { Separator } from '@/components/ui/separator';
import { getSpecificSubjectStrand } from '@/app/services/apiService';
import { CircleAlert, Trash2 } from 'lucide-react';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import useTeachersGetter from '@/lib/hooks/useTeachers';
import { Link } from "react-router-dom";
import DialogComponent from '@/components/Dialog/diaglogComponent';
import {Badge} from '@/components/ui/badge';
import AlertDialogComponent from '@/components/AlertDialog/AlertDialogComponent';
import { useRandomBadgeColor } from '@/lib/hooks/useRandomBadgeColor';

const SECRET_KEY = import.meta.env.VITE_SECRET_KEY;

function SubjectDetail() {

  const {getColor} = useRandomBadgeColor()
   const navigate = useNavigate();
  const [assignedTeacher, setAssignedTeacher] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openAlertDialog, setOpenAlertDialog] = useState(false);
  

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
     const teacher = allTeachersData.filter(
        (t) => t.specializations.some((s) => s.subject_code === data?.subject?.code)
      );
      setAssignedTeacher(teacher);
      console.log("Assigned teacher:", teacher);
    }
  }, [data, allTeachersData]);

  function onRefresh() {
    navigate(`/admin/subjects`);
  }

  return (
    <div className='container mx-auto p-6'>
      <h1 className='text-2xl font-bold mb-4'>Subject Detail</h1>
      {/* grid [grid-template-columns:1fr_2fr] */}
      <div className=' w-full flex    gap-7 flex-col lg:flex-row '>
        <div className='lg:max-w-[500px] max-w-none  w-full'>
        <Card className='w-full bg-transparent h-auto'>
          <CardHeader>
            <CardTitle>
              {data?.subject.code}: {data?.subject.title}
            </CardTitle>
            <CardDescription>
              {data?.subject?.description === '' ? 'Subject has no description' : data?.subject.description}
            </CardDescription>
          </CardHeader>
          <Separator />
          <CardContent className=''>
            <CardTitle>Info:</CardTitle>
            <CardDescription className='mt-2 p-0 '>
              Track: {data?.strand.track.name} <br />
              Strand: {data?.strand.name} <br />
             Semester: {data?.semester.name} <br />
              Year Level: {data?.year_level.name} <br />
              Minutes per Week: {data?.subject.minutes_per_week}  <br />
            </CardDescription>
          </CardContent>
          <CardFooter>
            <Button variant="secondary" className='w-[calc(100%-50px)]' onClick={(e) =>{
              e.preventDefault(); setOpenDialog(true)}}>Edit Subject</Button>
              <Button className='ml-2.5' variant='outline' onClick={() => setOpenAlertDialog(true)}><Trash2/></Button>
            </CardFooter>
        </Card>
        <Alert className='mt-4'>
          <CircleAlert />
          <AlertTitle>Want to change the track for this subject?</AlertTitle>
          <AlertDescription>
            You can change the track of this subject going to subject and adding this subject to your preferred track.
          </AlertDescription>
      </Alert>
        </div>
        <div className='lg:w-[60%] w-full'>
          <h1 className='mb-2'>Teachers assigned to this subject:</h1>
          <div className='p-2 gap-5 flex flex-col'>
            {assignedTeacher && assignedTeacher.length != 0 ? (
              assignedTeacher.map((teacher, teacherIndex) => (
              <Card className='min-w-none lg:min-w-[492px]'>
                <CardContent className='flex flex-col lg:flex-row gap-5 '>
                  <Avatar className="h-20 w-20 hidden lg:block ">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <div className='w-full  lg:border-t-0  border-t-2  lg:pt-0 pt-3  '>
                    <div className='flex justify-between'>
                      <div className='flex items-center justify-center gap-2 '>
                      <Avatar className="h-10 w-10  lg:h-20 lg:w-20  lg:hidden  ">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                      <div>
                        <CardTitle>
                          {teacher.full_name}
                        </CardTitle>
                        <CardDescription className='w-full'>
                          {teacher.first_name} @gmail.com
                        </CardDescription>
                      </div>
                      </div>
                      <CardAction>
                        <Link to={`/admin/teachers/details/${encodeURIComponent(CryptoJS.AES.encrypt(teacher.id.toString(), SECRET_KEY).toString())}`} >
                          <Button variant="link" className="cursor-pointer" >
                            Check profile
                          </Button>
                        </Link>
                      </CardAction>
                    </div>
                    <Separator className='my-2' />
                    <div className=' w-full flex flex-wrap gap-2'>
                      <span className='text-sm font-medium'>Subjects:</span>
                     {teacher.specializations.map((spec, specIndex) => {
                        const color = getColor(specIndex + teacherIndex + 2); // or use spec.subject_title for consistent mapping
                        return (
                          <Badge className={`${color.bg} ${color.text}`}>
                            {spec.subject_code}
                          </Badge>
                        );
                      })}

                    </div>
                  </div>
                </CardContent>
              </Card>
              ))
            ) : (
              <div className='text-gray-500'>No teacher assigned to this subject.</div>
            )}
          </div>
        </div>
      </div>
       <DialogComponent
              label={'subjects'}
              open={openDialog}
              selectedRow={data}
              onOpenChange={setOpenDialog}
              onConfirm={() => setOpenDialog(false)}
              onRefresh={false}
            />
          <AlertDialogComponent
              open={openAlertDialog}
              selectedRow = {data}
              data={ {
                          id: 'subject',
                          desc: "This action cannot be undone. This will permanently delete this subject."
                        } }
              onOpenChange={setOpenAlertDialog}
              onRefresh={() => onRefresh()}
            />
    </div>
  );
}

export default SubjectDetail;
