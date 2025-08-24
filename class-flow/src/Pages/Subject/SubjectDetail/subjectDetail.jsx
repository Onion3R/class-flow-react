import React, { useEffect, useState, useMemo } from 'react';
import { redirect, useParams, useNavigate} from 'react-router-dom';
import CryptoJS from 'crypto-js';
import { Separator } from '@/Components/ui/separator';
import { getSpecificSubjectStrand } from '@/services/apiService';
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
import { Button } from '@/Components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/Components/ui/avatar'
import useTeachersGetter from '@/lib/hooks/useTeachers';
import { Link } from "react-router-dom";
import DialogComponent from '@/Components/Dialog/diaglogComponent';
import {Badge} from '@/Components/ui/badge';
import AlertDialogComponent from '@/Components/AlertDialog/alertDialogComponent';

const SECRET_KEY = import.meta.env.VITE_SECRET_KEY;

function SubjectDetail() {
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

  const badgeColorPalette = useMemo(() => ([
          {
              bg: 'bg-rose-100 dark:bg-rose-100',
              text: 'text-rose-800 dark:text-black/80',
          },
          {
              bg: 'bg-sky-100 dark:bg-sky-200/90',
              text: 'text-sky-800 dark:text-black/80',
          },
          {
              bg: 'bg-emerald-100 dark:bg-emerald-100/90',
              text: 'text-emerald-800 dark:text-black/80',
          },
          {
              bg: 'bg-purple-100 dark:bg-purple-100/90',
              text: 'text-purple-800 dark:text-black/80',
          },
          {
              bg: 'bg-yellow-100 dark:bg-yellow-200',
              text: 'text-yellow-800 dark:text-black/80',
          },
      ]), []);
      
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
              <Card>
                <CardContent className='flex flex-col lg:flex-row gap-5 bg-re'>
                  <Avatar className="h-20 w-20">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <div className='w-full  lg:border-t-0  border-t-2  lg:pt-0 pt-3  '>
                    <div className='flex justify-between'>
                      <div>
                        <CardTitle>
                          {teacher.full_name}
                        </CardTitle>
                        <CardDescription className='w-full'>
                          {teacher.first_name} @gmail.com
                        </CardDescription>
                      </div>
                      <CardAction>
                        <Link to={`/admin/teachers/teacher-detail/${encodeURIComponent(CryptoJS.AES.encrypt(teacher.id.toString(), SECRET_KEY).toString())}`} >
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
                         const paletteLength = badgeColorPalette.length;
                      const shiftedIndex = (specIndex + teacherIndex + 2) % paletteLength;
                      const color = badgeColorPalette[shiftedIndex];
                        return (
                            <Badge className={` ${color.bg} ${color.text}`}>{spec.subject_title}</Badge>
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
