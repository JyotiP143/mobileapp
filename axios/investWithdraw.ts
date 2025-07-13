import api from "./api";

export const invest_Withdraw = async (formData : any) => {
  try {
    const response = await api.put("/userControll/investWithdrawn", formData);
    return response.data;
  } catch (error) {
    console.log("error--", error);
  }
};
export const deleteInvestment = async (data : any) => {
  try {
    const config = {data}
    const response = await api.delete("/userControll/deleteInvestWithdrawn",config as any);
    return response.data;
  } catch (error) {
    console.log("error--", error);
  }
};

export const get_invest_Withdraw = async (id : any) => {
  try {
    const response = await api.get(`/userControll/${id}`);
    return response.data;
  } catch (error) {
    console.log("error--", error);
  }
};
