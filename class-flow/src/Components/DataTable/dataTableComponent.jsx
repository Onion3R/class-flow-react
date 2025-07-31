// src/Components/DataTable/dataTableComponent.jsx
import React, { useEffect, useState } from "react";
import { DataTable } from "./data-table"; // This is your shadcn-ui DataTable (Adjust path)
import DialogComponent from "../Dialog/diaglogComponent"; // (Adjust path)
import AlertDialogComponent from "../AlertDialog/alertDialog"; // (Adjust path)

// This component acts as a wrapper, passing props from TabsComponent down to DataTable
export default function DataTableComponent({
  data,
  getColumns,
  filteredData,
  filterComboBoxes = [], // Expect the new prop here, default to empty array
  addComponent,
}) {
  const [tableData, setTableData] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openAlertDialog, setOpenAlertDialog] = useState(false);

  useEffect(() => {
    setTableData(data);
  }, [data]);

  const columns = getColumns({ setOpenDialog, setOpenAlertDialog });

  return (
    <div className="container mx-auto">
      <DataTable
        columns={columns}
        data={tableData}
        filteredData={filteredData}
        // IMPORTANT: Pass the new prop here
        filterComboBoxes={filterComboBoxes}
        addComponent={addComponent}
      />
      <DialogComponent
        open={openDialog}
        onOpenChange={setOpenDialog}
        onConfirm={() => setOpenDialog(false)}
      />
      <AlertDialogComponent
        open={openAlertDialog}
        onOpenChange={setOpenAlertDialog}
      />
    </div>
  );
}