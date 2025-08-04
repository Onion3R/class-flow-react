import React, { useState, useEffect, useMemo } from 'react';
import TabsComponent from '@/Components/Tabs/tabsComponent';
import { PulseLoader } from 'react-spinners';
import { getColumns } from './column';
import { Separator } from '@/Components/ui/separator';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@Components/ui/tabs";
import SubjectWithAssignmentFormPopover from '@/Components/CourseForm/courseFormPopover';
import { Card, CardContent } from '@/Components/ui/card';

import trackGetter from '@/lib/hooks/useTracks';
import strandGetter from '@/lib/hooks/useStrands';
import subjectStrandGetter from '../../lib/hooks/useSubjectStrand';


function SubjectPage() {
    const { data: allSubjectData, isLoading: subjectsIsLoading } = subjectStrandGetter();
    const { data: allStrandData, isLoading: strandIsLoading } = strandGetter();
    const { data: allTrackData, isLoading: trackIsLoading } = trackGetter();

    const [selectedTrackId, setSelectedTrackId] = useState(null);
    const [selectedStrandCode, setSelectedStrandCode] = useState(null);
    const [selectedStrandId, setSelectedStrandId] = useState()
    const [subjectsFilteredByTrack, setSubjectsFilteredByTrack] = useState([]);
    const [finalFilteredSubjects, setFinalFilteredSubjects] = useState([]);
    const [flattenedSubjects, setFlattenedSubjects] = useState([]);

    const overallLoading = subjectsIsLoading || strandIsLoading || trackIsLoading;

    useEffect(() => {
        if (allTrackData && Array.isArray(allTrackData) && allTrackData.length > 0 && selectedTrackId === null) {
            setSelectedTrackId(allTrackData[0].id);
        }
    }, [allTrackData, selectedTrackId]);

    useEffect(() => {
        if (allSubjectData && Array.isArray(allSubjectData) && selectedTrackId !== null) {
            const filteredByTrack = allSubjectData.filter(item =>
                item.strand && item.strand.track && item.strand.track.id === selectedTrackId
            );
            setSubjectsFilteredByTrack(filteredByTrack);

            if (allStrandData && Array.isArray(allStrandData)) {
                const strandsForCurrentTrack = allStrandData.filter(
                    strand => strand.track && strand.track.id === selectedTrackId
                );
                const isCurrentStrandValid = selectedStrandCode && strandsForCurrentTrack.some(s => s.code === selectedStrandCode);
                if (!isCurrentStrandValid && strandsForCurrentTrack.length > 0) {
                    setSelectedStrandCode(strandsForCurrentTrack[0].code);
                } else if (strandsForCurrentTrack.length === 0) {
                    setSelectedStrandCode(null);
                    
                }
            }

            if(selectedStrandCode) {
              const strandId = allStrandData.find(strand => strand.code === strandCodeForForm)?.id;
              setSelectedStrandId(strandId)
              
            }
        } else {
            setSubjectsFilteredByTrack([]);
            setSelectedStrandCode(null);
        }
    }, [allSubjectData, selectedTrackId, allStrandData, selectedStrandCode]);

    useEffect(() => {
        if (subjectsFilteredByTrack && Array.isArray(subjectsFilteredByTrack) && selectedStrandCode !== null) {
            const filteredByTrackAndStrand = subjectsFilteredByTrack.filter(item =>
                item.strand && item.strand.code === selectedStrandCode
            );
            setFinalFilteredSubjects(filteredByTrackAndStrand);
        } else {
            setFinalFilteredSubjects([]);
        }
    }, [subjectsFilteredByTrack, selectedStrandCode]);

    useEffect(() => {
        if (finalFilteredSubjects && Array.isArray(finalFilteredSubjects)) {
            const flattened = finalFilteredSubjects.map(item => ({
                ...item,
                subjectCode: item.subject?.code,
                subjectTitle: item.subject?.title,
                yearLevelName: item.year_level?.name,
                semesterName: item.semester?.name,
                minutesPerWeek: item.subject?.minutes_per_week,
            }));
            setFlattenedSubjects(flattened);
        } else {
            setFlattenedSubjects([]);
        }
    }, [finalFilteredSubjects]);

    const strandsForCurrentTrack = useMemo(() => {
        if (Array.isArray(allStrandData) && selectedTrackId !== null) {
            return allStrandData.filter(strand => strand.track && strand.track.id === selectedTrackId);
        }
        return [];
    }, [allStrandData, selectedTrackId]);

    const currentTrack = useMemo(() => {
        if (Array.isArray(allTrackData) && selectedTrackId !== null) {
            return allTrackData.find(track => track.id === selectedTrackId);
        }
        return null;
    }, [allTrackData, selectedTrackId]);

    const trackNameForForm = currentTrack?.name || null;
    const strandCodeForForm = selectedStrandCode;

    const handleStrandChange = (newStrandCode) => {
        setSelectedStrandCode(newStrandCode);
    };

    return (
        <div className='h-screen flex justify-center'>
            <div className="p-4 container ">
               
                <Tabs
                    value={String(selectedTrackId || '')}
                    onValueChange={(value) => setSelectedTrackId(Number(value))}
                >
                    <div className='flex items-center justify-between'>
                        <div className='flex gap-5 items-center justify-center h-8'>
                            <h1 className="text-2xl font-bold my-2 container mx-auto">Subjects</h1>
                            <Separator orientation='vertical' className='!h-6 !w-[2px]' />
                            <TabsList className="rounded-[2px] shadow-2xl border border-dashed bg-gray-200 dark:bg-transparent">
                                {Array.isArray(allTrackData) && allTrackData.map((track) => (
                                    <TabsTrigger
                                        className='rounded-[2px] shadow-2xl'
                                        value={String(track.id)}
                                        key={track.id}
                                    >
                                        {track.name}
                                    </TabsTrigger>
                                ))}
                            </TabsList>
                        </div>
                        <PulseLoader size={6} loading={overallLoading} />
                    </div>
                    <Card className='bg-transparent mt-1'>
                        <CardContent>
                        {Array.isArray(allTrackData) && allTrackData.map((track) => (
                            <TabsContent value={String(track.id)} key={track.id}>
                                <TabsComponent
                                    data={flattenedSubjects}
                                    getColumns={getColumns}
                                    dialogData={{ // <-- Corrected spelling
                                        id: 'subject',
                                        desc: "This action cannot be undone. This will permanently delete your account and remove your data from our servers."
                                    }}
                                    filteredData={{ columnId: "subjectTitle", label: "Title" }}
                                    filterComboBoxes={[
                                        {
                                            columnId: "yearLevelName",
                                            label: "Year Level",
                                            labelFormatter: (value) => value,
                                        },
                                        {
                                            columnId: "semesterName",
                                            label: "Semester",
                                            labelFormatter: (value) => value,
                                        },
                                    ]}
                                    tabList={strandsForCurrentTrack.map(s => ({ value: s.code, label: s.code }))}
                                    addComponent={
                                        <SubjectWithAssignmentFormPopover
                                            track={trackNameForForm}
                                            strand={strandCodeForForm}
                                            strandId={selectedStrandId}
                                        />
                                    }
                                    isLoading={overallLoading}
                                    onStrandChange={handleStrandChange}
                                    selectedStrandTab={selectedStrandCode}
                                />
                            </TabsContent>
                        ))}
                        </CardContent>
                    </Card>
                </Tabs>
                
            </div>
        </div>
    );
}

export default SubjectPage;
