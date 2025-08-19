import { MoreHorizontal } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Checkbox } from "@/Components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { Fragment } from "react";
import { actions } from "./actions";

export const getColumns = ({ setOpenDialog, setOpenAlertDialog, setSelectedRow }) => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
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
    accessorKey: "title",
    header: "Schedule Title",
    cell: ({ row }) => <div className="capitalize">{row.getValue("title")}</div>,
  },
  {
    accessorKey: "academic_year",
    header: "Academic Year",
    cell: ({ row }) => <div>{row.getValue("academic_year")}</div>,
  },
  {
    accessorKey: "semester.name",
    header: "Semester",
    cell: ({ row }) => <div>{row.original.semester?.name ?? "-"}</div>,
  },
  {
    id: "dateRange",
    header: "Date Range",
    cell: ({ row }) => {
      const { start_date, end_date } = row.original;
      return (
        <div>
          {start_date} — {end_date}
        </div>
      );
    },
  },
  // {
  //   id: "status",
  //   header: "Status",
  //   cell: ({ row }) => {
  //     const isActive = row.original.is_active;
  //     return (
  //       <span className={`font-medium ${isActive ? "text-green-600" : "text-red-500"}`}>
  //         {isActive ? "Active" : "Inactive"}
  //       </span>
  //     );
  //   },
  // },
  {
    accessorKey: "actions",
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const navigate = useNavigate();
      const rowData = row.original;
      const menuActions = actions(navigate, setOpenDialog, setOpenAlertDialog, setSelectedRow);

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {menuActions.map(({ id, label, action }) => (
              <Fragment key={id}>
                <DropdownMenuItem onClick={() => action(rowData)}>
                  {label}
                </DropdownMenuItem>
                {id === "view" && <DropdownMenuSeparator />}
              </Fragment>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    enableHiding: false,
    enableSorting: false,
    enableColumnFilter: false,
  },
];
