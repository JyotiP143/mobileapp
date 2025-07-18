export interface Member {
  customerId: string
  name: string
  totalLoanAmount: number
  totalPaidAmount: number
  oldestApprovalDate: string
  duration: string
  status: "Active" | "Inactive" | "Pending"
  isNew?: boolean
}

export interface LoanData {
  customerId: string
  name: string
  loanAmount: string
  approvalDate: string
  emiHistory: EMIHistory[]
}

export interface EMIHistory {
  amount: string
  paidStatus: string
  date: string
}

export interface MemberStats {
  totalMembers: number
  activeMembers: number
  inactiveMembers: number
  totalLoanAmount: number
  totalPaidAmount: number
}
