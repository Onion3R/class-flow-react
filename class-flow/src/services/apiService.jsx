// src/services/apiService.js
import api from "@/lib/api";

export const getSubjects = async () => {
  const response = await api.get('subjects/');
  return response.data;
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

export const getYearLevels = async () => {
  const response = await api.get('yearlevels/');
  return response.data;
};

export const getSemester = async () => {
  const response = await api.get('semesters/');
  return response.data;
};


// CORRECTED: getRooms should fetch from 'rooms/'
export const getRooms = async () => {
  const response = await api.get('rooms/');
  return response.data;
};

// CORRECTED: getRoomSchedule should fetch from 'roomschedules/'
export const getRoomSchedule = async () => {
  const response = await api.get('roomschedules/');
  return response.data;
};


export const getTeachers = async () => {
  const response = await api.get('teachers/');
  return response.data;
};

export const getScheduleClasses = async () => {
  const response = await api.get('scheduledclasses/');
  return response.data;
};

export const getSchedules = async () => {
  const response = await api.get('schedules/');
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

// --- MODIFIED/NEW FUNCTIONS FOR SINGLE ITEM POSTS ---

// Renamed from createSectionCourses to createSectionCourse (singular)
export const createSectionCourse = async (courseData) => {
  try {
    const response = await api.post('courses/', courseData);
    return response.data;
  } catch (error) {
    console.error("Error creating section course:", error.response?.data || error.message);
    throw error;
  }
};

// Renamed from createInstructorSchedules to createInstructorSchedule (singular)
export const createInstructorSchedule = async (instructorScheduleData) => {
  try {
    const response = await api.post('instructor-schedules/', instructorScheduleData);
    return response.data;
  } catch (error) {
    console.error("Error creating instructor schedule:", error.response?.data || error.message);
    throw error;
  }
};

// Renamed from createRoomSchedules to createRoomSchedule (singular)
export const createRoomSchedule = async (roomScheduleData) => {
  try {
    const response = await api.post('roomschedules/', roomScheduleData);
    return response.data;
  } catch (error) {
    console.error("Error creating room schedule:", error.response?.data || error.message);
    throw error;
  }
};

// This one was already singular in concept, but keeping the naming consistent
export const createGeneratedSchedule = async (generatedScheduleData) => {
  try {
    const response = await api.post('generatedschedules/', generatedScheduleData);
    return response.data;
  } catch (error) {
    console.error("Error creating generated schedule entry:", error.response?.data || error.message);
    throw error;
  }
};

// ** NEW FUNCTION TO ADD **
export const sendGenerateRequest = async (override, scheduleId, yearLevel, scheduleName) => {
  try {
    const data = {
      schedule_id: scheduleId,      // Correct: Matches backend 'schedule_id'
      year_level_id: yearLevel,     // <--- CORRECTED: Now matches backend 'year_level_id'
      name: scheduleName,           // <--- CORRECTED: Now matches backend 'name'
      override: override            // Correct: Matches backend 'override'
    };
    console.log("Sending generate request data (corrected keys):", data); // Added (corrected keys) for clarity
    const response = await api.post('generate-schedule/', data);
    return response;
  } catch (error) {
    console.error("Error triggering schedule generation:", error.response?.data || error.message);
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
   
    console.log("Sending subject and assignment data:", data);
    
    // Using api.post to send the combined payload to the specified endpoint.
    const response = await api.post('tracks/', data);
    
    return response;
  } catch (error) {
    // Log the full error response from the server if available.
    console.error("Error creating subject and assignments:", error.response?.payload || error.message);
    throw error;
  }
};

export const deleteTrack = async (trackIds) => {
  try {
    // Log the ID of the strand we are about to delete for debugging.
    console.log("Deleting strand with ID:", trackIds);
    
    // Use api.delete to send a DELETE request to the 'strands' endpoint
    // with the specific strand's ID appended to the URL.
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


export const createStrand = async (data) => {
  try {
   
    console.log("Sending subject and assignment data:", data);
    
    // Using api.post to send the combined payload to the specified endpoint.
    const response = await api.post('strands/', data);
    
    return response;
  } catch (error) {
    // Log the full error response from the server if available.
    console.error("Error creating subject and assignments:", error.response?.payload || error.message);
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


export const createSection = async (data) => {
  try {
   
    console.log("Sending subject and assignment data:", data);
    
    // Using api.post to send the combined payload to the specified endpoint.
    const response = await api.post('sections/', data);
    
    return response;
  } catch (error) {
    // Log the full error response from the server if available.
    console.error("Error creating subject and assignments:", error.response?.payload || error.message);
    throw error;
  }
};


export const deleteSection = async (sectionId) => {
  try {
    // Log the ID of the strand we are about to delete for debugging.
    console.log("Deleting strand with ID:", sectionId);
    
    // Use api.delete to send a DELETE request to the 'strands' endpoint
    // with the specific strand's ID appended to the URL.
    const response = await api.delete(`sections/${sectionId}/`);
    
    // Return the response from the server.
    return response;
  } catch (error) {
    // Log the full error response from the server if available.
    console.error("Error deleting strand:", error.response?.strandId || error.message);
    
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





// src/services/apiService.js

/**
 * Mocks an API call to generate an invitation link.
 * Replace this with your actual backend API call when ready.
 *
 * @param {string} role - The role for the invited user (e.g., 'admin', 'instructor').
 * @param {number|null} expirationDays - Number of days until the link expires, or null for no expiration.
 * @returns {Promise<{invite_url: string}>} - A promise that resolves with the generated invitation URL.
 */
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