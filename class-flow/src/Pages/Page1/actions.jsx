import { href } from "react-router-dom";

export const actions = (navigate,setOpenDialog , setOpenAlertDialog) => [
  { 
    id: 1,
    label: "View Details",
     action: (row) => {
      const id = row.id; // or rowData.id depending on your structure
     navigate(`/admin/team/instructor-detail/${id}`); 
    }

  },
  {
    id: 2,
    label: "Delete",
    action: () => setOpenAlertDialog(true),
  },
  {
    id: 3,
    label: "Edit",
    action: () => setOpenDialog(true), // we already have access to the row above
  },
];