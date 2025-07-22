"use client";

import { format } from "date-fns";
import { Calendar, X } from "lucide-react";
import { useState } from "react";
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";
import { Bounce, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

import { addLoanDetails } from "@/axios/loanApi";
import { useInvestment } from "@/context/InvestmentContext";
import { useUser } from "@/context/UserContext";

const AddLoanModal =({ onClose, ownerid }:any) => {
  const { setLoanData, userData, loanData } = useUser();
  const { investmentData } = useInvestment();
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const totalInvestAmount = investmentData?.investments?.length
    ? investmentData.investments.reduce(({total, invest}:any) => total + parseInt(invest.amount, 10), 0)
    : 0;

  let loanName = loanData.map((item) => {
    return {
      name: item.name,
      custId: item.customerId,
      phone: item.phone,
    };
  });

  let loanCustId = loanData.map((item) => item.customerId);
  let loanIds = loanData.map((item) => item.loanId);

  let nextCustomerId = loanCustId.length > 0
    ? Math.max(...loanCustId.map(id => parseInt(id.replace('CUST-', '')))) + 1
    : 1001;

  let nextLoanId = loanIds.length > 0
    ? Math.max(...loanIds.map(id => parseInt(id.replace('LN-', '')))) + 1
    : 1001;

  const userIdString = String(userData.id);
  let intialData = {
    name: "", customerId: `CUST-${nextCustomerId}`, loanId: `LN-${nextLoanId}`, email: "", phone: "", loanAmount: "", processingFee: "",
    interest: "", totalInstallment: "", installmentAmount: "0", advancePayment: "0", approvalDate: new Date(),
    repaymentStartDate: new Date(), paymentMethod: "", repaymentMethod: "monthly", owner: userIdString,
  };
  const [formData, setFormData] = useState(intialData);
  const calculateInstallmentAmount = () => {
    const amount = parseFloat(formData.loanAmount) || 0;
    const installments = parseInt(formData.totalInstallment) || 1;
    const advance = parseFloat(formData.advancePayment) || 0;
    const interest = parseFloat(formData.interest) || 0;
    const method = formData.repaymentMethod;

    const principalAfterAdvance = Math.max(0, amount - advance);
    let yearlyRate = 0;
    let interestMultiplier = 1;
    switch (method.toLowerCase()) {
      case "daily":
        yearlyRate = interest * 365;
        interestMultiplier = installments / 365;
        break;
      case "weekly":
        yearlyRate = interest * 52;
        interestMultiplier = installments / 52;
        break;
      case "monthly":
        yearlyRate = interest * 12;
        interestMultiplier = installments / 12;
        break;
      default:
        yearlyRate = interest;
        interestMultiplier = installments / 1;
        break;
    }
    const totalInterestAmount = (amount * yearlyRate / 100) * interestMultiplier;
    const totalWithInterest = principalAfterAdvance;
    const installmentAmount = totalWithInterest / installments;
    return {
      installmentAmount: parseFloat(installmentAmount.toFixed(2)),
      yearlyRate: parseFloat(yearlyRate.toFixed(2)),
      totalInterestAmount: parseFloat(totalInterestAmount.toFixed(2)),
    };
  };

  const generateEmiHistory = ({startDate, repaymentMethod, totalInstallments, advancePayment}:any) => {
    const emiHistory = [];
    const { installmentAmount } = calculateInstallmentAmount();
    if (advancePayment > 0) {
      emiHistory.push({
        date: new Date(),
        amount: advancePayment.toFixed(2),
        transactionId: "AdvPay",
        paidDate: new Date(startDate).toISOString().split("T")[0],
        paidStatus: "Paid",
      });
    }

    let currentDate = new Date(startDate);

    for (let i = 1; i <= totalInstallments; i++) {

      emiHistory.push({
        date: currentDate.toLocaleDateString("en-CA"),
        amount: installmentAmount.toFixed(2),
        transactionId: `TXN${i.toString().padStart(5, "0")}`,
        paidDate: null,
        paidStatus: "Due",
      });
      switch (repaymentMethod) {
        case "daily":
          currentDate.setDate(currentDate.getDate() + 1);
          break;
        case "weekly":
          currentDate.setDate(currentDate.getDate() + 7);
          break;
        case "monthly":
          currentDate.setMonth(currentDate.getMonth() + 1);
          break;
      }
    }

    return emiHistory;
  };
  const handleSelectName = ({name, id, phone}:any) => {

    handleInputChange("name", name);
    handleInputChange("customerId", id);
    handleInputChange("phone", phone);
    setShowDropdown(false);
  };
  const { installmentAmount, yearlyRate, totalInterestAmount } = calculateInstallmentAmount();
  const handleInputChange = ({field, value}:any) => {
    setFormData((prev) => {
      const newData = { ...prev, [field]: value };
      calculateInstallmentAmount();
      const { installmentAmount } = calculateInstallmentAmount();
      const emiHistory = newData.repaymentStartDate && newData.repaymentMethod && newData.totalInstallment
        ? generateEmiHistory(
          new Date(newData.repaymentStartDate), newData.repaymentMethod, parseInt(newData.totalInstallment),
          parseFloat(newData.advancePayment) || 0) : [];
      return {
        ...newData,
        installmentAmount,
        emiHistory,
      };
    });
  };

  const handleSubmit = async () => {
    const requiredFields = [
      "name",
      "customerId",
      "loanId",
      "phone",
      "loanAmount",
      "processingFee",
      "interest",
      "totalInstallment",
      "installmentAmount",
      "advancePayment",
      "approvalDate",
      "repaymentStartDate",
      "paymentMethod",
      "repaymentMethod",
    ];

    const missingFields = requiredFields.filter(field => !formData[field]);

    if (missingFields.length > 0) {
      toast.error(`Please fill all required fields: ${missingFields.join(", ")}`, {
        position: "top-center",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
      setIsSubmitting(false);
      return;
    }
    setFormData((prevData) => ({
      ...prevData,
      owner: ownerid,
    }));
    setIsSubmitting(true);
    try {
      if (totalInvestAmount < formData.loanAmount) {
        toast.error("Investment amount is less than the loan amount...", {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
      }
      else {
        const response = await addLoanDetails(formData);
        if (response.success) {
          setLoanData((prevLoans) =>
            Array.isArray(prevLoans)
              ? [...prevLoans, response.data]
              : [response.data]
          );
          setFormData(intialData);
          toast.success("loan added SuccessFully!!..", {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Bounce,
          });
          onClose();
        } else {
          toast.error("Failed to submit loan data", {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Bounce,
          });
        }
      }
    } catch (error) {
      console.error("Error submitting loan data:", error);
      toast.error("An unexpected error occurred", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    }
    finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed top-0 left-0 h-screen w-screen flex items-center justify-center bg-gray-900 bg-opacity-50 z-30"
    >
      <div className="max-w-2xl h-[96%] bg-white  rounded-lg pb-2">
        <div className=" p-4 rounded-t-lg flex items-center justify-between" >
          <div className="text-xl font-bold text-blue-800">
            Add Loan Details
          </div>
          <div className=" bg-black rounded cursor-pointer" onClick={onClose}>
            <X className="text-white font-bold" />
          </div>
        </div>
        <div className="scroll_Bar p-4 rounded-lg overflow-y-auto h-[89%] ">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 relative">
              <Label htmlFor="name">Name<span className="text-red-600">*</span></Label>
              <Input id="name" placeholder="Select or Enter Name"
                value={formData.name} onClick={() => setShowDropdown(true)}
                onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
                onChange={(e:any) => {
                  handleInputChange("name", e.target.value);
                  setShowDropdown(false)
                }}
                autoComplete="off"
                className="capitalize w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
              />

              {showDropdown && (
                <div
                  className="absolute left-0 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-y-auto z-10"
                  onMouseDown={(e) => e.preventDefault()}
                >
                  {loanName
                    .filter((item, index, self) =>
                      index === self.findIndex(t => t.custId === item.custId)
                    )
                    .map((item, index) => (
                      <div
                        key={index}
                        onClick={() => handleSelectName(item.name, item.custId, item.phone)}
                        className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                      >
                        {item.name}
                      </div>
                    ))}

                </div>
              )}


            </div>
            <div className="space-y-2">
              <Label htmlFor="customerId">Customer ID<span className="text-red-600">*</span></Label>
              <Input
                id="customerId"
                value={formData.customerId}
                placeholder="CUST-1001"
                readOnly

              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="loanId">Loan ID<span className="text-red-600">*</span></Label>
              <Input
                id="loanId"
                placeholder="LN-85954"
                value={formData.loanId}
                readOnly
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter the Email"
                value={formData.email}
                className="lowercase"
                onChange={(e) => handleInputChange("email", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone<span className="text-red-600">*</span></Label>
              <Input
                id="phone"
                placeholder="Enter Phone Number"
                value={formData.phone}
                min="10"
                max="10"
                onChange={(e) => handleInputChange("phone", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="loanAmount">Loan Amount<span className="text-red-600">*</span></Label>
              <Input
                id="loanAmount"
                type="number"
                placeholder="Enter Loan Amount"
                value={formData.loanAmount}
                min="1"
                onChange={(e) =>
                  handleInputChange("loanAmount", e.target.value)
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="processingFee">
                Processing Fee (In Amount)<span className="text-red-600">*</span>
              </Label>
              <Input
                id="processingFee"
                type="number"
                placeholder="Enter Processing Fee"
                value={formData.processingFee}
                onChange={(e) =>
                  handleInputChange("processingFee", e.target.value)
                }
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="interest">Interest (%)<span className="text-red-600">*</span></Label>
                <Label htmlFor="interest">Interest Amount</Label>
              </div>
              <div className="flex items-center">
                <Input
                  id="interest" type="number" placeholder="Enter Interest Rate" value={formData.interest}
                  onChange={(e) => {
                    handleInputChange("interest", e.target.value)
                    calculateInstallmentAmount();
                  }
                  }
                />
                <div className="border border-gray-300 bg-gray-100 ml-2 w-2/3 h-full p-1.5 rounded">{totalInterestAmount}</div>
              </div>
              <div className="text-[0.7em] text-gray-500  mt-2">
                Yearly Interest: {formData.interest} x{" "}
                {formData.repaymentMethod === "monthly"
                  ? "12"
                  : formData.repaymentMethod === "weekly"
                    ? "52"
                    : "365"}{" "}
                = {yearlyRate}%
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="repaymentMethod">Repayment Method<span className="text-red-600">*</span></Label>
              <Select
                value={formData.repaymentMethod}
                onValueChange={(value) => {
                  handleInputChange("repaymentMethod", value)
                  calculateInstallmentAmount();
                }
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select repayment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="totalInstallment">Total Installment<span className="text-red-600">*</span></Label>
              <Input
                id="totalInstallment"
                type="number"
                placeholder="Enter Total Installment"
                value={formData.totalInstallment}
                onChange={(e) => {
                  handleInputChange("totalInstallment", e.target.value);
                  calculateInstallmentAmount();
                }
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="advancePayment">Advance Payment</Label>
              <Input
                id="advancePayment"
                type="number"
                placeholder="Enter Advance Payment"
                value={formData.advancePayment}
                onChange={(e) => {
                  handleInputChange("advancePayment", e.target.value);
                  calculateInstallmentAmount();
                }
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="installmentAmount">Installment Amount<span className="text-red-600">*</span></Label>
              <Input
                id="installmentAmount"
                type="number"
                value={installmentAmount}
                readOnly
                className="bg-gray-50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="approvalDate">Loan Approval Date <span className="text-red-600">*</span></Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {formData.approvalDate ? (
                      format(formData.approvalDate, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={formData.approvalDate}
                    onSelect={(date:any) =>
                      handleInputChange("approvalDate", date || new Date())
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label htmlFor="repaymentStartDate">Repayment Start Date<span className="text-red-600">*</span></Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {formData.repaymentStartDate ? (
                      format(formData.repaymentStartDate, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={formData.repaymentStartDate}
                    onSelect={(date :any) =>
                      handleInputChange(
                        "repaymentStartDate",
                        date || new Date()
                      )
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label htmlFor="paymentMethod">Payment Method<span className="text-red-600">*</span></Label>
              <Select
                value={formData.paymentMethod}
                onValueChange={(value :any) =>
                  handleInputChange("paymentMethod", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cash">Cash</SelectItem>
                  <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                  <SelectItem value="Upi Transfer">UPI Transfer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button
              type="submit"
              className="bg-green-600 text-white hover:bg-green-700"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting" : "Submit"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default AddLoanModal;
