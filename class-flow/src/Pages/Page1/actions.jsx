
export const actions = (navigate, setOpenDialog, setOpenAlertDialog, setSelectedRow) => [
  {
    id: 'view', // Unique ID for the action
    label: "View Details",
    action: (rowData) => {
      const id = rowData.id; // or rowData.id depending on your structure
     navigate(`/admin/team/instructor-detail/${id}`); 
    },
  },
  {
    id: 'edit',
    label: "Edit Program",
    action: (rowData) => {
      console.log("Editing program:", rowData.name);
      // Example: Open a dialog for editing. You'd likely pass rowData to a state
      // in your parent component to populate the dialog.
      setOpenDialog(true);
      // In a real app, you'd also pass rowData or its ID to the dialog/form
      // to pre-fill it. E.g., context.setProgramToEdit(rowData);
    },
  },
  {
    id: 'delete',
    label: "Delete Program",
    action: (rowData) => {
      console.log("Deleting program:", rowData.name);
      // Example: Open a confirmation dialog before deleting
      setOpenAlertDialog(true);
      setSelectedRow(rowData)
    },
  },
  // Add more program-specific actions here
];