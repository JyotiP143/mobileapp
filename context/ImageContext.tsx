"use client";
import React, {
  createContext,
  ReactNode,
  useContext,
  useState
} from "react";
import { getImageData } from "./../axios/imageUplaod";

// Define types
interface ImageData {
  name: string;
  uploadDate: string;
  imageUrl: string;
}

interface ImageContextType {
  uploadedImage: ImageData[];
  isLoading: boolean;
  fetchImages: (customerId: string, owner: string) => Promise<void>;
  setUploadedImage: React.Dispatch<React.SetStateAction<ImageData[]>>;
}

// Create context
const ImageContext = createContext<ImageContextType | undefined>(undefined);

// Custom hook
export const useImageContext = (): ImageContextType => {
  const context = useContext(ImageContext);
  if (!context) {
    throw new Error("useImageContext must be used within an ImageProvider");
  }
  return context;
};

// Provider component props
interface ImageProviderProps {
  children: ReactNode;
}

// Provider component
export const ImageProvider: React.FC<ImageProviderProps> = ({ children }) => {
  const [uploadedImage, setUploadedImage] = useState<ImageData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchImages = async (customerId: string, owner: string): Promise<void> => {
    setUploadedImage([]);
    setIsLoading(true);
    try {
      const response : any = await getImageData(customerId, owner);
      if (!response || !response.success) return;

      const newImages: ImageData[] = response.checkCustomer.map((imageData: any) => ({
        name: imageData.imageName,
        uploadDate: new Date(imageData.UploadedDate).toLocaleDateString(),
        imageUrl: `data:${imageData.mimeType};base64,${imageData.imageData}`,
      }));

      setUploadedImage(newImages);
    } catch (error) {
      console.error("Error fetching images:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const value: ImageContextType = {
    uploadedImage,
    isLoading,
    fetchImages,
    setUploadedImage,
  };

  return (
    <ImageContext.Provider value={value}>{children}</ImageContext.Provider>
  );
};
