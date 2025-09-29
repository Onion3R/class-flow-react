import React, { useState, useEffect, useMemo } from 'react';
import TabsComponent from '@/components/Tabs/tabsComponent';
import { PulseLoader } from 'react-spinners';
import { getColumns } from './config/column';
import { Separator } from '@/components/ui/separator';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@Components/ui/tabs";
import LoadingCard from '@/components/LoadingCard/loadingCard';
import { ExternalLink, CircleAlert } from 'lucide-react';
import SubjectWithAssignmentFormPopover from '@/features/admin/pages/subjects/pages/SubjectPage/components/SubjectWithAssignmentFormPopover';
import { Card, CardContent, CardDescription, CardTitle, CardHeader } from '@/components/ui/card';

import useTracks from '@/lib/hooks/useTracks';
import useStrands from '@/lib/hooks/useStrands';
import useSubjectStrandGetter from '@/lib/hooks/useSubjectStrand'
const EmptyMessage = (
    <span className='flex'>
        This track doesn't have any strand and subjects. Go to
        <span className="font-medium mx-1">Programs</span>
        <span className='flex items-center justify-center'>
            to create them.<ExternalLink className="w-4 h-4 ml-1 mt-1 sm:mt-0" />
        </span>
    </span>
);

const NoDataMessage = (
    <span className='flex items-end justify-center'>
        No data found on the database <CircleAlert className="w-4 h-4 ml-1 mb-0.5 sm:mt-0" />
    </span>
);

function useSubjectPageState() {
    const { data: allSubjectData, isLoading: subjectsIsLoading, refresh: refreshSubjectStrand } = useSubjectStrandGetter();
    const { data: allStrandData, isLoading: strandIsLoading } = useStrands();
    const { data: allTrackData, isLoading: trackIsLoading } = useTracks();

    const [selectedTrackId, setSelectedTrackId] = useState(null);
    const [selectedStrandCode, setSelectedStrandCode] = useState(null);
    const [selectedStrandId, setSelectedStrandId] = useState('');
    const [subjectsFilteredByTrack, setSubjectsFilteredByTrack] = useState([]);
    const [finalFilteredSubjects, setFinalFilteredSubjects] = useState([]);
    const [flattenedSubjects, setFlattenedSubjects] = useState([]);

    const overallLoading = subjectsIsLoading || strandIsLoading || trackIsLoading;

    // Set default track
    useEffect(() => {
        if (Array.isArray(allTrackData) && allTrackData.length > 0 && selectedTrackId === null) {
            setSelectedTrackId(allTrackData[0].id);
        }
    }, [allTrackData, selectedTrackId]);

    // Filter subjects by track and handle strand selection
    useEffect(() => {
        if (Array.isArray(allSubjectData) && selectedTrackId !== null) {
            const filteredByTrack = allSubjectData.filter(item =>
                item.strand?.track?.id === selectedTrackId
            );
            setSubjectsFilteredByTrack(filteredByTrack);

            if (Array.isArray(allStrandData)) {
                const strandsForCurrentTrack = allStrandData.filter(
                    strand => strand.track?.id === selectedTrackId
                );
                const isCurrentStrandValid = selectedStrandCode && strandsForCurrentTrack.some(s => s.code === selectedStrandCode);
                if (!isCurrentStrandValid && strandsForCurrentTrack.length > 0) {
                    setSelectedStrandCode(strandsForCurrentTrack[0].code);
                } else if (strandsForCurrentTrack.length === 0) {
                    setSelectedStrandCode(null);
                }
            }
        } else {
            setSubjectsFilteredByTrack([]);
            setSelectedStrandCode(null);
        }
    }, [allSubjectData, selectedTrackId, allStrandData, selectedStrandCode]);

    // Set selectedStrandId when selectedStrandCode changes
    useEffect(() => {
        if (selectedStrandCode && Array.isArray(allStrandData)) {
            const strand = allStrandData.find(s => s.code === selectedStrandCode);
            setSelectedStrandId(strand?.id || '');
        }
    }, [selectedStrandCode, allStrandData]);

    // Filter subjects by strand
    useEffect(() => {
        if (Array.isArray(subjectsFilteredByTrack) && selectedStrandCode !== null) {
            const filtered = subjectsFilteredByTrack.filter(item =>
                item.strand?.code === selectedStrandCode
            );
            setFinalFilteredSubjects(filtered);
        } else {
            setFinalFilteredSubjects([]);
        }
    }, [subjectsFilteredByTrack, selectedStrandCode]);

    // Flatten subjects for table
    useEffect(() => {
        if (Array.isArray(finalFilteredSubjects)) {
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
            return allStrandData.filter(strand => strand.track?.id === selectedTrackId);
        }
        return [];
    }, [allStrandData, selectedTrackId]);

    const currentTrack = useMemo(() => {
        if (Array.isArray(allTrackData) && selectedTrackId !== null) {
            return allTrackData.find(track => track.id === selectedTrackId);
        }
        return null;
    }, [allTrackData, selectedTrackId]);

    return {
        allTrackData,
        allSubjectData,
        strandsForCurrentTrack,
        flattenedSubjects,
        selectedTrackId,
        setSelectedTrackId,
        selectedStrandCode,
        setSelectedStrandCode,
        selectedStrandId,
        currentTrack,
        overallLoading,
        refreshSubjectStrand,
    };
}

function SubjectPage() {
    const {
        allTrackData,
        allSubjectData,
        strandsForCurrentTrack,
        flattenedSubjects,
        selectedTrackId,
        setSelectedTrackId,
        selectedStrandCode,
        setSelectedStrandCode,
        selectedStrandId,
        currentTrack,
        overallLoading,
        refreshSubjectStrand,
    } = useSubjectPageState();

    const handleStrandChange = (newStrandCode) => setSelectedStrandCode(newStrandCode);
    const handleRefresh = () => refreshSubjectStrand();

    return (
        <div className="container p-4 mx-auto  ">
            <div className="sm-auto">
                <Tabs
                    value={selectedTrackId ? String(selectedTrackId) : ''}
                    onValueChange={value => setSelectedTrackId(Number(value))}
                >
                    <div className="flex items-center sm:items-center justify-between mb-4 sm:mb-none  ">
                        <div className="flex sm:flex-row sm:gap-5 gap-2 sm:items-center items-start flex-col ">
                            <h1 className="text-2xl font-bold">Subjects</h1>
                            <Separator orientation="vertical" className="!h-6 !w-[2px] sm:block hidden " />
                            {!overallLoading && allTrackData?.length > 0 && (
                                <TabsList className="rounded shadow border border-dashed bg-muted dark:bg-transparent">
                                    {allTrackData.map(track => (
                                        <TabsTrigger
                                            className="rounded px-3 py-1"
                                            value={String(track.id)}
                                            key={track.id}
                                        >
                                            {track.name}
                                        </TabsTrigger>
                                    ))}
                                </TabsList>
                            )}
                           
                        </div>
                        <PulseLoader size={6} loading={overallLoading} color={'#808080'} />
                    </div>
                    {overallLoading ? (
                        <LoadingCard variant="database" />
                    ) : (
                        allSubjectData && allSubjectData.length !== 0 ? (
                            strandsForCurrentTrack.length > 0 ? (
                                <Card className="bg-transparent !gap-2">
                                    <CardHeader>
                                        <CardTitle>Add Subjects</CardTitle>
                                        <CardDescription>
                                            You can manage sections here.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        {allTrackData.map(track => (
                                            <TabsContent value={String(track.id)} key={track.id} className='w-full'>
                                                <TabsComponent
                                                    data={flattenedSubjects}
                                                    getColumns={getColumns}
                                                    alertDialogData={{
                                                        id: 'subject',
                                                        desc: "This action cannot be undone. This will permanently delete your account and remove your data from our servers."
                                                    }}
                                                    filteredData={{ columnId: "subjectTitle", label: "Title" }}
                                                    filterComboBoxes={[
                                                        {
                                                            columnId: "yearLevelName",
                                                            label: "Year Level",
                                                            labelFormatter: value => value,
                                                        },
                                                        {
                                                            columnId: "semesterName",
                                                            label: "Semester",
                                                            labelFormatter: value => value,
                                                        },
                                                    ]}
                                                    onRefresh={handleRefresh}
                                                    tabList={strandsForCurrentTrack.map(s => ({ value: s.code, label: s.code }))}
                                                    addComponent={
                                                        <SubjectWithAssignmentFormPopover
                                                            track={currentTrack?.name || null}
                                                            strand={selectedStrandCode}
                                                            strandId={selectedStrandId}
                                                            onRefresh={refreshSubjectStrand}
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
                            ) : (
                                <LoadingCard message={EmptyMessage} variant='default' />
                            )
                        ) : (
                            <LoadingCard message={NoDataMessage} variant='default' />
                        )
                    )}
                </Tabs>
            </div>
        </div>
    );
}

export default SubjectPage;
