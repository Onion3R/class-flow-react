import { MoreHorizontal, CircleDotDashed, CircleSlash} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { useNavigate } from "react-router-dom";
import { Fragment } from "react";
import { actions } from "./actions";
import ContextMenuEffectWrapper from "../../CreateSchedulePage/components/ContextMenuEffectWrapper/ContextMenuEffectWrapper";


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
  accessorKey: "name",
  header: "Fullname",
  cell: ({ row }) => {
    return <div className="capitalize">{row.original.name || "N/A"}</div>;
  },
},
{
  accessorKey: "sections_taught",
  header: "Sections Taught",
  cell: ({ row }) => {
    const sections = row.original.sections_taught;
    return (
       <div className="max-w-[250px]">{sections?.length ? sections.slice(0,3).join(", ") : "N/A"}
        <HoverCard>
              <HoverCardTrigger>
                {sections.length > 3 && (
                  <Badge
                    className="h-5 min-w-5 rounded-full px-1 font-medium ml-2 cursor-default"
                    variant="outline"
                  >
                    +{sections.length - 3}
                </Badge> )}
              </HoverCardTrigger>
              <HoverCardContent className="grid grid-cols-3 w-auto gap-1">
                {sections.slice(3).map((section, index) => (
                  <p key={index} className="text-sm text-foreground">
                    {section}
                  </p>
                ))}
              </HoverCardContent>
            </HoverCard>
            </div>
    )
    
    
   
  },
   enableHiding: false,
    enableSorting: false,
    enableColumnFilter: false,
},
// {
//   accessorKey: "row.utilization_percentage",
//   header: "Utilization",
//   cell: ({ row }) => {
//     console.log(row.utilization_percentage)
//     return <div>{row.original.utilization_percentage ?? "N/A"}%</div>;
//   },
// },
{
  accessorKey: "total_minutes_assigned",
  header: "Total Minutes",
  cell: ({ row }) => {
    const allowed = row.original.max_minutes_allowed;
    return (
    <ContextMenuEffectWrapper
          rowData={row}
          setContextMenuDisable={setContextMenuDisable}
        >
          <div>{row.original.total_minutes_assigned ?? "N/A"} 
            <span className="text-muted-foreground"> / {allowed}</span>
          </div>
        </ContextMenuEffectWrapper>
    );
  },
},
{
  accessorKey: "utilization_percentage",
  header: "Percentage",
  cell: ({ row }) => {
    return <div className="ml-2 ">{row.original.utilization_percentage ?? "N/A"}%</div>;
  },

   
  },
{
  accessorKey: "subjects_assigned",
  header: "Subjects Assigned",
  cell: ({ row }) => {
    const subjects = row.original.subjects_assigned;
    return <div> {subjects?.length ? subjects.join(", ") : "N/A"}</div>;
  },
},


];

