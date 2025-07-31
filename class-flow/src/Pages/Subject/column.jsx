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

export const getColumns = ({ setOpenDialog, setOpenAlertDialog }) => [
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
        // Accessing nested subject.code
        accessorKey: "subject.code",
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
            const subjectCode = row.original.subject?.code; // Safely access nested property
            return <div className="font-medium">{subjectCode}</div>;
        },
    },
    {
        // Accessing nested subject.title
        accessorKey: "subject.title",
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
            const subjectTitle = row.original.subject?.title; // Safely access nested property
            return <div>{subjectTitle}</div>;
        },
    },
    {
        // Accessing nested year_level.name
        accessorKey: "year_level.name",
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
            const yearLevelName = row.original.year_level?.name; // Safely access nested property
            return <div>{yearLevelName}</div>;
        },
    },
    {
        // Accessing nested semester.name
        accessorKey: "semester.name",
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
            const semesterName = row.original.semester?.name; // Safely access nested property
            return <div>{semesterName}</div>;
        },
        // This `filterFn` can be useful if you're using React Table's built-in filtering
        // and want to filter by the semester's name or ID.
        // For the ComboBox, it will directly use the accessorKey and the filter value.
    },
    {
        // Accessing nested subject.minutes_per_week as Lec/Lab Hours (adjust as needed)
        // You might need to derive these if 'minutes_per_week' is the only field
        // or check your API for separate Lec/Lab hour fields.
        // For now, let's display minutes_per_week and you can map it to your needs.
        accessorKey: "subject.minutes_per_week",
        header: "Minutes Per Week", // Consider renaming this to reflect the data
        cell: ({ row }) => {
            const minutes = row.original.subject?.minutes_per_week;
            return <div>{minutes || 'N/A'}</div>; // Display value or 'N/A'
        }
    },
    {
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