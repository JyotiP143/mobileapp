import api from "./api";

// Interfaces for request payloads
interface UserCredentials {
  email: string;
  password: string;
  [key: string]: any; // Include other optional fields like name, companyName, etc.
}

interface AuthResponse {
  success: boolean;
  token?: string;
  user?: {
    id: string;
    email: string;
    name?: string;
    companyName?: string;
    [key: string]: any;
  };
  message?: string;
}

// Add new owner (sign up)
export const addOwners = async (
  userData: UserCredentials
): Promise<AuthResponse | undefined> => {
  try {
    const response = await api.post<AuthResponse>("/auth/signup", userData);
    return response.data;
  } catch (error) {
    console.error("Error during signup:", error);
  }
};

// Verify owner (login)
export const verifyOwner = async (
  userData: UserCredentials
): Promise<AuthResponse | undefined> => {
  try {
    const response = await api.post<AuthResponse>("/auth/login", userData);
    return response.data;
  } catch (error) {
    console.error("Error during login:", error);
  }
};

// Optional: Get session user (if needed)
/*
export const sessionUser = async (): Promise<AuthResponse | undefined> => {
  try {
    const response = await api.get<AuthResponse>("/auth/session");
    return response.data;
  } catch (error) {
    console.error("Error fetching session:", error);
  }
};
*/
