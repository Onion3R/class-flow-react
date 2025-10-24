// BulkActionMenu.tsx
import {
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
} from "@/components/ui/context-menu"
import { Trash2 } from "lucide-react"
import { useState, useEffect } from "react"
import AlertDialogComponent from "../AlertDialog/AlertDialogComponent"
export function ContextMenuComponent({ source,selectedRows, allRowsCount,selectAllRows, deselectAllRows, onRefresh}) {
  const [openAlertDialog, setOpenAlertDialog] = useState(false);
  
  const selectedCount = selectedRows.length

  const [allCount, setAllCount] = useState()
  const [selectedRowData, setSelectedRowData] = useState()
  useEffect(() => {
    setAllCount(allRowsCount)
    setSelectedRowData(selectedRows.map(row => row.original))
  }, [allRowsCount, selectedRows])

  

  // useEffect(() => {
  //   console.log('this is the selectedRow',selectedRows , 'and the source is', source)
    
   
  // }, [selectedRows])
  
  // const handleDelete = () => {
  //   console.log('these items will be deleted', selectedRows)
  // }

  return (
    <div>
    <ContextMenuContent>
      {/* <ContextMenuItem disabled={selectedCount === 0}>
        Bulk View ({selectedCount})
      </ContextMenuItem> */}
      <ContextMenuItem
        onClick={() => selectAllRows()}
        disabled={selectedCount === allRowsCount}
        className="flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
      >
        <span>  Select All </span> <span className="text-[12px] font-medium"> {allCount} </span>
      </ContextMenuItem>
      <ContextMenuItem
        disabled={selectedCount === 0}
        onClick={() => deselectAllRows()}
        className="flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
      >
        <span> Deselect All </span> <span className="text-[12px] font-medium">{selectedCount} </span>
      </ContextMenuItem>
      <ContextMenuSeparator />
      <ContextMenuItem
        disabled={selectedCount === 0}
        className="p-0 cursor-pointer"
        onClick={() => setOpenAlertDialog(true)}
      >
        <span className=" h-full w-full px-[8px] py-[6px] hover:bg-red-100 dark:hover:bg-red-950/50 text-red-500 rounded-sm flex items-center justify-between" >Delete <Trash2 className="text-red-400 h-[10px] w-[10px] " /></span>
        
      </ContextMenuItem>
    </ContextMenuContent>
      <AlertDialogComponent
        open={openAlertDialog}
        selectedRow = {selectedRowData ?? null}
        data={ source }
        onOpenChange={setOpenAlertDialog}
        onRefresh={onRefresh}
           />
    </div>
  )
}
