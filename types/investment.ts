import type React from "react"
export interface Investment {
  _id: string
  amount: string
  remark: string
  date: string
  status?: string
}

export interface InvestmentData {
  email: string
  investments: Investment[]
}

export interface FormData {
  amount: string
  remark: string
  date: string
}

export interface EditFormData extends FormData {
  wid: string
  email: string
}

export interface InvestmentContextType {
  investmentData: InvestmentData
  setInvestmentData: React.Dispatch<React.SetStateAction<InvestmentData>>
  loading: boolean
}

export interface ApiResponse {
  success: boolean
  message: string
  data?: any
}
