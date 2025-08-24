// JuniorSchedPage.jsx

import React, { useState, useEffect, useMemo } from 'react';
import { Lock, Search, Trash, Printer } from 'lucide-react';
import { PulseLoader } from 'react-spinners';
import { Button } from '@Components/ui/button';
import { Separator } from '@Components/ui/separator';
import ScheduleTableComponent from '@/Components/Tabs/sheduleTableComponent';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@Components/ui/tabs";
import SelectComponent from '@/Components/Select/selectComponent';
import DayTableComponent from '@/Components/Tabs/dayTableComponent';
// Hooks and Services
import useSectionGetter from '@/lib/hooks/useSections';
import useStrandGetter from '@/lib/hooks/useStrands';
import useTrackGetter from '@/lib/hooks/useTracks';

const LOCAL_STORAGE_KEY = 'selectedGeneratedSchedule';
const year_id = 1;

/**
 * Renders the schedule for Junior High students, allowing filtering by track, strand, and section.
 * The schedule is fetched from an API constructed dynamically based on user selections.
 */
function JuniorSchedPage() {
  const { data: allTrackData, isLoading: trackIsLoading } = useTrackGetter();
  const { data: allSectionData, isLoading: sectionsIsLoading } = useSectionGetter();
  const { data: allStrandData, isLoading: strandIsLoading } = useStrandGetter();

  const [selectedStrand, setSelectedStrand] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [activeTrack, setActiveTrack] = useState(null);
  const [api, setApi] = useState('');

  const [scheduleTable, setscheduleTable] = useState();

  // Load schedule ID from local storage on initial render
  const [selectedGeneratedSchedule] = useState(() => {
    if (typeof window !== 'undefined') {
      const storedValue = localStorage.getItem(LOCAL_STORAGE_KEY);
      return storedValue ? JSON.parse(storedValue) : {};
    }
    return {};
  });

  // Effect to set the initial active track when data loads
  useEffect(() => {
    if (allTrackData && allTrackData.length > 0 && activeTrack === null) {
      setActiveTrack(allTrackData[0].id);
    }
  }, [allTrackData, activeTrack]);

  // Derived state for filtering strands based on the active track.
  // Use useMemo to avoid re-calculating on every render.
  const strandsForActiveTrack = useMemo(() => {
    if (!allStrandData || !activeTrack) {
      return [];
    }
    return allStrandData.filter(s => s.track.id === activeTrack);
  }, [allStrandData, activeTrack]);

  // Derived state for filtering sections based on the selected strand.
  const sectionsForSelectedStrand = useMemo(() => {
    if (!allSectionData || !selectedStrand) {
      return [];
    }
    const selectedStrandId = allStrandData.find(s => s.code === selectedStrand)?.id;
    if (!selectedStrandId) {
      return [];
    }
    return allSectionData.filter(a =>
      a.strand.id === selectedStrandId &&
      a.strand.track.id === activeTrack &&
      a.year_level.id === year_id
    );
  }, [allSectionData, selectedStrand, allStrandData, activeTrack]);

  // Effect to construct the API URL based on user selections.
  useEffect(() => {
    if (selectedGeneratedSchedule.id && activeTrack) {
      const strandId = strandsForActiveTrack.find(s => s.code === selectedStrand)?.id;
      const sectionId = sectionsForSelectedStrand.find(a => a.name === selectedSection)?.id;

      let newApi = `${selectedGeneratedSchedule.id}&track_id=${activeTrack}&year_level_ids=${year_id}`;

      if (strandId) {
        newApi += `&strand_ids=${strandId}`;
      }
      if (sectionId) {
        newApi += `&section_ids=${sectionId}`;
      }
      ;
      setApi(newApi);
      if(newApi) {
        if(sectionId) {
          console.log(newApi)
          setscheduleTable(<DayTableComponent scheduleId={newApi} />);
        } else {
          console.log(newApi)
          setscheduleTable(<ScheduleTableComponent scheduleId={newApi} />);
        }
      }
     
    }
  }, [
    selectedGeneratedSchedule.id,
    activeTrack,
    selectedStrand,
    selectedSection,
    strandsForActiveTrack,
    sectionsForSelectedStrand
  ]);

  // Handles track changes and resets strand and section selections
  const handleTrackChange = (value) => {
    setActiveTrack(value);
    setSelectedStrand('');
    setSelectedSection('');
  };
  
  // Handles strand changes and resets section selection
  const handleStrandChange = (value) => {
    setSelectedStrand(value);
    setSelectedSection('');
  };

  // Show loading state while data is being fetched
  if ( !trackIsLoading || !sectionsIsLoading || !strandIsLoading) {
    return (
    <div className='container mx-auto p-4 relative'>
      <Tabs value={activeTrack} onValueChange={handleTrackChange}>
        <div className='flex items-center justify-between'>
          <div className='flex gap-5 items-center justify-center h-8'>
            <h3 className='text-2xl font-semibold'>Grade 11</h3>
            <Separator orientation='vertical' className='!h-6 !w-[2px]' />
            <TabsList className="rounded-[2px] border border-dashed bg-gray-200 dark:bg-transparent">
              {allTrackData.map((e) => (
                <TabsTrigger className='rounded-[2px] shadow-2xl' key={e.id} value={e.id}>
                  {e.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </div>
        {allTrackData.map((e) => (
          <TabsContent key={e.id} value={e.id}>
             <div className='py-4 border-b-1 mb-4 justify-between sm:items-center items-start lg:flex'>
              <div className='flex gap-[5%] mb-2 lg:mb-0 w-full min-w-[300px] max-w-[700px]'>
                <SelectComponent
                  items={strandsForActiveTrack.map((a) => a.code)}
                  label="Strand"
                  value={selectedStrand}
                  onChange={handleStrandChange}
                />
                <SelectComponent
                  disabled={!selectedStrand}
                  items={sectionsForSelectedStrand.map((a) => a.name)}
                  label="Section"
                  value={selectedSection}
                  onChange={setSelectedSection}
                />
              </div>
              <Button className="border border-dashed ">
                <Printer />
                <span>Print</span>
              </Button>
            </div>
            <div>
              {api && scheduleTable}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
  }

  

  

export default JuniorSchedPage;
