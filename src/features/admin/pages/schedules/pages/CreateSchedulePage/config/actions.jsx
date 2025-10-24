import { Trash2, View } from "lucide-react";
import CryptoJS from "crypto-js";
const SECRET_KEY = import.meta.env.VITE_SECRET_KEY

import { CREATE_SCHEDULE_ROUTES } from "../../routes";
export const actions = (navigate, setOpenDialog, setOpenAlertDialog, setSelectedRow) => [
  {
    id: 'view', // Unique ID for the action
    label: " Details",
    icon: <View className="h-[10px] w-[10px] " />,
    action: (rowData) => {
      console.log("Viewing program:", rowData.name);
      const encryptedId = CryptoJS.AES.encrypt(rowData.id.toString(), SECRET_KEY).toString();
      navigate(`${CREATE_SCHEDULE_ROUTES.DETAIL}${encodeURIComponent(encryptedId)}`);
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