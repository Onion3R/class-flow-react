import { exportScreenshot, exportPdf, teacherExportScreenShot, teacherExportPdf } from "../services/exportService";  

export  const handleDownload = async ({queryParams, scheduleId, setLoading}) => {
    try {
      setLoading(true);

      // Export API call
      const blob = await exportScreenshot(
        scheduleId,
        queryParams.track_id,
        queryParams.section_ids
      );

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `schedule-${scheduleId}.png`;
      link.click();
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Screenshot download failed:', error);
      alert('Failed to export schedule. Please try again.');
    } finally {
      setLoading(false);
    }
  };



  export const handleDownloadPdf = async ({ queryParams, scheduleId, setLoading }) => {
  try {
    setLoading(true);

    // Export API call (expects a PDF blob)
    const blob = await exportPdf(
      scheduleId,
      queryParams.track_id,
      queryParams.section_ids
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



export  const teacherHandleDownloadPng = async ({scheduleId, teacherId, setLoading}) => {
  console.log('check url', scheduleId, teacherId)
    try {
      setLoading(true);

      // Export API call
      const blob = await teacherExportScreenShot(
        scheduleId,
        teacherId
      );

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `schedule-${scheduleId}.png`;
      link.click();
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Screenshot download failed:', error);
      alert('Failed to export schedule. Please try again.');
    } finally {
      setLoading(false);
    }
  };



export const teacherHandleDownloadPdf = async ({scheduleId, teacherId, setLoading})  => {
  try {
    setLoading(true);

    // Export API call (expects a PDF blob)
    const blob = await teacherExportPdf(
      scheduleId,
        teacherId
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


  