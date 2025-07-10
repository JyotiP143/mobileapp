export interface Investment {
  id: string;
  date: string;
  amount: number;
  remarks: string;
}

export interface Loan {
  id: string;
  name: string;
  customerId: string;
  loanId: string;
  loanAmount: number;
  installments: number;
  nextPayment: string;
  status: 'Active' | 'Inactive';
  phone?: string;
}

export interface Member {
  id: string;
  name: string;
  joiningDate: string;
  totalLoanAmount: number;
  paidTotal: number;
  membershipDuration: string;
  status: 'Active' | 'Inactive';
}

export interface Withdrawal {
  id: string;
  date: string;
  amount: number;
  remarks: string;
}