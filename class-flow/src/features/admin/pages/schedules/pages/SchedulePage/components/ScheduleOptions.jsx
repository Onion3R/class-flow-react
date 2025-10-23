import React, { useState, useEffect } from 'react';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import { Badge } from '@/components/ui/badge';
import { X, ListFilter, Printer, FileSpreadsheet, XCircle, Maximize} from 'lucide-react';
import { Button } from '@/components/ui/button';
import ExportButton from './ExportButton';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import SelectComponent from '@/components/Select/selectComponent';
import { getTimetableFilters } from '@/app/services/timetableService';
function ScheduleOptions({ selectedSchedule, setFilters }) {


  const [tracks, setTracks] = useState()
  const [sections, setSections] = useState()
  const [strands, setStrands] = useState()
  const [yearLevels, setYearLevels] = useState()

  const [openDialog, setOpenDialog] = useState(false)

  const [selectedTrack, setSelectedTrack] = useState(null);
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedYearLevel, setSelectedYearLevel] = useState('');
  const [checkedStrands, setCheckedStrands] = useState({});
  const [sectionDisabled, setSectionDisabled] = useState(true);
  const [yearLevelDisabled, setYearLevelDisabled] = useState(true);
  const [filteredSections, setFilteredSections] = useState([]);
  const [sectionsByYearLevel, setSectionsByYearLevel] = useState([]);
  const [api, setApi] = useState('');
  const [continueDisable, setContinueDisable] = useState(true);

  useEffect(() => {
   
   const getFilters = async () => {
    if (!selectedSchedule.id) return;
    try {
      const filters = await getTimetableFilters(selectedSchedule.id)
      const { tracks , strands, year_levels, sections} = filters
      setTracks(tracks)
      setStrands(strands)
      setYearLevels(year_levels)
      setSections(sections)
      setSelectedTrack(prev => prev ?? tracks[0]);
    } catch (error) {
      console.error(error)
    }
   }

    getFilters()
  }, [selectedSchedule])
  

  const handleCheckboxChange = (id, checked, name) => {
    setSelectedYearLevel('');
    setSelectedSection('');
    setCheckedStrands((prev) => ({
      ...prev,
      [id]: {
        checked,
        id: id,
        name: name,
      },
    }));

    
  };



useEffect(() => {
  if (!selectedSchedule || !selectedTrack) return;

  let api = `${selectedSchedule.id}&track_id=${selectedTrack.id}`;

  const activeStrands = Object.values(checkedStrands).filter((s) => s.checked);
  const filtered = activeStrands.flatMap((strand) =>
    sections.filter((section) => section.strand_name === strand.name)
  );
  setFilteredSections(filtered);

  if (activeStrands.length > 0) {
    setContinueDisable(false);
    setYearLevelDisabled(false);

    const strandIds = activeStrands.map((s) => s.id).join(',');
    api += `&strand_ids=${strandIds}`;

    if (selectedYearLevel) {
      setSectionDisabled(false);
      const yearLevelId = yearLevels.find((a) => a.name === selectedYearLevel)?.id;
      if (yearLevelId) {
        api += `&year_level_ids=${yearLevelId}`;
      }
    } else {
      setSectionDisabled(true);
    }

    if (selectedSection) {
      const sectionId = sectionsByYearLevel.find((a) => a.name === selectedSection)?.id;
      if (sectionId) {
        api += `&section_ids=${sectionId}`;
      }
    }
  } else {
    setYearLevelDisabled(true);
    setSectionDisabled(true);
  }

  setApi(api);
}, [
  checkedStrands,
  selectedYearLevel,
  selectedTrack,
  selectedSection,
  selectedSchedule,
  yearLevels,
  sections,
  sectionsByYearLevel,
]);




  const handleYearLevelChange = (value) => {
    setSelectedSection('');
    setSelectedYearLevel(value);
    const filtered = filteredSections.filter(e => e.year_level_name === value);
    setSectionsByYearLevel(filtered);
    
  };

  const handleSectionChange = (value) => {
    setSelectedSection(value);
    
  };


  const handleClearFilters = () => {
    setCheckedStrands({});
    setSelectedYearLevel('');
    setSelectedSection('');
    setFilteredSections([]);
    setSectionsByYearLevel([]);
    setApi('');
    setContinueDisable(true);
    setYearLevelDisabled(true);
    setSectionDisabled(true);
    setFilters( `${selectedSchedule.id}&track_id=${selectedTrack?.id}`);
  };


  const handleContinue = () => {  
      setFilters(api)
      setOpenDialog(false)
  }

  console.log(checkedStrands)

  return (

      <Dialog open={openDialog}  onOpenChange={setOpenDialog}>
        <DialogTrigger asChild>
          <Button variant='outline'>
            <ListFilter className="mr-2 h-4 w-4" />
            Filter
          </Button>
        </DialogTrigger>
        <DialogContent>
          {/* <DialogCancel asChild className="absolute top-3 right-3">
            <Button size='xs' variant='ghost' className='!bg-transparent border-none text-black shadow-none  dark:text-foreground'>
              <X />
            </Button>
          </DialogCancel> */}

          <DialogHeader>
            <DialogTitle>Filters</DialogTitle>
            <DialogDescription>
              You're setting filters for:
              <Badge className="text-green-500 dark:border-green-800 ml-1 dark:bg-green-950/80" variant="outline">
                {selectedTrack?.name || "No track selected"}
              </Badge>
            </DialogDescription>

            <div className='flex items-center justify-between mt-3 border p-1 rounded  border-dashed'>
              <div className='flex flex-wrap gap-1'>
              {Object.values(checkedStrands).some((s) => s.checked) ? (
                  Object.values(checkedStrands)
                    .filter((s) => s.checked)
                    .map((s) => (
                      <Badge key={s.id} variant="outline" >
                        {strands.find((d) => d.id === s.id)?.name}
                      </Badge>
                    ))
                ) : (
                  <p className="text-sm text-muted-foreground pl-2">Select filters</p>
                )}

              
                {selectedYearLevel && (
                  <Badge variant="outline">{selectedYearLevel}</Badge>
                )}
                {selectedSection && (
                  <Badge variant="outline">{selectedSection}</Badge>
                )}
              </div>
              <Button variant='ghost' className='border-dashed text-xs flex items-center gap-1' onClick={handleClearFilters}>
                <XCircle className="w-4 h-4" />
                Clear
              </Button>
            </div>

            <div className='gap-5 mt-4'>
              <div className='gap-2 flex flex-col'>
                {strands?.length > 0 &&
                  strands.map((e) => (
                    <div className="flex items-center gap-3" key={e.id}>
                      <Checkbox
                        id={`strand-${e.id}`}
                        checked={!!checkedStrands[e.id]?.checked}
                        onCheckedChange={(checked) => handleCheckboxChange(e.id, checked, e.name)}
                      />
                      <Label htmlFor={`strand-${e.id}`}>{e.name}</Label>
                    </div>
                  ))}
              </div>

              <div className='flex flex-col gap-4 mt-5 w-full'>
                <SelectComponent
                  disabled={yearLevelDisabled}
                  items={yearLevels?.map((a) => a.name)}
                  label="Year Levels"
                  value={selectedYearLevel}
                  onChange={(e) => handleYearLevelChange(e)}
                  className='w-full max-w-none'
                />
                <SelectComponent
                  disabled={sectionDisabled}
                  items={sectionsByYearLevel?.map((a) => a.name)}
                  label="Sections"
                  value={selectedSection}
                  onChange={handleSectionChange}
                  className='w-full max-w-none'
                />
              </div>
            </div>
          </DialogHeader>

          <DialogFooter>
            <div className='w-full flex items-center justify-between'>
              <div className='flex gap-2'>
                <ExportButton  scheduleId={selectedSchedule.id} filters={api}  disabled={!Object.values(checkedStrands).some(strand => strand.checked)}/>
                  
                <Button variant='secondary' size='sm' className='text-xs' disabled={!selectedSection}>
                  <Printer className="!w-3 !h-3 " />
                  Print
                </Button>
                <Button
                      variant='secondary'
                      size='sm'
                      className='text-xs'
                      onClick={() => window.open(`/views/${encodeURIComponent(api)}`, '_blank')}
                      disabled={!selectedSection}
                    >
                      <Maximize className="!w-3 !h-3 " />
                      View
                    </Button>
              </div>
              <Button
                onClick={() => handleContinue()}
                disabled={continueDisable}
              >
                Continue
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
  );
}

export default ScheduleOptions;

