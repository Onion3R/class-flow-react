// BulkActionMenu.tsx
import {
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
} from "@/Components/ui/context-menu"

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
      <ContextMenuItem onClick={()=> (selectAllRows())} disabled={selectedCount === allRowsCount}>
        Select All ({allCount})
      </ContextMenuItem>
      <ContextMenuItem disabled={selectedCount === 0} onClick={()=> deselectAllRows()}>
       Deselect All ({selectedCount})
      </ContextMenuItem>
      <ContextMenuSeparator />
      <ContextMenuItem
        disabled={selectedCount === 0}
        className="text-red-600" 
      >
        Delete
      </ContextMenuItem>
    </ContextMenuContent>
  )
}
