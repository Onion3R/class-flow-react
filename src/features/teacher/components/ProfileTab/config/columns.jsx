
import { Checkbox } from "@/components/ui/checkbox";
import ContextMenuEffectWrapper from "@/features/admin/pages/schedules/pages/CreateSchedulePage/components/ContextMenuEffectWrapper/ContextMenuEffectWrapper";

export const getColumns = ({
  setOpenDialog,
  setOpenAlertDialog,
  setSelectedRow,
  setAlertDialogCustomContent,
  setContextMenuDisable,
  isContextMenuDisabled,
}) => [
  {
    id: "select",
    header: ({ table }) =>
      isContextMenuDisabled && (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
    cell: ({ row }) =>
      isContextMenuDisabled && (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
    enableSorting: false,
    enableHiding: false,
  },
 {
  accessorKey: "section_name",
  header: "Section name",
  cell: ({ row }) => {
    return <div className="capitalize">{row.getValue('section_name') || "N/A"}</div>;
  },
},
 {
  accessorKey: "total_classes",
  header: "Total classes",
  cell: ({ row }) => {
    return <div className="capitalize">{row.getValue('total_classes') || "N/A"}</div>;
  },
},

{
  accessorKey: "total_minutes_assigned",
  header: "Total Minutes",
  cell: ({ row }) => {
    const subjects = row.original.subject_codes
    return (
    <ContextMenuEffectWrapper
          rowData={row}
          setContextMenuDisable={setContextMenuDisable}
        >
          <div>
            <span >
               {subjects?.length ? subjects.join(", ") : "N/A"}
            </span>
          </div>
        </ContextMenuEffectWrapper>
    );
  },
},
{
  accessorKey: "average_minutes_per_subject",
  header: "Avg. min/sub",
  cell: ({ row }) => {
    return <div className="capitalize">{row.getValue('average_minutes_per_subject') || "N/A"}</div>;
  },
},




];

