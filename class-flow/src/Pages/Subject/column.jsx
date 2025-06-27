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
import { Fragment } from "react"
export const getColumns = ( {setOpenDialog, setOpenAlertDialog} ) => [
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
    accessorKey: "courseNo",
    header: "Course Number",
  },
  {
    accessorKey: "courseDesc",
    header: "Course Description",
  },
   {
    accessorKey: "sem",
    header: "Sem",
    cell: ({ row }) => {
      const rowData = row.original;
      return (
        <div className="flex items-center">
          {rowData.sem.map((s) => (
        <p className="ml-2 " key={s.value}>{s.value}</p>
          ))}
        </div>
      );
    },
    filterFn: (row, columnId, filterValue) => {
      const semArray = row.getValue(columnId); // array of {label, value}
      if (!Array.isArray(semArray)) return false;

      return semArray.some((semItem) =>
        filterValue.includes(semItem.value)
      );
    }
  },
  {
    accessorKey: "lecHrs",
    header: "Lec Hours",
    cell: ({ row }) => {
        const rowData = row.original;
        return (
          <div className="flex items-center r">
            <p className="ml-2">{rowData.lecHrs}</p>
          </div>
        )
      }
  },
   {
    accessorKey: "labHrs",
    header: "Lab Hours",
    cell: ({ row }) => {
      const rowData = row.original;
      return (
        <div className="flex items-center r">
          <p className="ml-2">{rowData.labHrs}</p>
        </div>
      )
    }
  },
  {
    accessorKey: "actions",
    header: "Actions",
    id: "actions",
    cell: ({ row }) => {
      const rowData = row.original;
      const menuActions = actions(setOpenDialog, setOpenAlertDialog); 
      

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