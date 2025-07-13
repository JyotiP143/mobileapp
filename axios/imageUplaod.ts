import api from "./api";

// Define types (customize based on actual structure)
interface ImageUploadData {
  [key: string]: any; // e.g., file: File, userId: string, etc.
}

interface ImageResponse {
  success: boolean;
  latestImage?: any; // Replace `any` with actual image object structure
  message?: string;
}

// Upload image data
export const uploadImageData = async (
  imageData: ImageUploadData
): Promise<ImageResponse | undefined> => {
  try {
    const response = await api.post<ImageResponse>("/loan/uploadImage", imageData);
    return response.data;
  } catch (error) {
    console.error("Error uploading image:", error);
  }
};

// Get image data by two IDs
export const getImageData = async (
  id1: string,
  id2: string
): Promise<ImageResponse | undefined> => {
  try {
    const response = await api.get<ImageResponse>(`/loan/getImage/${id1}/${id2}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching image data:", error);
  }
};
