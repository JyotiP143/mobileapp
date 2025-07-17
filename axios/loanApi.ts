import { Loan } from '../types/index'
import api from "./api"
export const addLoanDetails = async (loanInfo: any) => {
  try {
    const response = await api.post("/loan/sendUserLoan", loanInfo)
    return response.data
  } catch (error) {
    console.log("error:----", error)
  }
}

interface LoadLoanResponse {
  loans: Loan[];
}

export const loadLoanData = async (id: string): Promise<LoadLoanResponse> => {
  try {
    const response = await api.get<LoadLoanResponse>(`/loan/getLoanDetails/${id}`);
    return response.data; 
  } catch (error) {
    console.log("error:----", error);
    return { loans: [] }; // fallback if needed
  }
};

// export const loadLoanData = async (id: any) => {
//   try {
//     const response = await api.get(`/loan/getLoanDetails/${id}`)
//     return response.data
//   } catch (error) {
//     console.log("error:----", error)
//   }
// }

export const updateEmi = async (emiData: any) => {
  try {
    const response = await api.put("/loan/updateEmi", emiData)
    return response.data
  } catch (error) {
    console.log("error:----", error)
  }
}

export const skipedEmi = async (emiData: any) => {
  try {
    const response = await api.put("/loan/skipEmi", emiData)
    return response.data
  } catch (error) {
    console.log("error:----", error)
  }
}

export const updateUserLoan = async (loandata: any) => {
  try {
    const response = await api.put("/loan/sendUserLoan", loandata)
    return response.data
  } catch (error) {
    console.log("error:----", error)
  }
}

export const deleteLoans = async (loandata: any) => {
  try {
    const config = { data: { deleteIds: loandata } }
    const response = await api.delete("/loan/deleteLoan", config as any)
    return response.data
  } catch (error) {
    console.error("Error deleting loans:", error)
    throw error
  }
}


// import api from "./api";

// export const addLoanDetails = async (loanInfo : any) => {
//   try {
//     const response = await api.post("/loan/sendUserLoan", loanInfo);
//     return response.data;
//   } catch (error) {
//     console.log("error:----", error);
//   }
// };

// export const loadLoanData = async (id : any) => {
//   try {
//     const response = await api.get(`/loan/getLoanDetails/${id}`);
//     return response.data;
//   } catch (error) {
//     console.log("error:----", error);
//   }
// };

// export const updateEmi = async (emiData : any) => {
//   try {
//     const response = await api.put("/loan/updateEmi", emiData);
//     return response.data;
//   } catch (error) {
//     console.log("error:----", error);
//   }
// };
// export const skipedEmi = async (emiData : any) => {
//   try {
//     const response = await api.put("/loan/skipEmi", emiData);
//     return response.data;
//   } catch (error) {
//     console.log("error:----", error);
//   }
// };
// export const updateUserLoan = async (loandata : any) => {
//   try {
//     const response = await api.put("/loan/sendUserLoan", loandata);
//     return response.data;
//   } catch (error) {
//     console.log("error:----", error);
//   }
// };
// export const deleteLoans = async (loandata : any) => {
//   try {
//     const config = {data:{deleteIds: loandata}}
//     const response = await api.delete("/loan/deleteLoan", config as any);
//     return response.data;
//   } catch (error) {
//     console.error("Error deleting loans:", error);
//     throw error;
//   }
// };

