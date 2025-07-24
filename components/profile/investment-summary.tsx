"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useInvestment } from "@/context/InvestmentContext";
import type { Investment } from "@/types/investment"; // Import InvestmentItem
import type { LoanDetail, UserInfo } from "@/types/user"; // Import LoanDetail and UserInfo
import { Calendar, IndianRupee, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { Bar, BarChart, ResponsiveContainer } from "recharts";

// Define props interface for InvestmentSummary


const data = [
  { name: "Jan", value: 400 },
  { name: "Feb", value: 300 },
  { name: "Mar", value: 500 },
  { name: "Apr", value: 280 },
  { name: "May", value: 590 },
  { name: "Jun", value: 430 },
]

export function InvestmentSummary({
  loanData,
  userData,
}: {
  loanData: LoanDetail[] | null
  userData: UserInfo | null
}): JSX.Element {
  const { investmentData } = useInvestment()
  const [totalInvest, setTotalInvest] = useState<number>(0)
  const [totalInterest, setTotalInterest] = useState<number>(0)
  const [joinedYear, setJoinedYear] = useState<number | string>("") // Can be number or string
  const [totalYear, setTotalYear] = useState<number | string>("") // Can be number or string

  useEffect(() => {
    // Calculate total investment from investmentData
    const total =
      investmentData?.investments?.reduce((sum: number, item: Investment) => sum + Number(item.amount), 0) || 0
    setTotalInvest(total)

    // Calculate total interest from loanData
    const calculatedTotalInterest =
      loanData?.reduce((total: number, item: LoanDetail) => {
        const loanAmount = Number.parseInt(item.loanAmount, 10)
        const totalInstallment = Number.parseInt(item.totalInstallment, 10)
        const repaymentMethod = item.repaymentMethod
        const loanInterest = Number.parseInt(item.interest, 10) / 100
        let totalWithInterest = 0

        if (repaymentMethod === "daily") {
          totalWithInterest = loanAmount + loanAmount * loanInterest * totalInstallment
        } else if (repaymentMethod === "weekly") {
          totalWithInterest = loanAmount + loanAmount * loanInterest * totalInstallment
        } else if (repaymentMethod === "monthly") {
          totalWithInterest = loanAmount + loanAmount * loanInterest * totalInstallment
        } else {
          // Fallback or error handling for invalid repayment method
          console.warn("Invalid repayment method:", repaymentMethod)
          return total // Skip this item or handle as an error
        }
        const interestForLoan = totalWithInterest - loanAmount
        return total + interestForLoan
      }, 0) || 0
    setTotalInterest(Number.parseFloat(calculatedTotalInterest.toFixed(2)))

    // Calculate joined year and active duration
    if (userData?.joinDate) {
      const yearSince = new Date(userData.joinDate)
      setJoinedYear(yearSince.getUTCFullYear())

      const now = new Date()
      const yearsDifference = now.getUTCFullYear() - yearSince.getUTCFullYear()
      const monthsDifference = now.getMonth() - yearSince.getMonth()
      const isCompleteYear =
        monthsDifference < 0 || (monthsDifference === 0 && now.getDate() < yearSince.getDate())
          ? yearsDifference - 1
          : yearsDifference
      setTotalYear(isCompleteYear)
    } else {
      setJoinedYear("--")
      setTotalYear("--")
    }
  }, [loanData, investmentData, userData]) // Added userData to dependencies

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="text-white bg-gray-800">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Investment</CardTitle>
          <IndianRupee className="h-4 w-4 text-[#8e88ff]" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">₹ {totalInvest}</div>
          <p className="text-xs text-muted-foreground mt-1">Across 3 schemes</p>
          <div className="h-[60px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <Bar dataKey="value" fill="#8884d8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      <Card className="text-white bg-gray-800">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Returns Earned</CardTitle>
          <TrendingUp className="h-4 w-4 text-[#4be787]" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">₹ {totalInterest}</div>
          <p className="text-xs text-muted-foreground mt-1">+12.5% return rate</p>
          <div className="h-[60px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <Bar dataKey="value" fill="#82ca9d" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      <Card className="text-white bg-gray-800">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Active Duration</CardTitle>
          <Calendar className="h-4 w-4 text-gray-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalYear} Years</div>
          <p className="text-xs text-gray-200 mt-1">Member since {joinedYear}</p>
          <div className="mt-4 flex items-end space-x-1">
            {[1, 2, 3, 4, 5, 6].map((month) => (
              <div key={month} className="bg-gray-300 rounded-sm w-1/6" style={{ height: `${month * 10}px` }}></div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
