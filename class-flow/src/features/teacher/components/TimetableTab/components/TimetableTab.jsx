import React, { useEffect, useState, lazy } from 'react'
import { FileSpreadsheet, Printer, Maximize } from 'lucide-react'
import { Label } from '@/components/ui/label'
import SelectComponent from '@/components/Select/selectComponent'
import { Button } from '@/components/ui/button'
import ScheduleTableComponent from '../../ScheduleComponent'
import { Checkbox } from '@/components/ui/checkbox'
const FilterDialog = lazy(() => import('./FilterDialog'));
const API = '&view_format'

function TimetableTab({id,timetableFilters}) {
  const [tableData, setTableData] = useState()
  const [filters, setFilters] = useState({})
  const [filterUrl, setFilterUrl] = useState()
  const [finalFilterUrl, setFinalFilterUrl] = useState(API)

  // Signals
  const [hasSelectedYear, setHasSelectedYear] = useState(false)
  const [hasSelectedStrand, setHasSelectedStrand] = useState(false)

  const [selectedSection, setSelectedSection] = useState('')
  const [selectedYearLevel, setselectedYearLevel] = useState('')
  const [checkedStrands, setCheckedStrands] = useState({})
  const [checkedItems, setCheckedItems] = useState()

  const [filteredSections, setFilteredSections] = useState()
  const [allowedStrands, setAllowedStrands] = useState()

useEffect(() => {
  console.log('timetableFilters:', timetableFilters)
  if (timetableFilters) {

    const filters = timetableFilters.filter_options
    const {
      available_sections,
      available_grades,
      available_strands
    } = filters

    setFilters({
      grades: available_grades,
      sections: available_sections,
      strands: available_strands
    })
  }
}, [timetableFilters])


  const handleYearLevelChange = (e) => {
    setselectedYearLevel(e)
    setHasSelectedYear(true)
    setSelectedSection('')
  }

  const handleSectionChange = (e) => {
    setSelectedSection(e)
  }

  const handleCheckboxChange = (id, checked) => {
    setHasSelectedStrand(true)
    setSelectedSection('')
    setselectedYearLevel('')
    setCheckedStrands((prev) => ({
      ...prev,
      [id]: {
        id,
        checked
      }
    }))
  }

  useEffect(() => {
    let url
    if (checkedStrands) {
      console.log('hello', checkedStrands)

      const checkedItems = Object.values(checkedStrands).filter(item => item.checked)
      const allowedStrands = checkedItems.map(e => e.id)
      setCheckedItems(checkedItems)
      setAllowedStrands(allowedStrands)
      if (checkedItems.length > 0) {
        const sample = `&filter_strand=${checkedItems
          .filter(e => e.checked === true)
          .map(e => e.id)
          .join(',')}`
        console.log(sample)
        url = sample

        if (selectedYearLevel) {
          let dummyUrl
          dummyUrl = url + `&filter_grade=${selectedYearLevel}`

          if (selectedSection) {
            const section = selectedSection.toString().toLowerCase()
            dummyUrl = dummyUrl + `&filter_section=${section}`
          }

          url = dummyUrl
        }
      } else {
        setSelectedSection('')
        setselectedYearLevel('')
        setHasSelectedStrand(false)
        setHasSelectedYear(false)
         setFinalFilterUrl('')
        setFinalFilterUrl(API)
      }
    } 
    console.log(url)
    setFilterUrl(url)
  }, [checkedStrands, selectedSection, selectedYearLevel])

  useEffect(() => {

    if (tableData && checkedItems && allowedStrands) {
      console.log('table data:', tableData)
      console.log('checked items:', checkedItems)

      const year_level = Number(selectedYearLevel.split(" ").pop())

      console.log('year level:', year_level)
      console.log('allowed strands:', allowedStrands)

      const result = Array.from(new Set(tableData.filter(data =>
        data.year_level === year_level &&
        allowedStrands.includes(data.strand_name)
      ).map(e => e.section_name)))

      console.log('filtered sections:', result)
      setFilteredSections(result)
    }

  }, [tableData, allowedStrands, checkedItems, selectedYearLevel])

  const handleFilter = () => {
    setFinalFilterUrl(filterUrl)
  }

  return (
    <section className='flex flex-col lg:flex-row gap-5'>
      <div className='block lg:hidden'>
      <FilterDialog
      filters={filters}
      checkedStrands={checkedStrands}
      handleCheckboxChange={handleCheckboxChange}
      hasSelectedStrand={hasSelectedStrand}
      selectedYearLevel={selectedYearLevel}
      handleYearLevelChange={handleYearLevelChange}
      handleFilter={handleFilter}
      hasSelectedYear={hasSelectedYear}
      filteredSections={filteredSections}
      selectedSection={selectedSection}
      handleSectionChange={handleSectionChange}
      className={'w-full'}
     
      />
      </div>
      <div className='w-[25%] hidden lg:block'>
        <div className='h-auto p-4 border rounded'>
          <h1 className='text-xl font-bold'>Filter</h1>
          <p className='text-sm font'>Select your filters</p>
          <div className='space-y-2 mt-3'>
            {filters.strands ?
              filters.strands.map(e => (
                <div key={e} className="flex items-center gap-3">
                  <Checkbox
                    id={`strand-${e}`}
                    checked={!!checkedStrands[e]?.checked}
                    onCheckedChange={(checked) => handleCheckboxChange(e, checked)}
                  />
                  <Label htmlFor={`strand-${e}`} className='text-muted-foreground'>{e}</Label>
                </div>
              ))
              : 'No strands'}
            <div className='flex flex-col gap-4 mt-5 w-full'>
              <SelectComponent
                disabled={!hasSelectedStrand}
                items={filters.grades ?? []}
                label="Year Levels"
                value={selectedYearLevel}
                onChange={handleYearLevelChange}
                className='w-full max-w-none'
              />
              <SelectComponent
                disabled={!hasSelectedYear}
                items={filteredSections ?? []}
                label="Sections"
                value={selectedSection}
                onChange={handleSectionChange}
                className='w-full max-w-none'
              />
            </div>
            <Button 
            className='w-full mt-1' 
            onClick={handleFilter}
            disabled={!hasSelectedStrand}
            >Filter</Button>
          </div>
        </div>
        <div className='flex gap-1 mt-2 items-center justify-center'>
          <Button variant='outline' size='sm' className='text-xs  bg-transparent'>
            <FileSpreadsheet className="!w-3 !h-3 " />
            Export
          </Button>
          <Button variant='outline' size='sm' className='text-xs  bg-transparent'>
            <Printer className="!w-3 !h-3 " />
            Print
          </Button>
          <Button 
          variant='outline' 
          size='sm' 
          className='text-xs  bg-transparent'
          >
            <Maximize className="!w-3 !h-3 " />
            View
          </Button>
        </div>
      </div>
      <div className='w-full'>
        <ScheduleTableComponent  id={id} setTableData={setTableData} filters={finalFilterUrl} />
      </div>
    </section>
  )
}

export default TimetableTab
