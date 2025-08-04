// src/columns.js
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
import { useNavigate } from "react-router-dom"; 

export const getColumns = ({ setOpenDialog, setOpenAlertDialog, setSelectedRow}) => [
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
        // Now using the flattened key: subjectCode
        accessorKey: "subjectCode",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Subject Code
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => {
            const subjectCode = row.original.subjectCode;
            return <div className="font-medium">{subjectCode}</div>;
        },
    },
    {
        // Now using the flattened key: subjectTitle
        accessorKey: "subjectTitle",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Subject Title
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => {
            const subjectTitle = row.original.subjectTitle;
            return <div>{subjectTitle}</div>;
        },
    },
    {
        // Now using the flattened key: yearLevelName
        accessorKey: "yearLevelName",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Year Level
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => {
            const yearLevelName = row.original.yearLevelName;
            return <div>{yearLevelName}</div>;
        },
    },
    {
        // Now using the flattened key: semesterName
        accessorKey: "semesterName",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Semester
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => {
            const semesterName = row.original.semesterName;
            return <div>{semesterName}</div>;
        },
    },
    {
        // Now using the flattened key: minutesPerWeek
        accessorKey: "minutesPerWeek",
        header: "Minutes Per Week",
        cell: ({ row }) => {
            const minutes = row.original.minutesPerWeek;
            return <div>{minutes || 'N/A'}</div>;
        }
    },
    {
        id: "actions",
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
                        {
                            menuActions.map(({ id, label, action }) => id === 1 ?
                                (
                                    <Fragment key={id}>
                                        <DropdownMenuItem onClick={() => action(rowData)}>
                                            {label}
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                    </Fragment>
                                ) : (
                                    <DropdownMenuItem key={id} onClick={() => action(rowData)}>
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
