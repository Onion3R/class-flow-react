import { useEffect } from "react";

function ContextMenuEffectWrapper({ rowData, setContextMenuDisable, children }) {
  useEffect(() => {
    setContextMenuDisable(true);
  }, [setContextMenuDisable]);

  return children;
}


export default ContextMenuEffectWrapper