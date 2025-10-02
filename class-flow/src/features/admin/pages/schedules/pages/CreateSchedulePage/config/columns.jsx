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
import { useNavigate } from "react-router-dom";
import { Fragment } from "react";
import { actions } from "./actions";
import DeleteDialogSchedule from "../components/DeleteDialogSchedule";
import ContextMenuEffectWrapper from "../components/ContextMenuEffectWrapper/ContextMenuEffectWrapper";
import ActiveBadge from "@/components/ActiveBadge/ActiveBadge";
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
  {
    id: "status",
    header: "Status",
    cell: ({ row }) => {
      const isActive = row.original.is_active;
      return (
        <ActiveBadge status={isActive}/>
      );
    },
  },
  {
    accessorKey: "actions",
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const navigate = useNavigate();
      const rowData = row.original;
      const menuActions = actions(navigate, setOpenDialog, setOpenAlertDialog, setSelectedRow);

      return (
        <ContextMenuEffectWrapper
          rowData={rowData}
          setContextMenuDisable={setContextMenuDisable}
        >
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {menuActions.map(({ id, label, icon, action }) =>
                id !== "delete" ? (
                  <Fragment key={id}>
                    <DropdownMenuItem
                      onClick={() => {
                        action(rowData);
                        setSelectedRow(rowData);
                      }}
                      className="w-full justify-between"
                    >
                      {label} {icon}
                    </DropdownMenuItem>
                  </Fragment>
                ) : (
                  <Fragment key={id}>
                    <DropdownMenuItem
                      onClick={() => {
                        action(rowData);
                        setAlertDialogCustomContent(<DeleteDialogSchedule />);
                      }}
                      className="w-full !text-red-500 justify-between hover:bg-red-100 dark:hover:bg-red-950/50 !hover:text-red-500"
                    >
                      {label} {icon}
                    </DropdownMenuItem>
                  </Fragment>
                )
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </ContextMenuEffectWrapper>
      );
    },
    enableHiding: false,
    enableSorting: false,
    enableColumnFilter: false,
  },
];
