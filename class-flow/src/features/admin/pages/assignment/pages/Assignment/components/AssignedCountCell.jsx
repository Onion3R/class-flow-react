import useTeachersGetter from "@/lib/hooks/useTeachers";
import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { useRandomBadgeColor } from "@/lib/hooks/useRandomBadgeColor";
function AssignedCountCell({ subjectTitle }) {
  const { data, isLoading } = useTeachersGetter();
  const {getColor} = useRandomBadgeColor();
  const color = getColor(subjectTitle)

const assigned = useMemo(() => {
  if (isLoading) return 0;

  return data.filter(t =>
    t.specializations.some(s => s.subject_title === subjectTitle)
  ).length;
}, [data, isLoading, subjectTitle]);

  return (
    <div>
      {subjectTitle}
      {isLoading ? (
        <Badge variant='outline' className='ml-2'> (loading...)</Badge>
      ) : (
        assigned > 0 && <Badge variant='outline' className={`${color.bg} ${color.text} ml-2`}> {assigned} Assigned</Badge>
      )}
    </div>
  );
}

export default AssignedCountCell;
