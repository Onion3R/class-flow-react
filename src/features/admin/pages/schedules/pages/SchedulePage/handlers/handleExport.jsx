
import { exportAdminScheduleExcel } from "../services/exportService";
export const teacherHandleDownloadPdf = async ({scheduleId, filters})  => {
  try {
    setLoading(true);

    // Export API call (expects a PDF blob)
    const blob = await exportAdminScheduleExcel(
      scheduleId,
        filters
    );

    // Create a blob URL
    const url = window.URL.createObjectURL(blob);

    // Automatically download
    const link = document.createElement("a");
    link.href = url;
    link.download = `schedule-${scheduleId}.pdf`; // ✅ fixed extension
    link.click();

    // Cleanup
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("PDF download failed:", error);
    alert("Failed to export schedule as PDF. Please try again.");
  } finally {
    setLoading(false);
  }
};