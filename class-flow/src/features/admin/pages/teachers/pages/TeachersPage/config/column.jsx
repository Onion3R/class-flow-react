// columns.js
import {actions} from "./actions"
import { MoreHorizontal, ArrowUpDown, ShieldUser, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@Components/ui/checkbox"
import ContextMenuEffectWrapper from "@/features/admin/pages/schedules/pages/CreateSchedulePage/components/ContextMenuEffectWrapper/ContextMenuEffectWrapper"
import DeleteDialogTeacher from "../component/DeleteDialogTeacher"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useNavigate } from "react-router-dom"
import { Fragment } from "react"
import { Badge } from "@/components/ui/badge"
import { useRandomBadgeColor } from "@/lib/hooks/useRandomBadgeColor"
export const getColumns = ( {
  setOpenDialog, 
  setOpenAlertDialog, 
  setSelectedRow, 
  setLabel, 
  setAlertDialogCustomContent,
  setContextMenuDisable,
  isContextMenuDisabled
} ) => [
  
   {
    id: "select",
    header: ({ table }) =>  
       isContextMenuDisabled &&  (
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
      isContextMenuDisabled &&  (
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
    header: "Name",
  },
  {
   accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ArrowUpDown />
        </Button>
      )
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
  },
  
   {
    accessorKey: "subject",
    header: "Subject",
    cell: ({row}) => {
    const subjects = row.getValue('subject');
    const {getColor} = useRandomBadgeColor()
    const color = getColor(row.id)
      return (
      <div>
        {subjects.length  < 2 ? (
          subjects.map((subject, index) => (
            <span key={index}>
              {subject.value}
              {/* {index < subjects.length - 1 && ", "} */}
            </span>
          ))
        ) : (
          <span >
         { subjects.slice(0, 1).map((subject, index) => (
            <span key={index}>
              {subject.value}
              {/* {index < 1 && ", "} */}
            </span>
          ))}
          <Badge className={`${color.bg} ${color.text} ml-2`} >+{subjects.length - 1} more</Badge>
            </span>
        )}
      </div>
    );



   
    },
    filterFn: (row, columnId, filterValue) => {
    const subjects = row.getValue(columnId); // subject[]
    if (!Array.isArray(subjects)) return false;
    return filterValue.some(val =>
    subjects.some((s) => s.label === val)
  );
  },
  },
  {
    accessorKey: "maxLoad",
    header: "Mins per week",
    cell:({row}) => <div><span className="ml-3">{row.getValue("maxLoad")}</span></div>
  },
  {
   accessorKey: "role",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Role
          <ArrowUpDown />
        </Button>
      )
    },
    cell: ({ row }) => {
    const role = row.getValue("role");
    const Icon = role === "teacher" ? User : ShieldUser;

    return (
      <Badge variant="outline" className="capitalize ml-3 text-muted-foreground">
        <Icon className="mr-1" />
        {role}
      </Badge>
    );
  }

  },
  {
    accessorKey: "actions",
    header: "Actions",
    id: "actions",
    cell: ({ row }) => {
      const navigate = useNavigate()
      const rowData = row.original;
      const menuActions = actions(navigate ,setOpenDialog, setOpenAlertDialog, setSelectedRow); 
      

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
                        {menuActions.map(({ id, label, icon, action }) =>
                            id !== "delete" ? (
                                <Fragment key={id}>
                                    <DropdownMenuItem
                                        onClick={() => {
                                            action(rowData);
                                            setLabel("teacher");
                                        }}
                                        className="w-full justify-between"
                                    >
                                        {label} {icon}
                                    </DropdownMenuItem>
                                    {id === "view" && <DropdownMenuSeparator />}
                                </Fragment>
                            ) : (
                                <Fragment key={id}>
                                    <DropdownMenuItem
                                        onClick={() => {
                                          action(rowData)
                                          setAlertDialogCustomContent(<DeleteDialogTeacher/>)
                                        }}
                                        className="w-full !text-red-500  justify-between hover:bg-red-100 dark:hover:bg-red-950/50 !hover:text-red-500"
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
  },
];