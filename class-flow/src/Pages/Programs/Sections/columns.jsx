// src/columns.jsx
"use client";

import { MoreHorizontal, ArrowUpDown } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Checkbox } from "@/Components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel
} from "@/Components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { Fragment } from "react";

import { actions } from "./actions";

export const getColumns = ({ setOpenDialog, setOpenAlertDialog ,  setSelectedRow, setLabel}) => [
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
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Section
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="capitalize">{row.getValue("name")}</div>,
    enableSorting: true,
    // enableColumnFilter: true,
  },
  {
    id: "strand.track.name", // This ID is what row.getValue() expects
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Track
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    accessorFn: (row) => row.strand?.track?.name || "N/A", // This is where the value is determined
    cell: ({ row }) => <div className="capitalize">{row.getValue("strand.track.name")}</div>, // <-- CORRECT WAY
    enableSorting: true,
    // enableColumnFilter: true,
    // filterFn: arrayFilterFn, // Don't forget this if using ComboBox
},
{
  id: "strand.name", // This ID is what row.getValue() expects
  header: ({ column }) => (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      Strand 
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  ),
  accessorFn: (row) => row.strand?.name || "N/A", // This is where the value is determined
  cell: ({ row }) => <div className="capitalize">{row.getValue("strand.name")}</div>, // <-- CORRECT WAY
  enableSorting: true,
  // enableColumnFilter: true,
  // filterFn: arrayFilterFn, // Don't forget this if using ComboBox
},
{
  id: "year_level.name", // This ID is what row.getValue() expects
  header: ({ column }) => (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      Year level 
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  ),
  accessorFn: (row) => row.year_level?.name || "N/A", // This is where the value is determined
  cell: ({ row }) => <div className="capitalize ml-4">{row.getValue("year_level.name")}</div>, // <-- CORRECT WAY
  enableSorting: true,
  // filterFn: arrayFilterFn, // Don't forget this if using ComboBox
},

// {
//   id: "max_students", // This ID is what row.getValue() expects
//   header: ({ column }) => (
//     <Button
//       variant="ghost"
//       onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
//     >
//       Max students 
//       <ArrowUpDown className="ml-2 h-4 w-4" />
//     </Button>
//   ),
//   accessorFn: (row) => row.max_students || "N/A", // This is where the value is determined
//   cell: ({ row }) => <div className="capitalize ml-10">{row.getValue("max_students")}</div>, // <-- CORRECT WAY
//   enableSorting: true,
//   enableColumnFilter: true,
//   // filterFn: arrayFilterFn, // Don't forget this if using ComboBox
// },
  // --- END CORRECTED TRACK NAME COLUMN ---
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
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {menuActions.map(({ id, label, icon, action }) => (
                      id != 'delete' ? (
                        <Fragment key={id}>
                        <DropdownMenuItem 
                        onClick={() => 
                          {
                            action(rowData)
                            setLabel('sections')
                          }}  
                        className='w-full justify-between'>
                          {label} {icon}
                        </DropdownMenuItem>
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