// src/Components/DataTable/data-table.jsx

import { useState, useEffect, useMemo } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Settings2 } from "lucide-react";

import { Input } from "@/Components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import { ComboBox } from "../ComboBox/comboBoxComponent";
import { ContextMenu, ContextMenuTrigger } from "@/Components/ui/context-menu";
import { ContextMenuComponent } from "../ContextMenu/contextMenuComponent";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Components/ui/table";
import { Button } from "../ui/button";

/**
 * DataTable Component
 * @param {object} props - Component props
 * @param {Array<object>} props.columns - Array of column definitions for React Table.
 * @param {Array<object>} props.data - The data array to display in the table.
 * @param {string} props.filteredData - The accessorKey of the column for the main search input.
 * @param {Array<object>} [props.filterComboBoxes=[]] - Optional. An array of objects defining dynamic ComboBox filters.
 * Each object should have:
 * - {string} columnId: The accessorKey/ID of the column this ComboBox will filter.
 * - {function} [labelFormatter]: Optional. A function (value) => string to format the display label.
 * @param {React.ReactNode} props.addComponent - React node for the add component (e.g., a dialog trigger).
 */
export function DataTable({
  columns,
  data,
  filteredData,
  filterComboBoxes = [], // New prop for dynamic combo boxes, default to empty array
  addComponent,
}) {
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState({});
  const [filteredColumn, setFilteredColumn] = useState('email'); // For the main search input
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [comboBoxHasSelectedItem, setComboBoxHasSelectedItem] = useState(false); // Consider refining if multiple combo boxes

  useEffect(() => {
    if (filteredData) {
      setFilteredColumn(filteredData);
    }
  }, [filteredData]);

  // Function to dynamically generate options for any ComboBox
  const getComboBoxOptions = useMemo(() => {
    return (columnId, labelFormatter = (value) => value) => {
      if (!columnId || !Array.isArray(data) || data.length === 0) return [];

      const uniqueValues = new Set();
      // Safely access nested properties using a simple resolver
      const resolveValue = (obj, path) => {
        // Handle cases where path segments might be null/undefined
        return path.split('.').reduce((acc, part) => acc && acc[part], obj);
      };

      data.forEach(item => {
        const value = resolveValue(item, columnId);
        if (value !== undefined && value !== null) {
          uniqueValues.add(value);
        }
      });

      return Array.from(uniqueValues).map(value => ({
        label: labelFormatter(value),
        value: value,
      }));
    };
  }, [data]); // Regenerate this function if 'data' changes

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
  });

  // Effect to reset row selection when filters change
  useEffect(() => {
    table.resetRowSelection();
  }, [table.getState().columnFilters, table]);

  const activeColumn = useMemo(() => {
    return table.getAllColumns().find((col) => col.id === filteredColumn);
  }, [table, filteredColumn]);

  const headerLabel = useMemo(() => {
    return typeof activeColumn?.columnDef.header === "string"
      ? activeColumn.columnDef.header
      : activeColumn?.id || "Search"; // Fallback to column ID or generic "Search"
  }, [activeColumn]);

  return (
    <div className="">
      <div className="mb-4 sm:flex justify-between sm:flex-row ">
        <div className="w-full mr-2.5 sm:max-w-sm ">
          <Input
            placeholder={`Filter ${headerLabel}...`}
            value={(table.getColumn(filteredColumn)?.getFilterValue() ?? "")}
            onChange={(event) =>
              table.getColumn(filteredColumn)?.setFilterValue(event.target.value)
            }
          />
        </div>
        <div className="w-full max-w-[calc(100% - 24rem)] flex justify-between items-center mt-2 sm:mt-0">
          <div className="flex gap-2">
            {/* Dynamically render ComboBoxes based on filterComboBoxes prop */}
            {filterComboBoxes.map((filterDef, index) => {
              const options = getComboBoxOptions(filterDef.columnId, filterDef.labelFormatter);
              return (
                options.length > 0 && ( // Only render if there are actual options
                  <ComboBox
                    key={filterDef.columnId || index} // Use columnId as key, fallback to index
                    data={options}
                    setComboBoxHasSelectedItem={setComboBoxHasSelectedItem} // Might need more granular state if multiple
                    comboFilteredData={filterDef.columnId} // Pass the column ID to the ComboBox
                    setFilterValue={(value) => {
                      table.getColumn(filterDef.columnId)?.setFilterValue(
                        !value || value.length === 0 ? undefined : value
                      );
                    }}
                  />
                )
              );
            })}
          </div>
          <div className=" flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto">
                  <Settings2 className="mr-2 h-4 w-4" />
                  View
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel className="font-medium text-sm">Toggle Columns</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {table
                  .getAllColumns()
                  .filter(
                    (column) => column.getCanHide()
                  )
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        value={column.id} // Use column.id for the value
                        className="capitalize text-sm"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        {
                          typeof column.columnDef.header === "string"
                            ? column.columnDef.header
                            : column.id // Fallback to column.id if header is a component
                        }
                      </DropdownMenuCheckboxItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
            {addComponent}
          </div>
        </div>
      </div>
      <div className="overflow-hidden border rounded-md">
        <Table>
          <TableHeader className="bg-muted/70">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="!font-[500]">
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
              allRowsCount={table.getFilteredRowModel().rows.length}
              selectAllRows={() => {
                const rows = comboBoxHasSelectedItem // Use filtered rows if a combo box is active
                  ? table.getFilteredRowModel().rows
                  : table.getCoreRowModel().rows;
                rows.forEach((row) => row.toggleSelected(true));
              }}
              deselectAllRows={() => {
                const rows = comboBoxHasSelectedItem // Use filtered rows if a combo box is active
                  ? table.getFilteredRowModel().rows
                  : table.getCoreRowModel().rows;
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
  );
}