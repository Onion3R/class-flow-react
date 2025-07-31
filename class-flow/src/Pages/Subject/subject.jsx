// src/SubjectPage.jsx
import React, { useState, useEffect, useMemo } from 'react';
import TabsComponent from '@/Components/Tabs/tabsComponent'; // Your inner tabs component
import { PulseLoader } from 'react-spinners';
import { getColumns } from './column'; // Defines your table columns for subjects
import { Separator } from '@/Components/ui/separator';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@Components/ui/tabs"; // Shadcn Tabs
import trackGetter from '@/lib/hooks/useTracks';   // Custom hook for track data
import strandGetter from '@/lib/hooks/useStrands'; // Custom hook for strand data
import CourseFormDialog from '@/Components/CourseForm/courseFormPopover'; // Assuming this is your add component
import subjectGetter from './useSubject'; // Your custom hook for subject data

function SubjectPage() {
  // --- Fetching Data ---
  const { data: allSubjectData, isLoading: subjectsIsLoading } = subjectGetter();
  const { data: allStrandData, isLoading: strandIsLoading } = strandGetter();
  const { data: allTrackData, isLoading: trackIsLoading } = trackGetter();

  // --- State for active selections ---
  const [selectedTrackId, setSelectedTrackId] = useState(null); // Active track ID (e.g., 1 for Academic)
  const [selectedStrandCode, setSelectedStrandCode] = useState(null);

  // --- State for filtered subject data at various stages ---
  const [subjectsFilteredByTrack, setSubjectsFilteredByTrack] = useState([]);
  const [finalFilteredSubjects, setFinalFilteredSubjects] = useState([]); // Filtered by Track AND Strand

  // --- Loading State ---
  const overallLoading = subjectsIsLoading || strandIsLoading || trackIsLoading;

  // --- Effect 1: Initialize selectedTrackId when trackData loads ---
  useEffect(() => {
    if (allTrackData && Array.isArray(allTrackData) && allTrackData.length > 0 && selectedTrackId === null) {
      setSelectedTrackId(allTrackData[0].id); // Set the first track as default
    }
  }, [allTrackData, selectedTrackId]);


  // --- Effect 2: Filter subjects by Track and set initial selected strand ---
  useEffect(() => {
    if (allSubjectData && Array.isArray(allSubjectData) && selectedTrackId !== null) {
      const filteredByTrack = allSubjectData.filter(item =>
        item.strand && item.strand.track && item.strand.track.id === selectedTrackId
      );
      setSubjectsFilteredByTrack(filteredByTrack);

      // Also, when the track changes, set the initial selected strand
      if (allStrandData && Array.isArray(allStrandData)) {
        const strandsForCurrentTrack = allStrandData.filter(
          strand => strand.track && strand.track.id === selectedTrackId
        );
        // Only set if no strand is currently selected, or if the previously selected strand
        // doesn't exist in the new track's strands (to ensure a valid default).
        if (strandsForCurrentTrack.length > 0) {
          const isCurrentStrandValid = selectedStrandCode && strandsForCurrentTrack.some(s => s.code === selectedStrandCode);
          if (!isCurrentStrandValid) {
            setSelectedStrandCode(strandsForCurrentTrack[0].code); // Set the first strand as default
          }
        } else {
          setSelectedStrandCode(null); // No strands for this track
        }
      }
    } else {
      setSubjectsFilteredByTrack([]);
      setSelectedStrandCode(null); // Reset strand if no track selected or no subject data
    }
  }, [allSubjectData, selectedTrackId, allStrandData, selectedStrandCode]);


  // --- Effect 3: Filter subjects by Strand whenever subjectsFilteredByTrack or selectedStrandCode changes ---
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


  // --- Memoized list of strands relevant to the current track ---
  const strandsForCurrentTrack = useMemo(() => {
    if (Array.isArray(allStrandData) && selectedTrackId !== null) {
      return allStrandData.filter(strand => strand.track && strand.track.id === selectedTrackId);
    }
    return [];
  }, [allStrandData, selectedTrackId]);

  // --- Derive the current track object and its name (Corrected find method usage) ---
  const currentTrack = useMemo(() => {
    if (Array.isArray(allTrackData) && selectedTrackId !== null) {
      return allTrackData.find(track => track.id === selectedTrackId);
    }
    return null; // Return null if data isn't ready or selectedTrackId is null
  }, [allTrackData, selectedTrackId]);

  const trackNameForForm = currentTrack?.name || null; // This will be "Academic Track", "TVL Track", etc.
  const strandCodeForForm = selectedStrandCode; // This will be "GAS", "HUMSS", etc.

  // --- Handler for when an inner strand tab is changed ---
  const handleStrandChange = (newStrandCode) => {
    console.log("Strand changed to:", newStrandCode);
    setSelectedStrandCode(newStrandCode); // Update the state
  };

  return (
    <div className='h-screen'>
      <div className="p-4 sm:w-auto w-full">
        {/* Outer Tabs: Track Selection */}
        <Tabs
          value={String(selectedTrackId || '')} // Convert ID to string for Tabs value, handle null initially
          onValueChange={(value) => setSelectedTrackId(Number(value))} // Convert back to number
        >
          <div className='flex items-center justify-between'>
            <div className='flex gap-5 items-center justify-center h-8'>
              <h1 className="text-2xl font-bold my-2 container mx-auto">Subjects</h1>
              <Separator orientation='vertical' className='!h-6 !w-[2px]' />
              <TabsList className="rounded-[2px] shadow-2xl border border-dashed bg-gray-200 dark:bg-transparent">
                {Array.isArray(allTrackData) && allTrackData.map((track) => (
                  <TabsTrigger
                    className='rounded-[2px] shadow-2xl'
                    value={String(track.id)} // Use string ID for TabsTrigger value
                    key={track.id}
                  >
                    {track.name}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
            <PulseLoader size={6} loading={overallLoading} />
          </div>

          {/* TabsContent for each Track (Outer Tabs) */}
          {Array.isArray(allTrackData) && allTrackData.map((track) => (
            <TabsContent value={String(track.id)} key={track.id}>
              {/* Inner Tabs: Strand Selection (TabsComponent) */}
              <TabsComponent
                data={finalFilteredSubjects} // Pass the data filtered by BOTH track and strand
                getColumns={getColumns}
                filteredData="subject.title" // Assuming main search is on subject title
                // For DataTable's ComboBoxes, pass the exact paths as column IDs
                yearLevelFilterColumnId="year_level.name" // Path for Year Level
                semesterFilterColumnId="semester.name"   // Path for Semester
                tabList={strandsForCurrentTrack.map(s => ({ value: s.code, label: s.code }))} // Pass objects for TabsComponent to display names
                addComponent={
                  <CourseFormDialog
                    track={trackNameForForm} // Pass the track name for the dialog description
                    strand={strandCodeForForm} // Pass the strand code for the dialog description
                  />
                }
                isLoading={overallLoading}
                onStrandChange={handleStrandChange} // Pass the handler for strand changes
                selectedStrandTab={selectedStrandCode} // Pass the currently active strand code
              />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}

export default SubjectPage;