import { PencilLine, Trash2, View } from "lucide-react";
import CryptoJS from "crypto-js";

const SECRET_KEY = import.meta.env.VITE_SECRET_KEY;
const BASE_URL = '/admin/team';
export const actions = (navigate, setOpenDialog, setOpenAlertDialog, setSelectedRow) => [
  {
    id: 'view', // Unique ID for the action
    label: "Details",
    icon: <View className="h-[10px] w-[10px] " />,
    action: (rowData) => {
      const id = rowData.id; // or rowData.id depending on your structure
      const encryptedId = CryptoJS.AES.encrypt(rowData.id.toString(), SECRET_KEY).toString();
      navigate(`${BASE_URL}/instructor-detail/${encodeURIComponent(encryptedId)}`);
    },
  },
   {
    id: 'edit',
    label: "Edit",
    icon: <PencilLine className="h-[10px] w-[10px] " />,
    action: (rowData) => {
      console.log("Editing program:", rowData.name);
      // Example: Open a dialog for editing. You'd likely pass rowData to a state
      // in your parent component to populate the dialog.
     
      setOpenDialog(true);
        setSelectedRow(rowData)
      // In a real app, you'd also pass rowData or its ID to the dialog/form
      // to pre-fill it. E.g., context.setProgramToEdit(rowData);
    },
  },
  {
    id: 'delete',
    label: "Delete",
    icon: <Trash2 className="text-red-400 h-[10px] w-[10px] " />,
    action: (rowData) => {
      console.log("Deleting program:", rowData.name);
      // Example: Open a confirmation dialog before deleting
      setOpenAlertDialog(true);
      setSelectedRow(rowData)
    },
  },
  // Add more program-specific actions here
];