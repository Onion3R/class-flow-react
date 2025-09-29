import { PencilLine, Trash2, View } from "lucide-react";

export const actions = (navigate, setOpenDialog, setOpenAlertDialog, setSelectedRow) => [
  {
    id: 'view', // Unique ID for the action
    label: " Details",
    icon: <View className="h-[10px] w-[10px] " />,
    action: (rowData) => {
      console.log("Viewing program:", rowData.name);
      // Example: Navigate to a detailed view page for the program
      navigate(`/programs/${rowData.id}`);
    },
  },
  {
    id: 'delete',
    label: "Delete",
    icon: <Trash2 className="text-red-400 h-[10px] w-[10px] " />,
    action: (rowData) => {
      console.log("Deleting program:", rowData.name);
      // Example: Open a confirmation dialog before deleting
      setSelectedRow(rowData)
      setOpenAlertDialog(true);
      
    },
  },
  // Add more program-specific actions here
];