// BulkActionMenu.tsx
import {
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
} from "@/Components/ui/context-menu"
import { Trash2 } from "lucide-react"
import { useState, useEffect } from "react"

export function ContextMenuComponent({ selectedRows, allRowsCount,selectAllRows, deselectAllRows}) {
  const selectedCount = selectedRows.length

  const [allCount, setAllCount] = useState()
  useEffect(() => {
    setAllCount(allRowsCount)
  }, [allRowsCount])
  

  return (
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
      >
        <span className=" h-full w-full px-[8px] py-[6px] hover:bg-red-100 dark:hover:bg-red-950/50 text-red-500 rounded-sm flex items-center justify-between">Delete <Trash2 className="text-red-400 h-[10px] w-[10px] " /></span>
        
      </ContextMenuItem>
    </ContextMenuContent>
  )
}
