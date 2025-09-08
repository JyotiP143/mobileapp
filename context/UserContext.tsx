"use client";
import { getToken } from "@/utils/authToken";
import { useRouter } from "expo-router";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { loadLoanData } from "./../axios/loanApi";
import { updateImage, userDetails } from "./../axios/profile";


// Interfaces
interface UserData {
  id: string | null;
  email: string | null;
  name: string | null;
  companyName: string | null;
  phone: string | null;
  joinDate: string | null;
  location: string | null;
  filter: string;
}

interface UserInfo {
  [key: string]: any;
}

interface Loan {
  [key: string]: any;
}

interface ProfileImage {
  [key: string]: any;
}

interface UserContextType {
  setLoanData: React.Dispatch<React.SetStateAction<Loan[]>>;
  loanData: Loan[];
  ProfileImage: ProfileImage;
  userData: UserData;
  ownerisLoading: boolean;
  userInfo: UserInfo;
  imageLoading: boolean;
  loanisLoading: boolean;
  isLoading: boolean;
  setUserInfo: React.Dispatch<React.SetStateAction<UserInfo>>;
  logoutUser: () => Promise<void>;
  fetchUserData: () => Promise<void>;
  fetchLoanData: () => Promise<void>;
}

// Context Creation
export const UserContext = createContext<UserContextType | undefined>(undefined);

// Provider Component
export function UserProvider({ children }: { children: ReactNode }) {
  const initialData: UserData = {
    id: null,
    email: null,
    name: null,
    companyName: null,
    phone: null,
    joinDate: null,
    location: null,
    filter: "all",
  };


const [userData, setUserData] = useState<UserData>(initialData);
const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [loanisLoading, setLoanIsLoading] = useState(true);
  const [loanData, setLoanData] = useState<Loan[]>([]);
  const [ProfileImage, setProfileImage] = useState<ProfileImage>({});
  const [userInfo, setUserInfo] = useState<UserInfo>({});
  const [ownerisLoading, setOwnerIsLoading] = useState(true);
  const [imageLoading, setImageLoading] = useState(false);
 

const fetchUserData = async () => {
  try {
    const token = await getToken();
   console.log("token---", typeof token, token);


    if (!token) {
      setUserData(initialData);
      return;
    }
const response = await fetch("https://finance.evoxcel.com/api/auth/session/mobile", {
  method: "POST",
  headers: { "Content-Type": "application/json"},
   body: JSON.stringify({email: token }),
});

    if (!response.ok) {
      console.log("Failed to fetch user data. Status:", response.status);
      setUserData(initialData);
      return;
    }

    const data = await response.json();
console.log("hiiihiihih----",data)
    if (data?.success && data?.userDetails) {
      setUserData({
        id: data.userDetails.id ?? null,
        email: data.userDetails.email ?? null,
        name: data.userDetails.name ?? null,
        companyName: data.userDetails.companyName ?? null,
        phone: data.userDetails.phone ?? null,
        joinDate: data.userDetails.joinDate ?? null,
        location: data.userDetails.location ?? null,
        filter: data.userDetails.filter ?? "all",
      });
    } else {
      setUserData(initialData);
    }
  } catch (error) {
    console.warn("Error fetching user data", error);
    setUserData(initialData);
  } finally {
    setIsLoading(false);
  }
};


 const fetchLoanData = async () => {
  try {
    if (!userData.id) {
      console.warn("User ID is null. Skipping loan data fetch.");
      return;
    }

    const response: any = await loadLoanData(userData.id);

    if (response?.success) {
      setLoanData(response.loans as any);
    }
  } catch (error) {
    console.error("Loan data error:", error);
  } finally {
    setLoanIsLoading(false);
  }
};


  const ownerDetails = async () => {
    try {
      const response: any = await userDetails(userData.id as any);
      if (response?.success) {
        setUserInfo(response.userInfo as any);
      }
    } catch (error) {
      console.error("Owner details error:", error);
    } finally {
      setOwnerIsLoading(false);
    }
  };

  const fetchProfileImage = async () => {
    setImageLoading(true);
    try {
      const response : any = await updateImage(userData.id);
      if (response?.success) {
        setProfileImage(response.latestImage);
      }
    } catch (error) {
      console.error("Profile image error:", error);
    } finally {
      setImageLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    if (userData.id) {
      fetchLoanData();
      fetchProfileImage();
      ownerDetails();
    }
  }, [userData]);

  const logoutUser = async () => {
    try {
      const response = await fetch("https://finance.evoxcel.com/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        console.log("user logout" ,response)
        setUserData(initialData);
        router.push("/(tabs)");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <UserContext.Provider
      value={{
        setLoanData,
        loanData,
        ProfileImage,
        userData,
        ownerisLoading,
        userInfo,
        imageLoading,
        loanisLoading,
        isLoading,
        setUserInfo,
        logoutUser,
        fetchUserData,
        fetchLoanData,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

// Custom Hook
export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
