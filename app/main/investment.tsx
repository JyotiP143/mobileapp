"use client";

import { deleteInvestment, invest_Withdraw } from "@/axios/investWithdraw";
import { useInvestment } from "@/context/InvestmentContext";
import type { EditFormData, FormData, Investment } from "@/types/investment";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type React from "react";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Modal,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

const { width, height } = Dimensions.get("window");

const InvestmentMobile = () => {
  const initialData = { amount: "", remark: "", date: "" };
  const editInitialData = {
    wid: "",
    amount: "",
    remark: "",
    date: "",
    email: "",
  };

  const [formData, setFormData] = useState(initialData);
  const [editFormData, setEditFormData] = useState(editInitialData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState("25");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const { setInvestmentData, investmentData, loading } = useInvestment();

  let investments = [];
  if (!loading && investmentData?.investments) {
    investments = investmentData.investments;
  }

  const filteredLoans = investments?.filter((loan: Investment) => {
    const matchesSearch = loan.remark
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all"
        ? true
        : (loan.status?.toLowerCase() || "active") ===
        statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  useEffect(() => {
    setTotalPages(
      Math.ceil(filteredLoans?.length / Number.parseInt(entriesPerPage))
    );
  }, [filteredLoans, entriesPerPage]);

  const getCurrentPageItems = (): Investment[] => {
    const startIndex = (currentPage - 1) * Number.parseInt(entriesPerPage);
    const endIndex = startIndex + Number.parseInt(entriesPerPage);
    return filteredLoans?.slice(startIndex, endIndex) || [];
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString("en-GB", { month: "short" });
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // const handleChange = (name: keyof FormData, value: string): void => {
  //   setFormData({ ...formData, [name]: value })
  // }
  const handleChange = (name: keyof FormData, value: string): void => {
    if (formData[name] !== value) {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };
  const handleSubmit = async () => {
   
    setIsSubmitting(true);
    if (!formData.amount || !formData.date) {
      setIsSubmitting(false);
      return;
    }
    const email = investmentData.email;
    const requestData = {
      email,
      investments: {
        ...formData, // Spread form data into the investment object
      },
    };
    try {
      const response = (await invest_Withdraw(requestData)) as any;
      if (response.success) {
        setIsSubmitting(false);
        setIsModalOpen(false);
        setInvestmentData((prevData: any) => {
          const updatedWithdrawals = [...prevData.investments, formData];
          return {
            ...prevData,
            investments: updatedWithdrawals,
          };
        });
      }
    } catch (error) {
      console.log("nejdeofiwoia")

     }
  };

  const downloadPDF = (): void => {
    const doc = new jsPDF();
    doc.text("Investment Records", 14, 10);
    const tableColumn = ["Date", "Amount", "Remarks"];
    const tableRows: string[][] = [];

    getCurrentPageItems().forEach((investment: Investment) => {
      const rowData = [
        formatDate(investment.date),
        `₹ ${investment.amount}`,
        investment.remark || "-",
      ];
      tableRows.push(rowData);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save("investment-records.pdf");
  };

  const editHandleChange = (name: keyof EditFormData, value: string): void => {
    setEditFormData({ ...editFormData, [name]: value });
  };

  const editHandleSubmit = async (): Promise<void> => {
    setIsSubmitting(true);
    if (!editFormData.amount || !editFormData.date) {
      Alert.alert("Error", "Please fill in all required fields");
      setIsSubmitting(false);
      return;
    }

    const email = investmentData.email;
    const requestData = {
      email,
      investments: { ...editFormData },
    };

    try {
      const response = (await invest_Withdraw(requestData)) as any;
      if (response.success) {
        setInvestmentData((prevData: any) => {
          const updatedInvestments = prevData.investments.some(
            (inv: Investment) => inv._id === editFormData.wid
          )
            ? prevData.investments.map((inv: Investment) =>
              inv._id === editFormData.wid
                ? { ...inv, ...editFormData, _id: editFormData.wid }
                : inv
            )
            : [
              ...prevData.investments,
              { ...editFormData, _id: editFormData.wid } as Investment,
            ];

          return {
            ...prevData,
            investments: updatedInvestments,
          };
        });

        setIsEditModalOpen(false);
        setIsSubmitting(false);
        Alert.alert("Success", "Investment updated successfully!");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to update investment");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSelectAll = (): void => {
    if (selectAll) {
      setSelectedRows([]);
    } else {
      setSelectedRows(investments.map((row: Investment) => row._id));
    }
    setSelectAll(!selectAll);
  };

  const handleRowSelect = (id: string): void => {
    let updatedSelection: string[] = [];
    if (selectedRows.includes(id)) {
      updatedSelection = selectedRows.filter((rowId: string) => rowId !== id);
    } else {
      updatedSelection = [...selectedRows, id];
    }
    setSelectedRows(updatedSelection);
    setSelectAll(updatedSelection.length === investments.length);
  };

  const handleDelete = async (): Promise<void> => {
    Alert.alert(
      "Confirm Delete",
      `Are you sure you want tso delete ${selectedRows.length} investment(s)?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            setIsDeleting(true);
            try {
              const response = (await deleteInvestment({
                ids: selectedRows,
                email: investmentData.email,
              })) as any;
              if (response.success) {
                console.log("response ", response)
                setInvestmentData((prevData: any) => ({
                  ...prevData,
                  investments: prevData.investments.filter(
                    (investment: Investment) =>
                      !selectedRows.includes(investment._id)
                  ),
                }));
                setSelectedRows([]);
                setSelectAll(false);
                Alert.alert("Success", response.message);
              } else {
                Alert.alert("Error", response.message);
              }
            } catch (error) {
              console.error("Delete investment error:", error);
              Alert.alert("Error", "Failed to delete investments");
            } finally {
              setIsDeleting(false);
            }
          },
        },
      ]
    );
  };

  const onRefresh = (): void => {
    setRefreshing(true);
    // Add your refresh logic here
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  const InvestmentCard: React.FC<{ investment: Investment; index: number }> = ({
    investment,
    index,
  }) => (
    <View style={styles.cardContainer}>
      <LinearGradient
        colors={["rgba(59, 130, 246, 0.1)", "rgba(147, 51, 234, 0.1)"]}
        style={styles.card}
      >
        <View style={styles.cardHeader}>
          <TouchableOpacity
            style={styles.checkbox}
            onPress={() => handleRowSelect(investment._id)}
          >
            <MaterialIcons
              name={
                selectedRows.includes(investment._id)
                  ? "check-box"
                  : "check-box-outline-blank"
              }
              size={24}
              color={
                selectedRows.includes(investment._id) ? "#3b82f6" : "#9ca3af"
              }
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => {
              setIsEditModalOpen(true);
              setEditFormData({
                ...editFormData,
                wid: investment._id,
                amount: investment.amount,
                remark: investment.remark,
                date: investment.date,
              });
            }}
          >
            <MaterialIcons name="edit" size={20} color="#3b82f6" />
          </TouchableOpacity>
        </View>

        <View style={styles.cardContent}>
          <View style={styles.cardRow}>
            <View style={styles.cardField}>
              <MaterialIcons name="event" size={20} color="#6366f1" />
              <Text style={styles.fieldLabel}>Date</Text>
            </View>
            <Text style={styles.fieldValue}>{formatDate(investment.date)}</Text>
          </View>

          <View style={styles.cardRow}>
            <View style={styles.cardField}>
              <MaterialIcons name="attach-money" size={20} color="#10b981" />
              <Text style={styles.fieldLabel}>Amount</Text>
            </View>
            <Text style={[styles.fieldValue, styles.amountText]}>
              ₹ {investment.amount}
            </Text>
          </View>

          <View style={styles.cardRow}>
            <View style={styles.cardField}>
              <MaterialIcons name="note" size={20} color="#f59e0b" />
              <Text style={styles.fieldLabel}>Remarks</Text>
            </View>
            <Text style={styles.fieldValue} numberOfLines={2}>
              {investment.remark || "No remarks"}
            </Text>
          </View>
        </View>
      </LinearGradient>
    </View>
  );

  const LoadingCard: React.FC = () => (
    <View style={styles.cardContainer}>
      <LinearGradient
        colors={["rgba(107, 114, 128, 0.1)", "rgba(75, 85, 99, 0.1)"]}
        style={styles.card}
      >
        <View style={styles.loadingContent}>
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </LinearGradient>
    </View>
  );

  const FilterModal: React.FC = () => (
    <Modal
      visible={showFilterModal}
      transparent
      animationType="slide"
      onRequestClose={() => setShowFilterModal(false)}
    >
      <View style={styles.modalOverlay}>
        <LinearGradient
          colors={["#1e293b", "#334155"]}
          style={styles.filterModalContent}
        >
          <Text style={styles.filterTitle}>Filter by Status</Text>
          {["all", "active", "completed"].map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterOption,
                statusFilter === filter && styles.filterOptionActive,
              ]}
              onPress={() => {
                setStatusFilter(filter);
                setShowFilterModal(false);
              }}
            >
              <Text
                style={[
                  styles.filterOptionText,
                  statusFilter === filter && styles.filterOptionTextActive,
                ]}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </Text>
              {statusFilter === filter && (
                <MaterialIcons name="check" size={20} color="#10b981" />
              )}
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={styles.filterCloseButton}
            onPress={() => setShowFilterModal(false)}
          >
            <Text style={styles.filterCloseText}>Close</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </Modal>
  );

  // const AddInvestmentModal: React.FC = () => (
  //   <Modal
  //     visible={isModalOpen}
  //     transparent
  //     animationType="slide"
  //     onRequestClose={() => setIsModalOpen(false)}
  //   >
  //     <View style={styles.modalOverlay}>
  //       <View style={styles.modalContent}>
  //         <View style={styles.modalHeader}>
  //           <Text style={styles.modalTitle}>Add Investment</Text>
  //           <TouchableOpacity onPress={() => setIsModalOpen(false)}>
  //             <MaterialIcons name="close" size={24} color="#6b7280" />
  //           </TouchableOpacity>
  //         </View>
  //         <KeyboardAvoidingView
  //           behavior={Platform.OS === "ios" ? "padding" : "height"}>
  //           {/* <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
  //         <View > */}
  //               <ScrollView contentContainerStyle={styles.modalForm} >
  //               <View style={styles.formGroup}>
  //                 <Text style={styles.formLabel}>
  //                   Amount<Text style={styles.required}>*</Text>
  //                 </Text>
  //                 <TextInput
  //                   style={styles.formInput}
  //                   placeholder="Enter the amount"
  //                   value={formData.amount}
  //                   onChangeText={(value) => handleChange("amount", value)}
  //                   keyboardType="numeric"
  //                 />
  //               </View>

  //               <View style={styles.formGroup}>
  //                 <Text style={styles.formLabel}>Remarks</Text>
  //                 <TextInput
  //                   style={[styles.formInput, styles.textArea]}
  //                   placeholder="Optional remarks"
  //                   value={formData.remark}
  //                   onChangeText={(value) => handleChange("remark", value)}
  //                   multiline
  //                   numberOfLines={3}
  //                 />
  //               </View>

  //               <View style={styles.formGroup}>
  //                 <Text style={styles.formLabel}>
  //                   Date <Text style={styles.required}>*</Text>
  //                 </Text>
  //                 <TextInput
  //                   style={styles.formInput}
  //                   placeholder="dd/mm/yyyy"
  //                   value={formData.date}
  //                   onChangeText={(value) => handleChange("date", value)}
  //                 />
  //               </View>
  //               <TouchableOpacity
  //                 style={[
  //                   styles.submitButton,
  //                   isSubmitting && styles.submitButtonDisabled,
  //                 ]}
  //                 onPress={handleSubmit}
  //                 disabled={isSubmitting}
  //               >
  //                 <Text style={styles.submitButtonText}>
  //                   {isSubmitting ? "Submitting..." : "Submit"}
  //                 </Text>
  //               </TouchableOpacity>
  //             </ScrollView>
  //         {/* </View>
  //           </TouchableWithoutFeedback> */}
  //         </KeyboardAvoidingView>
  //       </View>
  //     </View>
  //   </Modal>
  // );


  const AddInvestmentModal: React.FC = () => (
    <Modal
      visible={isModalOpen}
      transparent
      animationType="slide"
      onRequestClose={() => setIsModalOpen(false)} >
         {isModalOpen && (
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
        >
            <View style={styles.innerContainer}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Add Investment</Text>
                <TouchableOpacity onPress={() => setIsModalOpen(false)}>
                  <MaterialIcons name="close" size={24} color="#6b7280" />
                </TouchableOpacity>
              </View>

              <ScrollView
                contentContainerStyle={styles.modalForm}
                keyboardShouldPersistTaps="handled"
              >
                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>
                    Amount<Text style={styles.required}>*</Text>
                  </Text>
                  <TextInput
                    style={styles.formInput}
                    placeholder="Enter the amount"
                    value={formData.amount}
                    onChangeText={(value) => handleChange("amount", value)}
                    keyboardType="numeric"
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Remarks</Text>
                  <TextInput
                    style={[styles.formInput, styles.textArea]}
                    placeholder="Optional remarks"
                    value={formData.remark}
                    onChangeText={(value) => handleChange("remark", value)}
                    multiline
                    numberOfLines={3}
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>
                    Date <Text style={styles.required}>*</Text>
                  </Text>
                  <TextInput
                    style={styles.formInput}
                    placeholder="dd/mm/yyyy"
                    value={formData.date}
                    onChangeText={(value) => handleChange("date", value)}
                  />
                </View>

                <TouchableOpacity
                  style={[
                    styles.submitButton,
                    isSubmitting && styles.submitButtonDisabled,
                  ]}
                  onPress={handleSubmit}
                  disabled={isSubmitting}
                >
                  <Text style={styles.submitButtonText}>
                    {isSubmitting ? "Submitting..." : "Submit"}
                  </Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
        </KeyboardAvoidingView>
         )}
    </Modal>
  );

  const EditInvestmentModal: React.FC = () => (
    <Modal
      visible={isEditModalOpen}
      transparent
      animationType="slide"
      onRequestClose={() => setIsEditModalOpen(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Edit Investment</Text>
            <TouchableOpacity onPress={() => setIsEditModalOpen(false)}>
              <MaterialIcons name="close" size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalForm}>
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>
                Amount <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.formInput}
                placeholder="Enter the amount"
                value={editFormData.amount}
                onChangeText={(value) => editHandleChange("amount", value)}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Remarks</Text>
              <TextInput
                style={[styles.formInput, styles.textArea]}
                placeholder="Optional remarks"
                value={editFormData.remark}
                onChangeText={(value) => editHandleChange("remark", value)}
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>
                Date <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.formInput}
                placeholder="dd/mm/yyyy"
                value={editFormData.date}
                onChangeText={(value) => editHandleChange("date", value)}
              />
            </View>
          </ScrollView>
          <TouchableOpacity
            style={[
              styles.submitButton,
              isSubmitting && styles.submitButtonDisabled,
            ]}
            onPress={editHandleSubmit}
            disabled={isSubmitting}
          >
            <Text style={styles.submitButtonText}>
              {isSubmitting ? "Updating..." : "Update"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <LinearGradient colors={["#0f172a", "#1e293b"]} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <LinearGradient
            colors={["#3b82f6", "#1d4ed8"]}
            style={styles.headerIcon}
          >
            <MaterialIcons name="trending-up" size={24} color="#ffffff" />
          </LinearGradient>
          <Text style={styles.headerTitle}>Investment</Text>
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setIsModalOpen(true)}
        >
          <MaterialIcons name="add" size={20} color="#ffffff" />
        </TouchableOpacity>
      </View>

      {/* Search and Filters */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <MaterialIcons name="search" size={20} color="#9ca3af" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search investments..."
            placeholderTextColor="#9ca3af"
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
        </View>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilterModal(true)}
        >
          <MaterialIcons name="filter-list" size={20} color="#ffffff" />
        </TouchableOpacity>
      </View>

      {/* Action Bar */}
      <View style={styles.actionBar}>
        <View style={styles.actionLeft}>
          <TouchableOpacity
            style={styles.selectAllButton}
            onPress={handleSelectAll}
          >
            <MaterialIcons
              name={selectAll ? "check-box" : "check-box-outline-blank"}
              size={20}
              color="#3b82f6"
            />
            <Text style={styles.selectAllText}>Select All</Text>
          </TouchableOpacity>
          {selectedRows.length > 0 && (
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={handleDelete}
            >
              <MaterialIcons name="delete" size={20} color="#ef4444" />
              <Text style={styles.deleteButtonText}>
                Delete ({selectedRows.length})
              </Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.actionRight}>
          <Text style={styles.totalText}>
            Total: {filteredLoans?.length || 0}
          </Text>
          <TouchableOpacity style={styles.exportButton} onPress={downloadPDF}>
            <MaterialIcons name="download" size={16} color="#3b82f6" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Investment List */}
      <ScrollView
        style={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {loading
          ? Array.from({ length: 3 }).map((_, index) => (
            <LoadingCard key={index} />
          ))
          : getCurrentPageItems().map((investment, index) => (
            <InvestmentCard
              key={investment._id}
              investment={investment}
              index={index}
            />
          ))}

        {!loading && filteredLoans?.length === 0 && (
          <View style={styles.emptyState}>
            <MaterialIcons name="inbox" size={64} color="#6b7280" />
            <Text style={styles.emptyStateText}>No investments found</Text>
            <Text style={styles.emptyStateSubtext}>
              Add your first investment to get started
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Pagination */}
      {totalPages > 1 && (
        <View style={styles.paginationContainer}>
          <TouchableOpacity
            style={[
              styles.paginationButton,
              currentPage === 1 && styles.paginationButtonDisabled,
            ]}
            onPress={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <MaterialIcons name="chevron-left" size={20} color="#ffffff" />
          </TouchableOpacity>

          <Text style={styles.paginationText}>
            {currentPage} of {totalPages}
          </Text>

          <TouchableOpacity
            style={[
              styles.paginationButton,
              currentPage === totalPages && styles.paginationButtonDisabled,
            ]}
            onPress={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            <MaterialIcons name="chevron-right" size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>
      )}

      {/* Modals */}
      <AddInvestmentModal />
      <EditInvestmentModal />
      <FilterModal />

      {/* Loading Overlay */}
      {isDeleting && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text style={styles.loadingOverlayText}>Deleting...</Text>
        </View>
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#ffffff",
  },
  addButton: {
    backgroundColor: "#3b82f6",
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  searchContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 12,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(55, 65, 81, 0.8)",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    color: "#ffffff",
    fontSize: 16,
  },
  filterButton: {
    backgroundColor: "rgba(99, 102, 241, 0.8)",
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  actionBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  actionLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  selectAllButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  selectAllText: {
    color: "#3b82f6",
    fontSize: 14,
    fontWeight: "500",
  },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(239, 68, 68, 0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  deleteButtonText: {
    color: "#ef4444",
    fontSize: 14,
    fontWeight: "500",
  },
  actionRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  totalText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "500",
  },
  exportButton: {
    backgroundColor: "rgba(59, 130, 246, 0.2)",
    width: 32,
    height: 32,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  cardContainer: {
    marginBottom: 16,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  checkbox: {
    padding: 4,
  },
  editButton: {
    backgroundColor: "rgba(59, 130, 246, 0.2)",
    width: 32,
    height: 32,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  cardContent: {
    gap: 12,
  },
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardField: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  fieldLabel: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 14,
    fontWeight: "500",
  },
  fieldValue: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "right",
    flex: 1,
  },
  amountText: {
    color: "#10b981",
    fontSize: 16,
    fontWeight: "700",
  },
  loadingContent: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 32,
    gap: 12,
  },
  loadingText: {
    color: "#9ca3af",
    fontSize: 14,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 64,
    gap: 16,
  },
  emptyStateText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "600",
  },
  emptyStateSubtext: {
    color: "#9ca3af",
    fontSize: 14,
    textAlign: "center",
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
    gap: 20,
  },
  paginationButton: {
    backgroundColor: "rgba(59, 130, 246, 0.8)",
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  paginationButtonDisabled: {
    backgroundColor: "rgba(107, 114, 128, 0.5)",
  },
  paginationText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "500",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    
    width: width * 0.9,
    maxHeight: height * 0.8,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1f2937",
  },
  modalForm: {
    padding: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 8,
  },
  required: {
    color: "#ef4444",
  },
  formInput: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: "#1f2937",
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  submitButton: {
    backgroundColor: "#3b82f6",
    margin: 20,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  submitButtonDisabled: {
    backgroundColor: "#9ca3af",
  },
  submitButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  filterModalContent: {
    borderRadius: 16,
    padding: 24,
    width: width * 0.8,
    maxWidth: 300,
  },
  filterTitle: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 20,
    textAlign: "center",
  },
  filterOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
  filterOptionActive: {
    backgroundColor: "rgba(16, 185, 129, 0.2)",
    borderWidth: 1,
    borderColor: "#10b981",
  },
  filterOptionText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "500",
  },
  filterOptionTextActive: {
    color: "#10b981",
  },
  filterCloseButton: {
    backgroundColor: "#6366f1",
    borderRadius: 8,
    paddingVertical: 12,
    marginTop: 16,
  },
  filterCloseText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  loadingOverlayText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "500",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)', // dark backdrop
    justifyContent: 'flex-end',         // align modal to bottom
  },

  innerContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },

});

export default InvestmentMobile;

