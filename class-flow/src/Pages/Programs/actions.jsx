// src/programs/program-actions.js

/**
 * Defines the actions available for a Program row in the DataTable.
 * @param {function} navigate - react-router-dom's navigate function.
 * @param {function} setOpenDialog - State setter for an edit/view dialog.
 * @param {function} setOpenAlertDialog - State setter for a confirmation dialog (e.g., delete).
 * @returns {Array<Object>} An array of action objects.
 */
export const actions = (navigate, setOpenDialog, setOpenAlertDialog) => [
  {
    id: 'view', // Unique ID for the action
    label: "View Details",
    action: (rowData) => {
      console.log("Viewing program:", rowData.name);
      // Example: Navigate to a detailed view page for the program
      navigate(`/programs/${rowData.id}`);
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
      // Similarly, pass rowData or its ID to the alert dialog for context
      // E.g., context.setProgramToDelete(rowData.id);
    },
  },
  // Add more program-specific actions here
];