import React, { useEffect, useState } from "react"
// import { getColumns } from "../../Pages/Page1/column"
import { DataTable } from "./data-table"
import DialogComponent from "../Dialog/diaglogComponent"
import AlertDialogComponent from "../AlertDialog/alertDialog"

export default function DataTableComponent({ data, getColumns, filteredData, comboFilteredData}) {
  const [tableData, setTableData] = useState([])
  const [openDialog, setOpenDialog] = useState(false)
  const [openAlertDialog, setOpenAlertDialog] = useState(false)

  useEffect(() => {
    setTableData(data)
  }, [data])

  const columns = getColumns({ setOpenDialog, setOpenAlertDialog })

  return (
    <div className="container mx-auto">
      <DataTable columns={columns} data={tableData} filteredData={filteredData}  comboFilteredData={comboFilteredData}/>
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
  )
}

