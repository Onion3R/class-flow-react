// src/columns.jsx
"use client"; // Add this if you are using Next.js App Router and this is a client component

import { MoreHorizontal, ArrowUpDown } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Checkbox } from "@/Components/ui/checkbox"; // Ensure this path is correct
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom"; // Assuming you are using react-router-dom
import { Fragment } from "react"; // For conditionally rendering separators

// IMPORTANT: This now imports from the generic 'actions.js'
import { actions } from "./actions";

export const getColumns = ({ setOpenDialog, setOpenAlertDialog, setSelectedRow, setLabel}) => [
  // Checkbox Column for Row Selection
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
  // ID Column
  // Program/Strand Name Column
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Strand Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="capitalize">{row.getValue("name")}</div>,
    enableSorting: true,
    enableColumnFilter: true,
  },
  // Program/Strand Code Column
  {
    accessorKey: "code",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Code
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="uppercase">{row.getValue("code")}</div>,
    enableSorting: true,
    enableColumnFilter: true,
  },
  // Track Name Column (accessing nested 'track.name')
  {
    accessorKey: "trackName", // <-- CHANGED: Use a simple string key for the column
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Track
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    // Use accessorFn to provide the actual string value from the nested object
    accessorFn: (row) => row.track?.name || "Unknown Track",
    cell: ({ row }) => <div className="capitalize">{row.getValue("trackName")}</div>, // <-- CHANGED: Get value with the new accessorKey
    enableSorting: true,
    enableColumnFilter: true,
  },
  // Actions Column
  {
    accessorKey: "actions",
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const navigate = useNavigate();
      const rowData = row.original;
      // Get the actions from the generic 'actions.js'
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
                    {menuActions.map(({ id, label, icon, action }) => (
                      id != 'delete' ? (
                        <Fragment key={id}>
                        <DropdownMenuItem onClick={() => {
                          action(rowData)
                          setLabel('strands')
                          }}  className='w-full justify-between'>
                          {label} {icon}
                        </DropdownMenuItem>
                        {id === 'view' && <DropdownMenuSeparator />}
                      </Fragment>
                      ) : (
                        <Fragment key={id}>
                        <DropdownMenuItem onClick={() => action(rowData)} className='w-full !text-red-500  justify-between hover:bg-red-100 dark:hover:bg-red-950/50 !hover:text-red-500'>
                          {label} {icon}
                        </DropdownMenuItem>
                      </Fragment>
                      )
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