// utils/authToken.ts
import AsyncStorage from "@react-native-async-storage/async-storage";

export const storeToken = async (token: string) => {
  try {
    await AsyncStorage.setItem("authToken", token);
    console.log("Token stored successfully");
  } catch (error) {
    console.error("Failed to store token", error);
  }
};

export const getToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem("authToken");
  } catch (error) {
    console.error("Failed to get token", error);
    return null;
  }
};

export const removeToken = async () => {
  try {
    await AsyncStorage.removeItem("authToken");
  } catch (error) {
    console.error("Failed to remove token", error);
  }
};
