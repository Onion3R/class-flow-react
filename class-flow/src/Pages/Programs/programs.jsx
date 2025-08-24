"use client";
import React, { useState, useEffect, useMemo } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

import { Separator } from '@/Components/ui/separator';
import LoadingCard from '../../Components/LoadingCard/loadingCard';
import DataTableComponent from '@/Components/DataTable/dataTableComponent';
import { PulseLoader } from 'react-spinners';
import AlertComponent from '@/Components/Alert/alertComponent';

// Import your refactored data-fetching hooks
import useTrackGetter from '@/lib/hooks/useTracks';
import useStrandGetter from '@/lib/hooks/useStrands';
import useSectionGetter from '@/lib/hooks/useSections';

import { getColumns as getTrackColumns } from './Tracks/columns';
import { getColumns as getStrandColumns } from './Strands/columns';
import { getColumns as getSectionColumns } from './Sections/columns';

import TrackFormPopover from '@/Components/TrackForm/trackFormPopover';
import StrandFormPopover from '@/Components/StrandForm/strandFormPopover';
import SectionFormPopover from '@/Components/SectionForm/sectionFormPopover';

const tablist = ['Tracks', 'Strands', 'Sections'];

function Programs() {
  // Destructure the data, loading state, and refresh function from each hook.
  const { data: allTrackData, isLoading: trackIsLoading, refresh: refreshTracks, error} = useTrackGetter();
  const { data: allSectionData, isLoading: sectionIsLoading, refresh: refreshSections } = useSectionGetter();
  const { data: allStrandData, isLoading: strandIsLoading, refresh: refreshStrands } = useStrandGetter();

  const [activeTab, setActiveTab] = useState(tablist[0]);
  const overallLoading = trackIsLoading || sectionIsLoading || strandIsLoading;
  const allDataIsNotEmpty = !overallLoading && (allTrackData?.length || allSectionData?.length || allStrandData?.length);

  // Memoize and pre-process the strand data
  // const strandsWithTrackNames = useMemo(() => {
  //   if (!allStrandData || !Array.isArray(allStrandData)) {
  //     return [];
  //   }
  //   return allStrandData.map(strand => ({
  //     ...strand,
  //     trackName: strand.track?.name || 'Unknown Track'
  //   }));
  // }, [allStrandData]);

  // This handler now calls the correct, self-contained refresh function from the hook's return value.
  function handleTabChange(value) {
    setActiveTab(value)
    refreshSections()
    refreshStrands()
    refreshTracks()
  }
  const handleRefresh = (tabName) => {
    console.log(`Refetching data for tab: ${tabName}`);
    switch (tabName) {
      case 'Tracks':
        refreshTracks();
        break;
      case 'Strands':
        refreshStrands();
        break;
      case 'Sections':
        refreshSections();
        break;
      default:
        console.log('Unknown tab name for refresh');
    }
  };

  return (
    <div className="container p-4 mx-auto">
      <div className="sm:w-auto ">
        <Tabs value={activeTab} onValueChange={(value) => handleTabChange(value)} className='m-0'>
          <div className='flex items-center justify-between mb-4' >
            <div className='flex sm:flex-row flex-col sm:gap-5 gap-2 sm:items-center items-start justify-center h-auto'>
              <h1 className="text-2xl font-bold ">Academic Programs</h1>
              <Separator orientation='vertical' className='!h-6 !w-[2px] sm:block hidden' />
              <TabsList className="rounded shadow border border-dashed bg-muted dark:bg-transparent">
                {tablist.map((tabName) => (
                  <TabsTrigger className='rounded-[2px]' key={tabName} value={tabName}>{tabName}</TabsTrigger>
                ))}
              </TabsList>
            </div>
            <PulseLoader size={6} loading={overallLoading} color={'#808080'} />
          </div>
          {tablist.map((tabName) => (
            <TabsContent key={tabName} value={tabName} className='w-full'>
              {overallLoading ? <LoadingCard variant='database' /> 
              : 
              ( 
                
                <div>
                  {error && 
                  (
                    <AlertComponent/>
                  )}
                <Card className='bg-transparent mt-1'>
                <div>
                  <CardHeader>
                    <CardTitle>Add {tabName.slice(0, -1)}</CardTitle>
                    <CardDescription className='mb-4'>
                      You can manage {tabName.toLowerCase()} here.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {activeTab === 'Tracks' && (
                      <DataTableComponent
                        data={allTrackData}
                        getColumns={getTrackColumns}
                        alertDialogData={{
                          id: 'track',
                          desc: "This action cannot be undone. This will permanently delete your account and remove your data from our servers."
                        }}
                        filteredData={{ columnId: "name", label: "track name" }}
                        filterComboBoxes={[]}
                        // Pass the refreshTracks function directly to the addComponent
                        addComponent={<TrackFormPopover onRefresh={refreshTracks} />}
                        onRefresh={() => handleRefresh('Tracks')}
                      />
                    )}

                    {activeTab === 'Strands' &&  (
                      <DataTableComponent
                        data={allStrandData}
                        getColumns={getStrandColumns}
                        alertDialogData={{
                          id: 'strand',
                          desc: "This action cannot be undone. This will permanently delete your account and remove your data from our servers."
                        }}
                        filteredData={{ columnId: "name", label: "strand name" }}
                        filterComboBoxes={[
                          {
                            columnId: "trackName",
                            label: "Track",
                            labelFormatter: (value) => value,
                          },
                        ]}
                        // Pass the refreshStrands function directly to the addComponent
                        addComponent={<StrandFormPopover onRefresh={refreshStrands} />}
                        onRefresh={() => handleRefresh('Strands')}
                      />
                    )}

                    {activeTab === 'Sections' && (
                      <DataTableComponent
                        data={allSectionData}
                        getColumns={getSectionColumns}
                        alertDialogData={{
                          id: 'section',
                          desc: "This action cannot be undone. This will permanently delete your account and remove your data from our servers."
                        }}
                        filteredData={{ columnId: "name", label: "section name" }}
                        filterComboBoxes={[
                          {
                            columnId: "track.name",
                            label: "Track",
                            labelFormatter: (value) => value,
                          },
                          {
                            columnId: "strand.name",
                            label: "Strand",
                            labelFormatter: (value) => value,
                          },
                          {
                            columnId: "year_level.name",
                            label: "Year Level",
                            labelFormatter: (value) => value,
                          },
                        ]}
                        // Pass the refreshSections function directly to the addComponent
                        addComponent={<SectionFormPopover onRefresh={refreshSections} />}
                        onRefresh={() => handleRefresh('Sections')}
                      />
                    )}
                  </CardContent>
                </div>
              </Card>
              </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}

export default Programs;
