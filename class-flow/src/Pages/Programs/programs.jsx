// src/Programs.jsx
"use client";
import React from 'react';
import DataTableComponent from '@/Components/DataTable/dataTableComponent';
import { getColumns } from './columns';
import { PulseLoader } from 'react-spinners';
import useProgramsData from './data';
import ShareDialog from '@/Components/ShareDialog/shareDialog';

function Programs() {
  const { data, isLoading } = useProgramsData();
  const mainFilterColumnId = "name";

  return (
    <div className="h-screen max-h-[calc(100vh-29px)]">
      <div className="p-4 sm:w-auto">
        <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold mb-4 container mx-auto">Programs</h1>
            <PulseLoader size={6} loading={isLoading} />
        </div>
        <div className='flex items-center justify-between'>
          <div>
            <h3 className='text-foreground font-semibold'>Add Track</h3>
            <p className='text-sm text-gray-200 mb-5'>You can add tracks here</p>
         <DataTableComponent data={data} getColumns={getColumns} filteredData='email' comboFilteredData="track" addComponent={<ShareDialog />} />
          </div>
          <div>
              <h3 className='text-foreground font-semibold'>Add Strand</h3>
            <p className='text-sm text-gray-200 mb-5'>You can add tracks here</p>
            <DataTableComponent data={data} getColumns={getColumns} filteredData='email' comboFilteredData="track" addComponent={<ShareDialog />} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Programs;
