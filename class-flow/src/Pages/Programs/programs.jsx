// src/Programs.jsx
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
import DataTableComponent from '@/Components/DataTable/dataTableComponent';
import { PulseLoader } from 'react-spinners';

import trackGetter from '@/lib/hooks/useTracks';
import strandGetter from '@/lib/hooks/useStrands';
import sectionGetters from '@/lib/hooks/useSections';

import { getColumns as getTrackColumns } from './Tracks/columns';
import { getColumns as getStrandColumns } from './Strands/columns';
import { getColumns as getSectionColumns } from './Sections/columns';

import TrackFormPopover from '@/Components/TrackForm/trackFormPopover';
import StrandFormPopover from '@/Components/StrandForm/strandFormPopover';
import SectionFormPopover from '@/Components/SectionForm/sectionFormPopover';



const tablist = ['Tracks', 'Strands', 'Sections'];

function Programs() {
  const { data: allTrackData, isLoading: trackIsLoading } = trackGetter();
  const { data: allSectionData, isLoading: sectionIsLoading } = sectionGetters();
  const { data: allStrandData, isLoading: strandIsLoading } = strandGetter();

  const [activeTab, setActiveTab] = useState(tablist[0]);
  const overallLoading = trackIsLoading || sectionIsLoading || strandIsLoading;

  // Memoize and pre-process the strand data to ensure trackName is a direct property
  const strandsWithTrackNames = useMemo(() => {
    // CHANGED: Use a more robust check to ensure allStrandData is an array
    if (!allStrandData || !Array.isArray(allStrandData)) {
      return [];
    }
    return allStrandData.map(strand => ({
      ...strand,
      trackName: strand.track?.name || 'Unknown Track'
    }));
  }, [allStrandData]);

  
  return (
    <div className="h-screen max-h-[calc(100vh-29px)] flex justify-center ">
      <div className="p-4 container ">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className='flex items-center justify-between'>
            <div className='flex gap-5 items-center justify-center h-8'>
              <h1 className="text-2xl font-bold my-2 container mx-auto">Academic Programs</h1>
              <Separator orientation='vertical' className='!h-6 !w-[2px]' />
              <TabsList className="rounded-[2px] shadow-2xl border border-dashed bg-gray-200 dark:bg-transparent">
                {tablist.map((tabName) => (
                  <TabsTrigger className='rounded-[2px]' key={tabName} value={tabName}>{tabName}</TabsTrigger>
                ))}
              </TabsList>
            </div>
            <PulseLoader size={6} loading={overallLoading} />
          </div>
          {tablist.map((tabName) => (
            <TabsContent key={tabName} value={tabName} className='w-full'>
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
                        dialogData={{ // <-- Corrected spelling
                          id: 'track',
                          desc: "This action cannot be undone. This will permanently delete your account and remove your data from our servers."
                      }}
                       filteredData={{ columnId: "name", label: "track name" }}
                        filterComboBoxes={[]}
                        addComponent={<TrackFormPopover />}
                      />
                    )}

                    {activeTab === 'Strands' && !strandIsLoading && strandsWithTrackNames.length > 0 && (
                      <DataTableComponent
                        data={strandsWithTrackNames}
                        getColumns={getStrandColumns}
                         dialogData={{ // <-- Corrected spelling
                          id: 'strand',
                          desc: "This action cannot be undone. This will permanently delete your account and remove your data from our servers."
                      }}
                        filterComboBoxes={[
                          {
                            columnId: "trackName",
                            label: "Track",
                            labelFormatter: (value) => value,
                          },
                        ]}
                        addComponent={<StrandFormPopover />}
                      />
                    )}

                    {activeTab === 'Sections' && (
                      <DataTableComponent
                        data={allSectionData}
                        getColumns={getSectionColumns}
                        dialogData={{ // <-- Corrected spelling
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
                        addComponent={<SectionFormPopover />}
                      />
                    )}
                  </CardContent>
                </div>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}

export default Programs;
