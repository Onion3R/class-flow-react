import React, { useMemo } from 'react';
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Pencil, Trash2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import SubjectList from '@/components/List/list';
import { Button } from '@/components/ui/button';
import { deleteSpecializationFromTeacher } from '@/app/services/apiService';

function Specialization({ teacherDetail, teachersId, onRefresh }) {
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

    const handleDelete = async (specializationId) => {
        console.log(`Deleting specialization with ID: ${specializationId}`);
        try {
            await deleteSpecializationFromTeacher(specializationId).then(() => {
                console.log(`Successfully deleted specialization with ID: ${specializationId}`);
                onRefresh();
            });
        } catch (error) {
            console.log('Error deleting specialization:', error);
        }
    };

    return (
         <div className='lg:w-[50%] w-full sm:w-full  md:min-w-[360px] ' >
        <Card className='shadow-none'>
            <CardHeader>
                <CardTitle>Specialization</CardTitle>
                {teacherDetail.specializations && teacherDetail.specializations.length > 0 ?
                    <CardDescription>
                        Below are the subjects and areas of expertise that this teacher specializes in.
                    </CardDescription>
                    :
                    <CardDescription>
                        No specializations found for this teacher. You can assign specializations here.
                    </CardDescription>
                }
                <CardAction>
                    <SubjectList teachersId={teachersId} onRefresh={onRefresh} />
                </CardAction>
            </CardHeader>
            <CardContent className='space-y-2 px-9'>
                <Separator />
                {teacherDetail?.specializations?.map((e, index) => {
                    const color = badgeColorPalette[index % badgeColorPalette.length];
                    return (
                        <div key={index} className='flex flex-col gap-2'>
                            <div className='flex justify-between items-center'>
                                <CardDescription>
                                    <span className='flex'>
                                        <span className='font-bold mr-1 text-muted-foreground'>{e.subject_code}:</span>
                                        <span>{e.subject_title}  <Badge className={`${color.bg} ${color.text} h-fit ml-2`}>{e.proficiency_level}</Badge> </span>
                                       
                                    </span>
                                </CardDescription>
                                <Button variant='outline' size={'sm'} onClick={() => handleDelete(e.id)}><Trash2  /></Button>
                            </div>
                        </div>
                    );
                })}
            </CardContent>
        </Card>
        </div>
    );
}

export default Specialization;
