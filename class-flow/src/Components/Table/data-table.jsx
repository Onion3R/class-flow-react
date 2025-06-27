// import React from "react"
import { useState, useEffect } from "react"
import {
 
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {Settings2} from "lucide-react"

import { Input } from "@/Components/ui/input"

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu"
import { ComboBox } from "../ComboBox/comboBox"
import { ContextMenu, ContextMenuTrigger } from "@/Components/ui/context-menu"
import { ContextMenuComponent } from "../ContextMenu/contextMenuComponent"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Components/ui/table"
import { Button } from "../ui/button";

export function DataTable({ columns, data, filteredData, comboFilteredData}) {
  const [rowSelection, setRowSelection] = useState({})
  const [columnVisibility, setColumnVisibility] =  useState({})
  const [filteredColumn, setFilterdColumn] = useState('email')
  const [comboFilterColumn, setComboFilterColumn] = useState('subject')
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [comboBoxHasSelectedItem, setComboBoxHasSelectedItem] = useState(false)
  
    
  useEffect(() => {
    if (filteredData && filteredData.length > 0 &&  comboFilteredData && comboFilteredData ) {
      setFilterdColumn(filteredData);
      setComboFilterColumn(comboFilteredData)
    }
    console.log(comboBoxHasSelectedItem)
  }, [filteredData, comboFilteredData, comboBoxHasSelectedItem]);
  const table = useReactTable({
    data,
    columns,
    enableRowSelection: true,
    onColumnVisibilityChange: setColumnVisibility,
    getPaginationRowModel: getPaginationRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    state: {   
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      
    },
    
  })
  useEffect(() => {
          table.resetRowSelection();
        }, [table.getState().columnFilters]);
const activeColumn = table
    .getAllColumns()
    .find((col) => col.id === filteredColumn)

      const headerLabel =
        typeof activeColumn?.columnDef.header === "string"
          ? activeColumn.columnDef.header
          : "Email" // fallback if it's a React component or function
  
  return (
    <div >
      <div className="mb-4 sm:flex justify-between sm:flex-row">
          <div  className="w-full mr-2.5 sm:max-w-sm ">
          <Input
              placeholder={`Filter ${headerLabel}...`}
              value={table.getColumn(filteredColumn)?.getFilterValue() ?? ""}
              onChange={(event) =>
                table.getColumn(filteredColumn)?.setFilterValue(event.target.value)
              }
            />
          </div>
          <div className="w-full max-w-[calc(100% - 24rem)] flex justify-between items-center mt-2 sm:mt-0">
            <ComboBox
                data={data}
                setComboBoxHasSelectedItem = {setComboBoxHasSelectedItem}
                comboFilteredData={comboFilterColumn}
                setFilterValue={(value) => {
                  table.getColumn(comboFilterColumn)?.setFilterValue(
                    !value || value.length === 0 ? undefined : value
                  )
                }}
              />
            <div className=" flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                <Settings2 />
                View
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter(
                  (column) => column.getCanHide()
                )
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      value={column.header}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {
                        typeof column.columnDef.header === "string"
                          ? column.columnDef.header
                          : column.id  // fallback if header is a function or JSX
                      }
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
                variant="default"
                className="ml-2 w-24"
                onClick={() => table.resetColumnFilters()
                }> Add
          </Button>
          </div>
          </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <ContextMenu>
          <ContextMenuTrigger asChild>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          </ContextMenuTrigger>
          <ContextMenuComponent 
          selectedRows={table.getSelectedRowModel().rows}  
          allRowsCount = {table.getFilteredRowModel().rows.length}
          selectAllRows={() => {
            const rows = comboBoxHasSelectedItem
              ? table.getRowModel().rows
              :  table.getCoreRowModel().rows;

            rows.forEach((row) => row.toggleSelected(true));
          }}
          deselectAllRows={() => {
            const rows = comboBoxHasSelectedItem
              ? table.getRowModel().rows
              :  table.getCoreRowModel().rows;

            rows.forEach((row) => row.toggleSelected(false));
          }}
          />
          </ContextMenu>
        </Table>
      </div>
      
      <div className="flex items-center justify-end space-x-2 pt-3">
        <div className="text-muted-foreground flex-1 text-sm">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
  </div>
  )
}

// input filter for email
// This is a simple input filter for the email column. It allows users to filter the table

