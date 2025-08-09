import React from 'react'
import subjectStrandGetter from '@/lib/hooks/useSubjectStrand';

 async function checkSubject(selectedRow) {
    const {data: allSubjectStrandData, isLoading: allSubjectStrandDataIsLoading} = subjectStrandGetter()
  const count = allSubjectStrandData.filter(e => e.subject.id === selectedRow.subject.id);  
      try {
          if (count.length === 1) {
          await deleteSubject(selectedRow.subject.id);  // <- add await here
         } else {
          const result = allSubjectStrandData.find(a => a.subject.id === selectedRow.subject.id && a.strand.id === selectedRow.strand.id && a.year_level.id  === selectedRow.year_level.id)
          await deleteSubjectStrand(result.id) 
        }
        return true
      } catch (error) {
        console.log(error)
        return false
      }
       

}
export default checkSubject