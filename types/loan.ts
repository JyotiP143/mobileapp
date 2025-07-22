export interface LoanFormData {
  name: string
  customerId: string
  loanId: string
  email: string
  phone: string
  loanAmount: string
  processingFee: string
  interest: string
  totalInstallment: string
  installmentAmount: string
  advancePayment: string
  approvalDate: Date
  repaymentStartDate: Date
  paymentMethod: string
  repaymentMethod: string
  owner: string
  emiHistory?: EMIHistoryItem[]
}

export interface EMIHistoryItem {
  date: Date | string
  amount: string
  transactionId: string
  paidDate: string | null
  paidStatus: string
}

export interface LoanCalculation {
  installmentAmount: number
  yearlyRate: number
  totalInterestAmount: number
}

export interface ExistingLoan {
  name: string
  custId: string
  phone: string
}

export interface ApiResponse {
  success: boolean
  data?: any
  message?: string
}

export interface AddLoanModalProps {
  onClose: () => void
  ownerid: string
}

export interface UserData {
  id: string | number
}

export interface InvestmentData {
  investments?: Array<{
    amount: string
  }>
}

export interface LoanData {
  name: string
  customerId: string
  loanId: string
  phone: string
}
