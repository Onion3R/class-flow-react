// src/Components/DataTable/dataTableComponent.jsx
import React, { useEffect, useState } from "react";
import { DataTable } from "./data-table"; // This is your shadcn-ui DataTable (Adjust path)
import DialogComponent from "../Dialog/diaglogComponent"; // (Adjust path)
import AlertDialogComponent from "../AlertDialog/AlertDialogComponent";
// This component acts as a wrapper, passing props from TabsComponent down to DataTable
export default function DataTableComponent({
  data,
  getColumns,
  alertDialogData,
  filteredData,
  filterComboBoxes = [], 
  addComponent,
  onRefresh
}) {
  const [tableData, setTableData] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openAlertDialog, setOpenAlertDialog] = useState(false);
  const [selectedRow, setSelectedRow] = useState()
  const [label, setLabel] = useState('')

  const [alertDialogCustomContent, setAlertDialogCustomContent] = useState()
  const [contextMenuDisable, setContextMenuDisable] = useState(false)
  useEffect(() => {
    setTableData(data);
  }, [data]);

  const columns = getColumns({ openDialog, setOpenDialog, setOpenAlertDialog, setSelectedRow , setLabel, setAlertDialogCustomContent , setContextMenuDisable});

  return (
    <div >
      <DataTable
        columns={columns}
        source={alertDialogData}
        data={tableData}
        filteredData={filteredData}
        // IMPORTANT: Pass the new prop here
        filterComboBoxes={filterComboBoxes}
        addComponent={addComponent}
         onRefresh={onRefresh}
         contextMenuDisable={contextMenuDisable}
      />
      <DialogComponent
        label={label}
        open={openDialog}
        selectedRow={selectedRow}
        onOpenChange={setOpenDialog}
        onConfirm={() => setOpenDialog(false)}
        onRefresh={onRefresh}
      />
      <AlertDialogComponent
        open={openAlertDialog}
        selectedRow = {selectedRow}
        data={ alertDialogData }
        onOpenChange={setOpenAlertDialog}
        onRefresh={onRefresh}
        content={alertDialogCustomContent}
      />
    </div>
  );
}