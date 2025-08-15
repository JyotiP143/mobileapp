import api from "./api";

export const invest_Withdraw = async (formData : any) => {
  try {
    const response = await api.put("/userControll/investWithdrawn", formData);
    console.log("responce ..." ,response);
    return response.data;
  } catch (error) {
    console.log("error--", error);
    throw error; // 👈 Add this line
  }
};
// export const deleteInvestment = async (data :any ) => {
//   try {
  
//     const response = await api.delete("/userControll/deleteInvestWithdrawn");
//     return response.data;
//   } catch (error:any) {
//        console.error("API deleteInvestment error:", error.response?.data || error);
//     return { success: false, message: error.response?.data?.message || "Request failed" };

//   }
// };

export const deleteInvestment = async (data: any) => {
  try {
    const response = await api.delete(
      "/userControll/deleteInvestWithdrawn",
      { data } as any // 👈 bypass TS check
    );
    return response.data;
  } catch (error: any) {
    console.error("API deleteInvestment error:", error.response?.data || error);
    return {
      success: false,
      message: error.response?.data?.message || "Request failed",
    };
  }
};


export const get_invest_Withdraw = async (id : number) => {
  try {
    const response = await api.get(`/userControll/${id}`);
    return response.data;
  } catch (error) {
    console.log("error--", error);
  }
};
