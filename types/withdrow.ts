export interface Withdrawal {
  _id: string
  amount: string
  remark: string
  date: string
  status?: string
}

export interface Investment {
  _id: string
  amount: string
  remark: string
  date: string
}

export interface LoanData {
  _id: string;
  loanAmount: string;
  processingFee: string;
  totalInstallment: string;
  repaymentMethod: string;
  interest: string;
  emiHistory: EMIHistory[];
}


export interface EMIHistory {
  amount: string
  paidStatus: string
  penaltyAmount: string
  date: string
  paidDate?: string
}

export interface InvestmentData {
  email: string
  withdrawals: Withdrawal[]
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

export interface ApiResponse {
  success: boolean
  message: string
  data?: any
}
