"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useUser } from "./UserContext";
const InvestmentContext = createContext<any>(undefined);

export const InvestmentProvider = ({ children} :any) => {
  const { userData } = useUser();
  const [investmentData, setInvestmentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userData.id) return;

    const fetchInvestmentData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`https://finance.evoxcel.com/api/userControll/${userData.id}`, {
          method: "GET",
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.message || "Failed to fetch investment data"
          );
        }

        const data = await response.json();
        setInvestmentData(data);
      } catch (err) {
        setError(err as any);
      } finally {
        setLoading(false);
      }
    };

    fetchInvestmentData();
  }, [userData.id]);

  return (
    <InvestmentContext.Provider
      value={{ investmentData, loading, error, setInvestmentData }}
    >
      {children}
    </InvestmentContext.Provider>
  );
};

export const useInvestment = () => {
  const context = useContext(InvestmentContext);

  if (!context) {
    throw new Error("useInvestment must be used within an InvestmentProvider");
  }

  return context;
};
