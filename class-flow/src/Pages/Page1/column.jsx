// columns.js
import {actions} from "./actions"
import { MoreHorizontal, ArrowUpDown } from "lucide-react"
import { Button } from "@/Components/ui/button"
import { Checkbox } from "@Components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu"
import { useNavigate } from "react-router-dom"
import { Fragment } from "react"
export const getColumns = ( {setOpenDialog, setOpenAlertDialog, setSelectedRow} ) => [
  
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
    return (<div>
      {
        subjects.map((subject, index) => {
            return <span key={index}>
              {subject.value}
              {index < subjects.length - 1 && ", "}
              </span>
    

        })
      }
    </div>
    )


   
    },
    filterFn: (row, columnId, filterValue) => {
    const subjects = row.getValue(columnId); // subject[]
    if (!Array.isArray(subjects)) return false;
    return filterValue.some(val =>
    subjects.some((s) => s.label === val)
  );
  },
  },
  // {
  //   accessorKey: "maxLoad",
  //   header: "Max Load",
  // },
  {
    accessorKey: "actions",
    header: "Actions",
    id: "actions",
    cell: ({ row }) => {
      const navigate = useNavigate()
      const rowData = row.original;
      const menuActions = actions(navigate ,setOpenDialog, setOpenAlertDialog, setSelectedRow); 
      

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {
            menuActions.map(({id, label, action }) => id === 1 ?// Assuming id 3 is the one that opens the dialog
              (
              <Fragment key={id}>
                <DropdownMenuItem onClick={() => action(rowData)}>
                  {label}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </Fragment>
              ) : ( 
              <DropdownMenuItem key ={id} onClick={() => action(rowData)}>
                {label}
              </DropdownMenuItem>
              )
            )
            }
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];