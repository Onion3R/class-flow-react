export const actions = (setOpenDialog , setOpenAlertDialog) => [
  { 
    id: 1,
    label: "View Details",
    action: (row) => console.log("View", row),
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