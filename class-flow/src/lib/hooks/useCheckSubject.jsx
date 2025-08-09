// useCheckSubject.js
import subjectStrandGetter from '@/lib/hooks/useSubjectStrand';
import { deleteSubject, deleteSubjectStrand } from '@/services/apiService';

export default function useCheckSubject() {
  const { data: allSubjectStrandData, isLoading } = subjectStrandGetter();

  const checkSubject = async (selectedRow) => {
    if (isLoading || !selectedRow) return false;

    try {
      const { subject, strand, year_level } = selectedRow;
      const relatedSubjects = allSubjectStrandData.filter(e => e.subject.id === subject.id);

      if (relatedSubjects.length === 1) {
        await deleteSubject(subject.id);
      } else {
        const match = relatedSubjects.find(
          e => e.strand.id === strand.id && e.year_level.id === year_level.id
        );
        if (match) {
          await deleteSubjectStrand(match.id);
        }
      }

      return true;
    } catch (error) {
      console.error("Error in checkSubject:", error);
      return false;
    }
  };

  return { checkSubject };
}
