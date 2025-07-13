import api from "./api";

export const updateProfile = async (data: any) => {
    try {
        const response = await api.put("/userControll/profileUpdate/", data);
        return response.data;
    } catch (error) {
        console.log("error--", error)
    }
}
export const updateImage = async (id : any) => {
    try {
        const response = await api.get(`/loan/getImage/${id}`);
        return response.data;
    } catch (error) {
        console.log("error--", error)
    }
}
export const userDetails = async (id : any) => {
    try {
        const response = await api.get(`/userControll/getOwner/${id}`);
        return response.data;
    } catch (error) {
        console.log("error--", error)
    }
}