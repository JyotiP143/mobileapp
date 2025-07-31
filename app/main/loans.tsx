import { updateProfile } from "@/axios/profile";
import AddLoanModal from '@/components/model/loan-model';
import { useUser } from "@/context/UserContext";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
const { width } = Dimensions.get("window");

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const CardView = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const { userInfo, setUserInfo, loanData, isLoading } = useUser();
  const ownerid = ""
  const loansPerPage = 6;

  useEffect(() => {
    setStatusFilter(userInfo.filter);
    console.log("user--", loanData);
  }, [userInfo]);

  const handleSearch = (text: string) => {
    setSearchTerm(text);
    setCurrentPage(1);
  };

  const handlePaymentFilter = async (value: any) => {
    setStatusFilter(value);
    setUserInfo({ ...userInfo, filter: value });
    setShowFilterModal(false);
    try {
      await updateProfile({ email: userInfo.email, filter: value });
    } catch (error) {
      Alert.alert("Error", "Failed to update filter preference");
    }
  };

  const filteredLoans = useMemo(() => {
    return (
      loanData?.filter((loan) => {
        console.log("loan---", loan);
        const nameMatch = loan.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
        const loanStatus = loan?.emiHistory?.every(
          (emi: any) =>
            emi.paidStatus === "Paid" || emi.paidStatus === "Skipped"
        )
          ? "Completed"
          : "Active";
        const matchesStatus =
          statusFilter === "all"
            ? true
            : loanStatus.toLowerCase() === statusFilter?.toLowerCase();
        return nameMatch && matchesStatus;
      }) || []
    );
  }, [loanData, searchTerm, statusFilter]);

  const totalLoans = filteredLoans.length;
  const totalPages = Math.ceil(totalLoans / loansPerPage);
  const startIndex = (currentPage - 1) * loansPerPage;
  const displayedLoans = filteredLoans.slice(
    startIndex,
    startIndex + loansPerPage
  );

  const goToPage = (page: any) => {
    setCurrentPage(page);
  };

  const FilterModal = () => (
    <View style={styles.filterModal}>
      <LinearGradient
        colors={["#1e293b", "#334155"]}
        style={styles.filterContent}
      >
        <Text style={styles.filterTitle}>Filter by Status</Text>
        {["all", "active", "completed"].map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterOption,
              statusFilter === filter && styles.filterOptionActive,
            ]}
            onPress={() => handlePaymentFilter(filter)}
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
  );

  const LoanCard = ({ loan }: any) => {
    const dueEmi =
      loan.emiHistory.find((emi: any) => emi.paidStatus === "Due") ||
      loan.emiHistory[loan.emiHistory.length - 1];
    const encodedId = btoa(loan._id);
    const totalInstallments = loan.emiHistory.reduce(
      (acc: number, curr: any) => {
        return curr.paidStatus === "Due" ? acc + 1 : acc;
      },
      0
    );

    return (
      <View style={styles.cardContainer}>
        <LinearGradient
          colors={["#1e40af", "#3b82f6", "#1e40af"]}
          style={styles.cardHeader}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <View style={styles.cardHeaderContent}>
            <Text style={styles.cardName}>{loan.name}</Text>
            <View style={styles.phoneContainer}>
              <MaterialIcons name="phone" size={16} color="#ffffff" />
              <Text style={styles.phoneText}>{loan.phone}</Text>
            </View>
          </View>
        </LinearGradient>

        <LinearGradient colors={["#0f172a", "#1e293b"]} style={styles.cardBody}>
          <View style={styles.cardGrid}>
            <View style={styles.cardRow}>
              <View style={styles.cardField}>
                <MaterialIcons name="credit-card" size={16} color="#6366f1" />
                <Text style={styles.fieldLabel}>Customer ID</Text>
              </View>
              <Text style={styles.fieldValue}>{loan.customerId}</Text>
            </View>

            <View style={styles.cardRow}>
              <View style={styles.cardField}>
                <MaterialIcons name="credit-card" size={16} color="#6366f1" />
                <Text style={styles.fieldLabel}>Loan ID</Text>
              </View>
              <Text style={styles.fieldValue}>{loan.loanId}</Text>
            </View>

            <View style={styles.cardRow}>
              <View style={styles.cardField}>
                <MaterialIcons name="attach-money" size={16} color="#6366f1" />
                <Text style={styles.fieldLabel}>Amount</Text>
              </View>
              <Text style={styles.fieldValue}>
                ₹ {loan.loanAmount.toLocaleString()}
              </Text>
            </View>

            <View style={styles.cardRow}>
              <View style={styles.cardField}>
                <MaterialIcons name="trending-up" size={16} color="#6366f1" />
                <Text style={styles.fieldLabel}>Installments</Text>
              </View>
              <View style={styles.installmentContainer}>
                <View
                  style={[
                    styles.statusDot,
                    {
                      backgroundColor:
                        totalInstallments === 0 ? "#10b981" : "#f59e0b",
                    },
                  ]}
                />
                <Text style={styles.fieldValue}>{totalInstallments}</Text>
              </View>
            </View>

            <View style={styles.cardRow}>
              <View style={styles.cardField}>
                <MaterialIcons name="schedule" size={16} color="#6366f1" />
                <Text style={styles.fieldLabel}>Next Payment</Text>
              </View>
              <View style={styles.paymentInfo}>
                <View
                  style={[
                    styles.statusBadge,
                    {
                      backgroundColor:
                        dueEmi.paidStatus !== "Due" ? "#dcfce7" : "#fef2f2",
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.statusBadgeText,
                      {
                        color:
                          dueEmi.paidStatus !== "Due" ? "#166534" : "#dc2626",
                      },
                    ]}
                  >
                    {dueEmi.paidStatus}
                  </Text>
                </View>
                <Text style={styles.fieldValue}>₹ {dueEmi.amount}</Text>
                <Text style={styles.dateText}>{formatDate(dueEmi.date)}</Text>
              </View>
            </View>
          </View>

          <View style={styles.cardFooter}>
            <View
              style={[
                styles.statusChip,
                {
                  backgroundColor:
                    totalInstallments === 0 ? "#dcfce7" : "#fef3c7",
                },
              ]}
            >
              <Text
                style={[
                  styles.statusChipText,
                  {
                    color: totalInstallments === 0 ? "#166534" : "#92400e",
                  },
                ]}
              >
                {totalInstallments === 0 ? "Completed" : "Active"}
              </Text>
            </View>

            <TouchableOpacity style={styles.viewButton}>
              <MaterialIcons name="visibility" size={16} color="#6366f1" />
              <Text style={styles.viewButtonText}>View</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>
    );
  };

  const LoadingCard = () => (
    <View style={styles.cardContainer}>
      <LinearGradient colors={["#374151", "#4b5563"]} style={styles.cardHeader}>
        <View style={styles.loadingHeader} />
      </LinearGradient>
      <View style={styles.loadingBody}>
        {Array.from({ length: 5 }).map((_, index) => (
          <View key={index} style={styles.loadingRow}>
            <View style={styles.loadingField} />
            <View style={styles.loadingValue} />
          </View>
        ))}
      </View>
    </View>
  );

  const PaginationButton = ({ page, isActive, onPress, disabled }: any) => (
    <TouchableOpacity
      style={[
        styles.paginationButton,
        isActive && styles.paginationButtonActive,
        disabled && styles.paginationButtonDisabled,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text
        style={[
          styles.paginationButtonText,
          isActive && styles.paginationButtonTextActive,
        ]}
      >
        {page}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#0f172a", "#1e293b", "#334155"]}
        style={styles.background}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.searchContainer}>
            <View style={styles.searchInputContainer}>
              <MaterialIcons name="search" size={20} color="#9ca3af" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search by name"
                placeholderTextColor="#9ca3af"
                value={searchTerm}
                onChangeText={handleSearch}
                editable={!isLoading}
              />
            </View>
            <View>
             <AddLoanModal visible={showModal} onClose={() => setShowModal(false)} ownerid={ownerid} />
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => setShowModal(true)}
              >
                <MaterialIcons name="add" size={20} color="#ffffff" />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.filterButton}
              onPress={() => setShowFilterModal(true)}
              disabled={isLoading}
            >
              <MaterialIcons name="filter-list" size={20} color="#ffffff" />
            </TouchableOpacity>

            <View style={styles.totalContainer}>
              <Text style={styles.totalText}>
                Total: {isLoading ? "..." : totalLoans}
              </Text>
            </View>
          </View>
        </View>

        {/* Pagination */}
        <View style={styles.paginationContainer}>
          <TouchableOpacity
            style={[
              styles.paginationArrow,
              (isLoading || currentPage === 1) &&
                styles.paginationArrowDisabled,
            ]}
            onPress={() => goToPage(Math.max(1, currentPage - 1))}
            disabled={isLoading || currentPage === 1}
          >
            <MaterialIcons name="chevron-left" size={20} color="#ffffff" />
          </TouchableOpacity>

          <View style={styles.paginationNumbers}>
            {Array.from({ length: Math.min(totalPages, 5) }).map((_, index) => {
              const page = index + 1;
              return (
                <PaginationButton
                  key={page}
                  page={page}
                  isActive={page === currentPage && !isLoading}
                  onPress={() => goToPage(page)}
                  disabled={isLoading}
                />
              );
            })}
          </View>

          <TouchableOpacity
            style={[
              styles.paginationArrow,
              (isLoading || currentPage === totalPages) &&
                styles.paginationArrowDisabled,
            ]}
            onPress={() => goToPage(Math.min(totalPages, currentPage + 1))}
            disabled={isLoading || currentPage === totalPages}
          >
            <MaterialIcons name="chevron-right" size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>
        {/* Loan Cards */}
        <FlatList
          data={
            isLoading ? Array.from({ length: loansPerPage }) : displayedLoans
          }
          renderItem={({ item, index }) =>
            isLoading ? <LoadingCard key={index} /> : <LoanCard loan={item} />
          }
          keyExtractor={(item: any, index) =>
            isLoading ? `loading-${index}` : item.loanId
          }
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          numColumns={1}
        />

        {/* Filter Modal */}
        {showFilterModal && <FilterModal />}
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  header: {
    marginTop: 20,
    marginBottom: 10,
  },

  searchContainer: {
    flexDirection: "row",
    paddingHorizontal: 1,
    paddingVertical: 7,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    color: "#ffffff",
    fontSize: 16,
  },
  headerActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(55, 65, 81, 0.8)",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 9,
    gap: 12,
  },
  addButton: {
    backgroundColor: "rgba(99, 102, 241, 0.8)",
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  filterButton: {
    backgroundColor: "rgba(99, 102, 241, 0.8)",
    borderRadius: 8,
    padding: 12,
  },
  totalContainer: {
    backgroundColor: "rgba(55, 65, 81, 0.8)",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  totalText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: "rgba(55, 65, 81, 0.8)",
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  paginationArrow: {
    backgroundColor: "rgba(99, 102, 241, 0.8)",
    borderRadius: 8,
    padding: 8,
  },
  paginationArrowDisabled: {
    backgroundColor: "rgba(107, 114, 128, 0.5)",
  },
  paginationNumbers: {
    flexDirection: "row",
    marginHorizontal: 16,
    gap: 8,
  },

  paginationButton: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    minWidth: 36,
    alignItems: "center",
  },
  paginationButtonActive: {
    backgroundColor: "#6366f1",
  },
  paginationButtonDisabled: {
    opacity: 0.5,
  },
  paginationButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },
  paginationButtonTextActive: {
    color: "#ffffff",
  },
  listContainer: {
    paddingBottom: 20,
  },
  cardContainer: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: "hidden",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  cardHeader: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  cardHeaderContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#ffffff",
    flex: 1,
  },
  phoneContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  phoneText: {
    color: "#ffffff",
    fontSize: 14,
    opacity: 0.9,
  },
  cardBody: {
    padding: 20,
  },
  cardGrid: {
    gap: 16,
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
  },
  installmentContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  paymentInfo: {
    alignItems: "flex-end",
    gap: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  dateText: {
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: 12,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
  },
  statusChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusChipText: {
    fontSize: 12,
    fontWeight: "600",
  },
  viewButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(99, 102, 241, 0.2)",
    borderWidth: 1,
    borderColor: "#6366f1",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  viewButtonText: {
    color: "#6366f1",
    fontSize: 14,
    fontWeight: "600",
  },
  loadingHeader: {
    height: 20,
    backgroundColor: "rgba(156, 163, 175, 0.3)",
    borderRadius: 4,
    width: "60%",
  },
  loadingBody: {
    padding: 20,
    backgroundColor: "rgba(30, 41, 59, 0.8)",
    gap: 16,
  },
  loadingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  loadingField: {
    height: 16,
    backgroundColor: "rgba(156, 163, 175, 0.3)",
    borderRadius: 4,
    width: "40%",
  },
  loadingValue: {
    height: 16,
    backgroundColor: "rgba(156, 163, 175, 0.3)",
    borderRadius: 4,
    width: "30%",
  },
  filterModal: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  filterContent: {
    backgroundColor: "#1e293b",
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
});

export default CardView;
