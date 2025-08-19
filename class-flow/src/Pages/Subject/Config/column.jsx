// src/columns.js
import { actions } from "./actions";
import { MoreHorizontal, ArrowUpDown } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Checkbox } from "@Components/ui/checkbox";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import { Fragment } from "react";
import { useNavigate } from "react-router-dom";

export const getColumns = ({
    setOpenDialog,
    setOpenAlertDialog,
    setSelectedRow,
    setLabel,
}) => [
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
        accessorKey: "minutesPerWeek",
        header: "Minutes Per Week",
        cell: ({ row }) => {
            const minutes = row.original.minutesPerWeek;
            return <div>{minutes || "N/A"}</div>;
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const navigate = useNavigate();
            const rowData = row.original;
            const menuActions = actions(
                navigate,
                setOpenDialog,
                setOpenAlertDialog,
                setSelectedRow
            );

            return (
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
                                            setLabel("subjects");
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
                                        onClick={() => action(rowData)}
                                        className="w-full !text-red-500  justify-between hover:bg-red-100 dark:hover:bg-red-950/50 !hover:text-red-500"
                                    >
                                        {label} {icon}
                                    </DropdownMenuItem>
                                </Fragment>
                            )
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
