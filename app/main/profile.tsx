"use client"

import { InvestmentSummary } from "@/components/profile/investment-summary"
import { ProfileHeader } from "@/components/profile/profile-header"
import { useUser } from "@/context/UserContext"
import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"

export default function ProfilePage(): JSX.Element {
  const { loanData, isLoading, userInfo } = useUser()

  return (
    <main className="flex-1 p-6">
      {isLoading ? (
        <div className="profile-skeleton">
          <div className="relative">
            <div className="bg-gradient-to-r from-blue-400 to-purple-500 h-48 sm:h-56"></div>
            <div className="mx-auto px-4 sm:px-6 lg:px-8">
              <div className="relative -mt-12 sm:-mt-16 sm:flex sm:items-end sm:space-x-5">
                {/* Skeleton for Profile Avatar */}
                <div className="flex">
                  <div className="h-24 w-24 sm:h-32 sm:w-32 rounded-full ring-4 ring-white bg-gray-300 animate-pulse"></div>
                </div>
                <div className="mt-6 sm:flex-1 sm:min-w-0 sm:flex sm:items-center sm:justify-end sm:space-x-6 sm:pb-1">
                  <div className="sm:hidden md:block mt-6 min-w-0 flex-1">
                    {/* Skeleton for Name */}
                    <div className="h-6 w-40 bg-gray-300 animate-pulse rounded"></div>
                  </div>
                  {/* Skeleton for Buttons */}
                  <div className="mt-6 flex flex-col justify-stretch space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4">
                    <div className="h-10 w-32 bg-gray-300 animate-pulse rounded"></div>
                    <div className="h-10 w-32 bg-gray-300 animate-pulse rounded"></div>
                  </div>
                </div>
              </div>
              <div className="hidden sm:block md:hidden mt-6 min-w-0 flex-1">
                <div className="h-6 w-40 bg-gray-300 animate-pulse rounded"></div>
              </div>
            </div>
            <div className="mt-6 sm:mt-8 px-4 sm:px-6 lg:px-8">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2 md:grid-cols-3">
                {/* Skeleton for Contact Info */}
                {[...Array(5)].map((_, index: number) => (
                  <div key={index} className="flex items-center text-sm">
                    <div className="h-5 w-5 bg-gray-300 animate-pulse rounded-full mr-2"></div>
                    <div className="h-5 w-24 bg-gray-300 animate-pulse rounded"></div>
                  </div>
                ))}
              </dl>
            </div>
          </div>
          {/* Cards */}
          <div className="mt-8 flex gap-5">
            <div className="flex-1">
              <Skeleton className="h-52 bg-gray-200 rounded-md" />
            </div>
            <div className="flex-1">
              <Skeleton className="h-52 bg-gray-200 rounded-md" />
            </div>
            <div className="flex-1">
              <Skeleton className="h-52 bg-gray-200 rounded-md" />
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          <ProfileHeader userData={userInfo} />
          <InvestmentSummary loanData={loanData} userData={userInfo} />
        </div>
      )}
    </main>
  )
}
