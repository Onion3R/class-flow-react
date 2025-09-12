// src/services/apiService.js
import api from "@/lib/api";

export const getSubjects = async () => {
  const response = await api.get('subjects/');
  return response.data;
};
export const getSubjectById = async (subjectId) => {

  try {
    
  const response = await api.get(`subjects/${subjectId}/`);
    return response.data;
  } catch (error) {
    console.error("Error creating main schedule:", error.response?.data || error.message);
    throw error;
  }
};

export const getStrands = async () => {
  const response = await api.get('strands/');
  return response.data;
};

export const getTracks = async () => {
  const response = await api.get('tracks/');
  return response.data;
};

export const getSections = async () => {
  const response = await api.get('sections/');
  return response.data;
};


export const getSubjectStrand = async () => {
  const response = await api.get('strand-subjects/');
  return response.data;
};


export const getSpecificSubjectStrand = async (id) => {
  const response = await api.get(`strand-subjects/${id}/`);
  return response.data;
};



export const createSubjectStrand = async (scheduleData) => {
  try {
    const response = await api.post('strand-subjects/', scheduleData);
    return response.data;
  } catch (error) {
    console.error("Error creating subject with strand strand:", error.response?.data || error.message);
    throw error;
  }
};

export const getYearLevels = async () => {
  const response = await api.get('yearlevels/');
  return response.data;
};

export const getSemester = async () => {
  const response = await api.get('semesters/');
  return response.data;
};



export const addSpecializationToTeacher = async (data) => {
  const response = await api.post('teacher-specializations/', data);
  return response.data;
};

export const deleteSpecializationFromTeacher = async (data) => {
  const response = await api.delete(`teacher-specializations/${data}/`);
  return response.data;
};


export const getSpecificTeacher = async (teacherId) => {
  const response = await api.get(`teachers/${teacherId}/`);
  return response.data;
};

export const getSchedules = async () => {
  const response = await api.get('schedules/');
  return response.data;
};


export const getGeneratedSchedules = async () => {
  const response = await api.get('generated-schedules/');
  return response.data;
};

export const createSchedule = async (scheduleData) => {
  try {
    const response = await api.post('schedules/', scheduleData);
    return response.data;
  } catch (error) {
    console.error("Error creating main schedule:", error.response?.data || error.message);
    throw error;
  }
};

export const getFilteredScheduleById = async (scheduleId) => {
  try {
    const response = await api.get(`timetable/?generated_schedule_id=${scheduleId}` );
    return response.data;
  } catch (error) {
    console.error("Error creating main schedule:", error.response?.data || error.message);
    throw error;
  }
};



export const deleteSchedule = async (scheduleId) => {
  try {
    // Log the ID of the strand we are about to delete for debugging.
    console.log("Deleting strand with ID:", scheduleId);
    const response = await api.delete(`schedules/${scheduleId}/`);
    
    // Return the response from the server.
    return response;
  } catch (error) {
    // Log the full error response from the server if available.
    console.error("Error deleting strand:", error.response?.strandId || error.message);
    
    // Re-throw the error so it can be handled by the calling function.
    throw error;
  }
};




export const createSubjectWithAssignments = async (payload) => {
  try {
   
    console.log("Sending subject and assignment data:", payload);
    
    // Using api.post to send the combined payload to the specified endpoint.
    const response = await api.post('subjects/create_with_strand_assignment/', payload);
    
    return response;
  } catch (error) {
    // Log the full error response from the server if available.
    console.error("Error creating subject and assignments:", error.response?.payload || error.message);
    throw error;
  }
};




export const createTrack = async (data) => {
  try {
   
    console.log("Sending tack and assignment data:", data);
    
    // Using api.post to send the combined payload to the specified endpoint.
    const response = await api.post('tracks/', data);
    
    return response;
  } catch (error) {
    // Log the full error response from the server if available.
    console.error("Error creating track and assignments:", error.response?.payload || error.message);
    throw error;
  }
};

export const deleteTrack = async (trackIds) => {
  try {
    // Log the ID of the strand we are about to delete for debugging.
    console.log("Deleting strand with ID:", trackIds);
    const response = await api.delete(`tracks/${trackIds}/`);
    
    // Return the response from the server.
    return response;
  } catch (error) {
    // Log the full error response from the server if available.
    console.error("Error deleting strand:", error.response?.strandId || error.message);
    
    // Re-throw the error so it can be handled by the calling function.
    throw error;
  }
};
export const updateTrack = async (trackIds, updatedData) => {
  try {
    // Log the ID of the strand we are about to delete for debugging.
    console.log("Updating strand with ID:", trackIds);
    const response = await api.put(`tracks/${trackIds}/`, updatedData);

    // Return the response from the server.
    return response;
  } catch (error) {
    // Log the full error response from the server if available.
    console.error("Error updating strand:", error.response?.strandId || error.message);
    
    // Re-throw the error so it can be handled by the calling function.
    throw error;
  }
};



export const createStrand = async (data) => {
  try {
   
    console.log("Sending strand and assignment data:", data);
    
    // Using api.post to send the combined payload to the specified endpoint.
    const response = await api.post('strands/', data);
    
    return response;
  } catch (error) {
    // Log the full error response from the server if available.
    console.error("Error creating strand and assignments:", error.response?.payload || error.message);
    throw error;
  }
};

export const deleteStrand = async (strandId) => {
  try {
    // Log the ID of the strand we are about to delete for debugging.
    console.log("Deleting strand with ID:", strandId);
    
    // Use api.delete to send a DELETE request to the 'strands' endpoint
    // with the specific strand's ID appended to the URL.
    const response = await api.delete(`strands/${strandId}/`);
    
    // Return the response from the server.
    return response;
  } catch (error) {
    // Log the full error response from the server if available.
    console.error("Error deleting strand:", error.response?.strandId || error.message);
    
    // Re-throw the error so it can be handled by the calling function.
    throw error;
  }
};
export const updateStrand = async (strandId, updatedData) => {
  try {
    // Log the ID of the strand we are about to delete for debugging.
    console.log("Deleting strand with ID:", strandId);
    
    // Use api.delete to send a DELETE request to the 'strands' endpoint
    // with the specific strand's ID appended to the URL.
    const response = await api.put(`strands/${strandId}/`, updatedData);
    
    // Return the response from the server.
    return response;
  } catch (error) {
    // Log the full error response from the server if available.
    console.error("Error deleting strand:", error.response?.strandId || error.message);
    
    // Re-throw the error so it can be handled by the calling function.
    throw error;
  }
};


export const createSection = async (data) => {
  try {
   
    console.log("Sending section and assignment data:", data);
    
    // Using api.post to send the combined payload to the specified endpoint.
    const response = await api.post('sections/', data);
    
    return response;
  } catch (error) {
    // Log the full error response from the server if available.
    console.error("Error creating section and assignments:", error.response?.payload || error.message);
    throw error;
  }
};


export const deleteSection = async (sectionId) => {
  try {
    // Log the ID of the strand we are about to delete for debugging.
    console.log("Deleting section with ID:", sectionId);
    
    // Use api.delete to send a DELETE request to the 'strands' endpoint
    // with the specific strand's ID appended to the URL.
    const response = await api.delete(`sections/${sectionId}/`);
    
    // Return the response from the server.
    return response;
  } catch (error) {
    // Log the full error response from the server if available.
    console.error("Error deleting strand:", error.response?.sectionId || error.message);
    
    // Re-throw the error so it can be handled by the calling function.
    throw error;
  }
};
export const updateSection = async (sectionId, updatedData) => {
  try {
    // Log the ID of the strand we are about to delete for debugging.
    console.log("Updating section with ID:", sectionId);
    
    // Use api.delete to send a DELETE request to the 'strands' endpoint
    // with the specific strand's ID appended to the URL.
    const response = await api.put(`sections/${sectionId}/`, updatedData);
    
    // Return the response from the server.
    return response;
  } catch (error) {
    // Log the full error response from the server if available.
    console.error("Error updating strand:", error.response?.sectionId || error.message);
    
    // Re-throw the error so it can be handled by the calling function.
    throw error;
  }
};

export const deleteSubject = async (subjectId) => {
  try {
    // Log the ID of the strand we are about to delete for debugging.
    console.log("Deleting strand with ID:", subjectId);
    
    // Use api.delete to send a DELETE request to the 'strands' endpoint
    // with the specific strand's ID appended to the URL.
    const response = await api.delete(`subjects/${subjectId}/`);
    
    // Return the response from the server.
    return response;
  } catch (error) {
    // Log the full error response from the server if available.
    console.error("Error deleting strand:", error.response?.strandId || error.message);
    
    // Re-throw the error so it can be handled by the calling function.
    throw error;
  }
};
export const deleteSubjectStrand = async (subjectId) => {
  try {
    // Log the ID of the strand we are about to delete for debugging.
    console.log("Deleting subject strand with ID:", subjectId);
    
    // Use api.delete to send a DELETE request to the 'strands' endpoint
    // with the specific strand's ID appended to the URL.
    const response = await api.delete(`strand-subjects/${subjectId}/`);
    
    // Return the response from the server.
    return response;
  } catch (error) {
    // Log the full error response from the server if available.
    console.error("Error deleting strand:", error.response?.strandId || error.message);
    
    // Re-throw the error so it can be handled by the calling function.
    throw error;
  }
};





// export const  generateSchedule = async (data) => {
//   try {
   
//     console.log("Sending subject and assignment data:", data); 
//     // Using api.post to send the combined payload to the specified endpoint.
//     const response = await api.post('generate-schedule/', data);
//     return response;
//   } catch (error) {
//     // Log the full error response from the server if available.
//     console.error("Error generating schedules:", error.response?.data || error.message);
//     throw error;
//   }
// };


export const generateSchedule = async (data) => {
  try {
    console.log("Sending subject and assignment data:", data);
    // Using api.post to send the combined payload to the specified endpoint.
    const response = await api.post('generate-schedule/', data);
    return response.data; // Return the data directly on success
  } catch (error) {
    // Log the full error response for debugging purposes
    console.error("Error generating schedules:", error.response?.data || error.message);
    
    // Extract the specific error message from the nested response object.
    const errorMessage = error.response?.data?.message || "An unexpected error occurred.";
    
    // Throw a new Error object with just the message string.
    // This allows the calling function to catch a simple, clean message.
    throw new Error(errorMessage);
  }
};














export async function generateInviteLink(role, expirationDays) {
    console.log("MOCK API CALL (NO BACKEND): Generating link for role:", role, "expiration:", expirationDays, "days");

    // --- TEMPORARY MOCK IMPLEMENTATION (for UI testing without a real backend) ---
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Updated to use http://localhost:5173/ as the base URL
            const mockLink = `http://localhost:5173/invite?role=${role}&exp=${expirationDays === null ? 'never' : expirationDays + 'd'}&token=${Math.random().toString(36).substring(2, 10)}`;
            resolve({ invite_url: mockLink });

            // Uncomment the line below to simulate an error for testing error handling
            // reject(new Error("MOCK ERROR: Failed to generate link (simulated)."));
        }, 1200); // Simulate network delay of 1.2 seconds
    });
    // --- END TEMPORARY MOCK ---


    /*
    // --- REAL BACKEND API CALL (Uncomment and complete when ready for backend integration) ---
    const API_ENDPOINT = '/api/invite-link'; // Your actual backend endpoint

    try {
        const response = await fetch(API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // --- AUTHENTICATION TOKEN PART (commented out as requested) ---
                // 'Authorization': `Bearer YOUR_AUTH_TOKEN_HERE`, // Replace YOUR_AUTH_TOKEN_HERE with the actual token
                // --- END AUTHENTICATION TOKEN PART ---
            },
            body: JSON.stringify({
                role: role,
                expiration_days: expirationDays,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("API Error Response:", errorData);
            throw new Error(errorData.message || `API Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return data; // Expected: { invite_url: "your_generated_link" }

    } catch (error) {
        console.error("Error in generateInviteLink API call:", error);
        throw new Error(`Network or client error: ${error.message}`);
    }
    // --- END REAL BACKEND API CALL ---
    */
}