"use client"

import { useUser } from "@/context/UserContext"
import type { Member, MemberStats } from "@/types/member"
import { MaterialIcons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import type React from "react"
import { useMemo, useState } from "react"
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Modal,
  RefreshControl,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
const { width, height } = Dimensions.get("window")

const MembersApp = () => {
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [viewMode, setViewMode] = useState<"list" | "card">("card")
  const [entriesPerPage, setEntriesPerPage] = useState<number>(25)
  const [selectedMembers, setSelectedMembers] = useState<string[]>([])
  const [selectAll, setSelectAll] = useState<boolean>(false)
  const [showFilterModal, setShowFilterModal] = useState<boolean>(false)
  const [showEntriesModal, setShowEntriesModal] = useState<boolean>(false)
  const [refreshing, setRefreshing] = useState<boolean>(false)


  const { loanData, loanisLoading } = useUser()

  // Process loan data to get member information
  const processedMembers = useMemo((): Member[] => {
    if (!loanData) return []

    const result = loanData.reduce((acc: any, loan: any) => {
      console.log("loanData sample:", loanData?.[0]);

       if (!loan.customerId) {
    console.warn("Missing customerId in loan", loan);
    return acc;
   }
      const { customerId, name } = loan
      if (!acc[customerId]) {
        acc[customerId] = {
          totalLoanAmount: 0,
          totalPaidAmount: 0,
          oldestApprovalDate: null,
          name: name || "Unknown",
        }
      }

      const customer = acc[customerId]
      customer.totalLoanAmount += Number.parseFloat(loan.loanAmount)

      const paidAmount = loan.emiHistory.reduce((total: number, emi:any) => {
        if (emi.paidStatus === "Paid") {
          total += Number.parseFloat(emi.amount)
        }
        return total
      }, 0)

      customer.totalPaidAmount += paidAmount

      const approvalDate = new Date(loan.approvalDate)
      if (!customer.oldestApprovalDate || approvalDate < customer.oldestApprovalDate) {
        customer.oldestApprovalDate = approvalDate
      }

      return acc
    }, {})

const calculateDuration = (date: Date) => {
  const now = new Date();
  const diffTime = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const years = Math.floor(diffDays / 365);
  return { years };
};

return Object.entries(result).map(([customerId, data]: [string, any]) => {
  const duration = data.oldestApprovalDate
    ? calculateDuration(data.oldestApprovalDate)
    : { years: 0 };

  return {
    customerId,
    name: data.name,
    totalLoanAmount: data.totalLoanAmount,
    totalPaidAmount: data.totalPaidAmount,
    oldestApprovalDate: data.oldestApprovalDate?.toISOString(),
    duration: `${duration.years}`,
    status: data.totalLoanAmount === data.totalPaidAmount ? "Inactive" : "Active",
    isNew: duration.years < 1,
  } as Member;
});
  }, [loanData])

 

  const filteredMembers = useMemo(() => {
    return processedMembers.filter((member: Member) => {
      const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === "all" ? true : member.status.toLowerCase() === statusFilter.toLowerCase()
      return matchesSearch && matchesStatus
    })
  }, [processedMembers, searchTerm, statusFilter])

  const memberStats = useMemo((): MemberStats => {
    const totalMembers = processedMembers.length
    const activeMembers = processedMembers.filter((m) => m.status === "Active").length
    const inactiveMembers = processedMembers.filter((m) => m.status === "Inactive").length
    const totalLoanAmount = processedMembers.reduce((sum, m) => sum + m.totalLoanAmount, 0)
    const totalPaidAmount = processedMembers.reduce((sum, m) => sum + m.totalPaidAmount, 0)

    return {
      totalMembers,
      activeMembers,
      inactiveMembers,
      totalLoanAmount,
      totalPaidAmount,
    }
  }, [processedMembers])

  const totalPages = Math.ceil(filteredMembers.length / entriesPerPage)

  const getCurrentPageItems = (): Member[] => {
    const startIndex = (currentPage - 1) * entriesPerPage
    const endIndex = startIndex + entriesPerPage
    return filteredMembers.slice(startIndex, endIndex)
  }

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    const day = date.getDate()
    const month = date.toLocaleString("en-GB", { month: "short" })
    const year = date.getFullYear()
    return `${day}-${month}-${year}`
  }

  const downloadPDF = (): void => {
    const doc = new jsPDF()
    const columns = ["Name", "Joining Date", "Total Loan Amount", "Paid Total", "Membership Duration", "Status"]
    const data = getCurrentPageItems().map((member: Member) => [
      member.name,
      formatDate(member.oldestApprovalDate),
      member.totalLoanAmount.toString(),
      member.totalPaidAmount.toString(),
      `${member.duration} ${member.duration === "1" ? "Year" : "Years"}`,
      member.status,
    ])

    doc.text("Member Details", 14, 10)
    autoTable(doc, {
      head: [columns],
      body: data,
      startY: 20,
    })

    doc.save("members.pdf")
  }

  const handleSelectAll = (): void => {
    if (selectAll) {
      setSelectedMembers([])
    } else {
      setSelectedMembers(processedMembers.map((member: Member) => member.customerId))
    }
    setSelectAll(!selectAll)
  }

  const handleMemberSelect = (customerId: string): void => {
    let updatedSelection: string[] = []
    if (selectedMembers.includes(customerId)) {
      updatedSelection = selectedMembers.filter((id: string) => id !== customerId)
    } else {
      updatedSelection = [...selectedMembers, customerId]
    }
    setSelectedMembers(updatedSelection)
    setSelectAll(updatedSelection.length === processedMembers.length)
  }

  const onRefresh = (): void => {
    setRefreshing(true)
    setTimeout(() => {
      setRefreshing(false)
    }, 2000)
  }
  const MemberCard: React.FC<{ member: Member; index: number }> = ({ member, index }) => (
    <View style={styles.cardContainer}>
      <LinearGradient
        colors={
          member.status === "Active"
            ? ["rgba(16, 185, 129, 0.1)", "rgba(5, 150, 105, 0.1)"]
            : ["rgba(239, 68, 68, 0.1)", "rgba(220, 38, 38, 0.1)"]
        }
        style={styles.card}
      >
        <View style={styles.cardHeader}>
          <TouchableOpacity style={styles.checkbox} onPress={() => handleMemberSelect(member.customerId)}>
            <MaterialIcons
              name={selectedMembers.includes(member.customerId) ? "check-box" : "check-box-outline-blank"}
              size={24}
              color={selectedMembers.includes(member.customerId) ? "#3b82f6" : "#9ca3af"}
            />
          </TouchableOpacity>
          <View style={styles.memberInfo}>
            <Text style={styles.memberName}>{member.name}</Text>
            <Text style={styles.memberId}>ID: {member.customerId}</Text>
          </View>
          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor: member.status === "Active" ? "#dcfce7" : "#fef2f2",
              },
            ]}
          >
            <Text
              style={[
                styles.statusText,
                {
                  color: member.status === "Active" ? "#1eca60ff" : "#dc2626",
                },
              ]}
            >
              {member.status}
            </Text>
          </View>
        </View>

        <View style={styles.cardContent}>
          <View style={styles.cardRow}>
            <View style={styles.cardField}>
              <MaterialIcons name="event" size={18} color="#6366f1" />
              <Text style={styles.fieldLabel}>Joined</Text>
            </View>
            <Text style={styles.fieldValue}>{formatDate(member.oldestApprovalDate)}</Text>
          </View>

          <View style={styles.cardRow}>
            <View style={styles.cardField}>
              <MaterialIcons name="account-balance" size={18} color="#10b981" />
              <Text style={styles.fieldLabel}>Total Loan</Text>
            </View>
            <Text style={[styles.fieldValue, styles.amountText]}>₹ {member.totalLoanAmount.toLocaleString()}</Text>
          </View>

          <View style={styles.cardRow}>
            <View style={styles.cardField}>
              <MaterialIcons name="payment" size={18} color="#f59e0b" />
              <Text style={styles.fieldLabel}>Paid Amount</Text>
            </View>
            <Text style={[styles.fieldValue, styles.paidAmountText]}>₹ {member.totalPaidAmount.toLocaleString()}</Text>
          </View>

          <View style={styles.cardRow}>
            <View style={styles.cardField}>
              <MaterialIcons name="schedule" size={18} color="#8b5cf6" />
              <Text style={styles.fieldLabel}>Duration</Text>
            </View>
            <Text style={styles.fieldValue}>
              {member.duration} {member.duration === "1" ? "Year" : "Years"}
            </Text>
          </View>
        </View>
      </LinearGradient>
    </View>
  )

  const LoadingCard: React.FC = () => (
    <View style={styles.cardContainer}>
      <LinearGradient colors={["rgba(107, 114, 128, 0.1)", "rgba(75, 85, 99, 0.1)"]} style={styles.card}>
        <View style={styles.loadingContent}>
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </LinearGradient>
    </View>
  )

  const FilterModal: React.FC = () => (
    <Modal visible={showFilterModal} transparent animationType="slide" onRequestClose={() => setShowFilterModal(false)}>
      <View style={styles.modalOverlay}>
        <LinearGradient colors={["#1e293b", "#334155"]} style={styles.filterModalContent}>
          <Text style={styles.filterTitle}>Filter by Status</Text>
          {["all", "active", "inactive", "pending"].map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[styles.filterOption, statusFilter === filter && styles.filterOptionActive]}
              onPress={() => {
                setStatusFilter(filter)
                setShowFilterModal(false)
              }}
            >
              <Text style={[styles.filterOptionText, statusFilter === filter && styles.filterOptionTextActive]}>
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </Text>
              {statusFilter === filter && <MaterialIcons name="check" size={20} color="#10b981" />}
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={styles.filterCloseButton} onPress={() => setShowFilterModal(false)}>
            <Text style={styles.filterCloseText}>Close</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </Modal>
  )

  const EntriesModal: React.FC = () => (
    <Modal
      visible={showEntriesModal}
      transparent
      animationType="slide"
      onRequestClose={() => setShowEntriesModal(false)}
    >
      <View style={styles.modalOverlay}>
        <LinearGradient colors={["#1e293b", "#334155"]} style={styles.entriesModalContent}>
          <Text style={styles.entriesTitle}>Entries per page</Text>
          {[25, 50, 100].map((entries) => (
            <TouchableOpacity
              key={entries}
              style={[styles.entriesOption, entriesPerPage === entries && styles.entriesOptionActive]}
              onPress={() => {
                setEntriesPerPage(entries)
                setCurrentPage(1)
                setShowEntriesModal(false)
              }}
            >
              <Text style={[styles.entriesOptionText, entriesPerPage === entries && styles.entriesOptionTextActive]}>
                {entries}
              </Text>
              {entriesPerPage === entries && <MaterialIcons name="check" size={20} color="#10b981" />}
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={styles.entriesCloseButton} onPress={() => setShowEntriesModal(false)}>
            <Text style={styles.entriesCloseText}>Close</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </Modal>
  )

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
      <LinearGradient colors={["#0f172a", "#1e293b"]} style={styles.background}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <LinearGradient colors={["#3b82f6", "#1d4ed8"]} style={styles.headerIcon}>
              <MaterialIcons name="people" size={24} color="#ffffff" />
            </LinearGradient>
            <Text style={styles.headerTitle}>Members</Text>
          </View>
          <TouchableOpacity
            style={styles.viewToggleButton}
            onPress={() => setViewMode(viewMode === "card" ? "list" : "card")}
          >
            <MaterialIcons name={viewMode === "card" ? "view-list" : "view-module"} size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>
        {/* Search and Filters */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <MaterialIcons name="search" size={20} color="#9ca3af" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search members..."
              placeholderTextColor="#9ca3af"
              value={searchTerm}
              onChangeText={setSearchTerm}
            />
          </View>
          <TouchableOpacity style={styles.filterButton} onPress={() => setShowFilterModal(true)}>
            <MaterialIcons name="filter-list" size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>

        {/* Action Bar */}
        <View style={styles.actionBar}>
          <View style={styles.actionLeft}>
            <TouchableOpacity style={styles.selectAllButton} onPress={handleSelectAll}>
              <MaterialIcons name={selectAll ? "check-box" : "check-box-outline-blank"} size={20} color="#3b82f6" />
              <Text style={styles.selectAllText}>All</Text>
            </TouchableOpacity>
            {selectedMembers.length > 0 && (
              <View style={styles.selectedCount}>
                <Text style={styles.selectedCountText}>({selectedMembers.length})</Text>
              </View>
            )}
          </View>
          <View style={styles.actionRight}>
            <TouchableOpacity style={styles.entriesButton} onPress={() => setShowEntriesModal(true)}>
              <Text style={styles.entriesButtonText}>{entriesPerPage}</Text>
              <MaterialIcons name="keyboard-arrow-down" size={16} color="#ffffff" />
            </TouchableOpacity>
            <Text style={styles.totalText}>{filteredMembers.length}</Text>
            
          </View>
        </View>

        {/* Members List */}
        <FlatList
          data={loanisLoading ? Array.from({ length: 3 }) : getCurrentPageItems()}
          renderItem={({ item, index }:any) =>
            loanisLoading ? <LoadingCard key={index} /> : <MemberCard member ={item} index={index} />
          }
          keyExtractor={({ item, index }:any) => (loanisLoading ? `loading-${index}` : item?.customerId)}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListEmptyComponent={
            !loanisLoading ? (
              <View style={styles.emptyState}>
                <MaterialIcons name="people-outline" size={64} color="#6b7280" />
                <Text style={styles.emptyStateText}>No members found</Text>
                <Text style={styles.emptyStateSubtext}>Members will appear here once loans are processed</Text>
              </View>
            ) : null
          }
        />

        {/* Pagination */}
        {totalPages > 1 && (
          <View style={styles.paginationContainer}>
            <TouchableOpacity
              style={[styles.paginationButton, currentPage === 1 && styles.paginationButtonDisabled]}
              onPress={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <MaterialIcons name="chevron-left" size={20} color="#ffffff" />
            </TouchableOpacity>

            <Text style={styles.paginationText}>
              {currentPage} of {totalPages}
            </Text>

            <TouchableOpacity
              style={[styles.paginationButton, currentPage === totalPages && styles.paginationButtonDisabled]}
              onPress={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              <MaterialIcons name="chevron-right" size={20} color="#ffffff" />
            </TouchableOpacity>
          </View>
        )}

        {/* Modals */}
        <FilterModal />
        <EntriesModal />
      </LinearGradient>
    </SafeAreaView>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#43434eff",
  },
  background: {
    flex: 1,
    height: "100%",
    marginTop :-30,
    marginBottom :-50,
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
  viewToggleButton: {
    backgroundColor: "rgba(59, 130, 246, 0.8)",
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  statsContainer: {
    paddingVertical: 12,
  },
  statsScrollContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
  statCard: {
    width: 120,
    height: 100,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "800",
    color: "#ffffff",
  },
  statLabel: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
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
    gap: 12,
  },
  selectAllButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  selectAllText: {
    color: "#3b82f6",
    fontSize: 14,
    fontWeight: "500",
  },
  selectedCount: {
    backgroundColor: "rgba(59, 130, 246, 0.2)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  selectedCountText: {
    color: "#3b82f6",
    fontSize: 12,
    fontWeight: "600",
  },
  actionRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  entriesButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(55, 65, 81, 0.8)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    gap: 4,
  },
  entriesButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "500",
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
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  cardContainer: {
    marginBottom: 16,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    position: "relative",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 12,
  },
  checkbox: {
    padding: 4,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#ffffff",
    marginBottom: 2,
  },
  memberId: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.6)",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
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
  },
  amountText: {
    color: "#10b981",
    fontSize: 14,
    fontWeight: "700",
  },
  paidAmountText: {
    color: "#f59e0b",
    fontSize: 14,
    fontWeight: "700",
  },
  newBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(59, 130, 246, 0.2)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  newBadgeText: {
    color: "#3b82f6",
    fontSize: 12,
    fontWeight: "600",
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
  entriesModalContent: {
    borderRadius: 16,
    padding: 24,
    width: width * 0.7,
    maxWidth: 250,
  },
  entriesTitle: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 20,
    textAlign: "center",
  },
  entriesOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
  entriesOptionActive: {
    backgroundColor: "rgba(16, 185, 129, 0.2)",
    borderWidth: 1,
    borderColor: "#10b981",
  },
  entriesOptionText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "500",
  },
  entriesOptionTextActive: {
    color: "#10b981",
  },
  entriesCloseButton: {
    backgroundColor: "#6366f1",
    borderRadius: 8,
    paddingVertical: 12,
    marginTop: 16,
  },
  entriesCloseText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
})

export default MembersApp
