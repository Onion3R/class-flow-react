// src/columns.js
import { actions } from "./actions";
import { MoreHorizontal, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@Components/ui/checkbox";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AssignedCountCell from "../../assignment/pages/Assignment/components/AssignedCountCell";
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
        accessorKey: "code",
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
            return <div className="font-medium">{row.getValue('code')}</div>;
        },
    },
    {
        accessorKey: "title",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Subject Title
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) =>  <div className="min-w-[400px] ">{row.getValue('title')}</div>
    },
    {
        accessorKey: "minutes_per_week",
        header: "Minutes Per Week",
        cell: ({ row }) => {
            return <div className="ml-2">{row.getValue('minutes_per_week')}</div>;
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
                                            setLabel("subject");
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
