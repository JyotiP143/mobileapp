import api from "./api";

// Define type for the data you send
interface DemoData {
  [key: string]: any; // Replace with actual fields, e.g., name: string, email: string, etc.
}

// Define the shape of the expected API response
interface DemoResponse {
  success: boolean;
  message?: string;
  data?: any; // Replace `any` with actual response data structure if known
}

// Function to send demo request
export const sendDemo = async (
  demoData: DemoData
): Promise<DemoResponse | undefined> => {
  try {
    const response = await api.post<DemoResponse>("/demo", demoData);
    return response.data;
  } catch (error) {
    console.error("Error sending demo data:", error);
  }
};
