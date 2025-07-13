"use client"

import type React from "react"
import { useState } from "react"
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Header } from "../../components/header"
import { Pagination } from "../../components/pagination"
import { SearchAndControls } from "../../components/searchandcontrols"
import type { Member } from "../../types/index"

const mockMembers: Member[] = [
  {
    id: "1",
    name: "Prashant Kumar",
    joiningDate: "23-Mar-2025",
    totalLoanAmount: 12000,
    paidTotal: 3000,
    membershipDuration: "0 Years",
    status: "Active",
  },
  {
    id: "2",
    name: "Rajesh Sharma",
    joiningDate: "15-Jan-2024",
    totalLoanAmount: 25000,
    paidTotal: 18000,
    membershipDuration: "1 Year",
    status: "Active",
  },
  {
    id: "3",
    name: "Anita Patel",
    joiningDate: "08-Nov-2023",    
    totalLoanAmount: 8500,
    paidTotal: 8500,
    membershipDuration: "1.5 Years",
    status: "Completed",
  },
  {
    id: "4",
    name: "Vikram Singh",
    joiningDate: "12-Feb-2025",
    totalLoanAmount: 15000,
    paidTotal: 2000,
    membershipDuration: "0 Years",
    status: "Active",
  },
  {
    id: "5",
    name: "Meera Gupta",
    joiningDate: "30-Sep-2022",
    totalLoanAmount: 20000,
    paidTotal: 12000,
    membershipDuration: "2.5 Years",
    status: "Inactive",
  },
]

export const MembersScreen: React.FC = () => {
  const [searchValue, setSearchValue] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [filterStatus, setFilterStatus] = useState("All Status")
  const entriesPerPage = 10

  const handleAddMember = () => {
    console.log("Add Member pressed")
  }

  const handleCardView = () => {
    console.log("Card View pressed")
  }

  const handleExport = () => {
    console.log("Export pressed")
  }

  const handleFilterPress = () => {
    console.log("Filter pressed")
  }

  const handleMemberPress = (member: Member) => {
    console.log("Member card pressed:", member.name)
  }

  const handleContactPress = (memberId: string) => {
    console.log("Contact member:", memberId)
  }

  const filteredMembers = mockMembers.filter((member) => member.name.toLowerCase().includes(searchValue.toLowerCase()))

  const totalPages = Math.ceil(filteredMembers.length / entriesPerPage)
  const startIndex = (currentPage - 1) * entriesPerPage
  const paginatedMembers = filteredMembers.slice(startIndex, startIndex + entriesPerPage)

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "#10B981"
      case "inactive":
        return "#EF4444"
      case "completed":
        return "#6B7280"
      case "pending":
        return "#F59E0B"
      default:
        return "#6B7280"
    }
  }

  const getStatusBgColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "#ECFDF5"
      case "inactive":
        return "#FEF2F2"
      case "completed":
        return "#F9FAFB"
      case "pending":
        return "#FFFBEB"
      default:
        return "#F9FAFB"
    }
  }

  const calculatePaymentProgress = (paid: number, total: number) => {
    return total > 0 ? (paid / total) * 100 : 0
  }

  const getRemainingAmount = (total: number, paid: number) => {
    return Math.max(0, total - paid)
  }

  const getMembershipBadgeColor = (duration: string) => {
    const years = Number.parseFloat(duration.split(" ")[0])
    if (years >= 2) return "#8B5CF6"
    if (years >= 1) return "#3B82F6"
    return "#10B981"
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Members"
        icon="people"
        buttonText="Add Member"
        onButtonPress={handleAddMember}
        rightButtonText="Card View"
        onRightButtonPress={handleCardView}
      />

      <SearchAndControls
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        placeholder="Search members..."
        showFilter={true}
        filterText={filterStatus}
        onFilterPress={handleFilterPress}
        total={filteredMembers.length}
        onExport={handleExport}
      />

      <ScrollView
        style={styles.cardsContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.cardsContent}
      >
        {paginatedMembers.map((member) => (
          <TouchableOpacity
            key={member.id}
            style={styles.memberCard}
            onPress={() => handleMemberPress(member)}
            activeOpacity={0.7}
          >
            {/* Card Header */}
            <View style={styles.cardHeader}>
              <View style={styles.memberInfo}>
                <View style={styles.avatarContainer}>
                  <Text style={styles.avatarText}>{member.name.charAt(0).toUpperCase()}</Text>
                </View>
                <View style={styles.nameContainer}>
                  <Text style={styles.memberName}>{member.name}</Text>
                  <View style={styles.joiningInfo}>
                    <Text style={styles.joiningIcon}>📅</Text>
                    <Text style={styles.joiningDate}>Joined {member.joiningDate}</Text>
                  </View>
                </View>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: getStatusBgColor(member.status) }]}>
                <Text style={[styles.statusText, { color: getStatusColor(member.status) }]}>{member.status}</Text>
              </View>
            </View>

            {/* Membership Duration */}
            <View style={styles.membershipSection}>
              <View style={styles.membershipBadge}>
                <Text style={styles.membershipIcon}>👥</Text>
                <Text style={styles.membershipText}>Member for {member.membershipDuration}</Text>
              </View>
            </View>

            {/* Financial Overview */}
            <View style={styles.financialSection}>
              <View style={styles.amountRow}>
                <View style={styles.totalLoanContainer}>
                  <Text style={styles.amountLabel}>Total Loan</Text>
                  <Text style={styles.totalLoanAmount}>₹{member.totalLoanAmount.toLocaleString()}</Text>
                </View>
                <View style={styles.paidContainer}>
                  <Text style={styles.amountLabel}>Paid</Text>
                  <Text style={styles.paidAmount}>₹{member.paidTotal.toLocaleString()}</Text>
                </View>
                <View style={styles.remainingContainer}>
                  <Text style={styles.amountLabel}>Remaining</Text>
                  <Text style={styles.remainingAmount}>
                    ₹{getRemainingAmount(member.totalLoanAmount, member.paidTotal).toLocaleString()}
                  </Text>
                </View>
              </View>

              {/* Progress Bar */}
              <View style={styles.progressSection}>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      { width: `${calculatePaymentProgress(member.paidTotal, member.totalLoanAmount)}%` },
                    ]}
                  />
                </View>
                <Text style={styles.progressText}>
                  {calculatePaymentProgress(member.paidTotal, member.totalLoanAmount).toFixed(1)}% completed
                </Text>
              </View>
            </View>

            {/* Card Footer */}
            <View style={styles.cardFooter}>
              <View style={styles.membershipBadgeContainer}>
                <View
                  style={[
                    styles.membershipLevelBadge,
                    { backgroundColor: getMembershipBadgeColor(member.membershipDuration) },
                  ]}
                >
                  <Text style={styles.membershipLevel}>
                    {member.membershipDuration === "0 Years" ? "New Member" : "Veteran Member"}
                  </Text>
                </View>
              </View>
              <TouchableOpacity style={styles.contactButton} onPress={() => handleContactPress(member.id)}>
                <Text style={styles.contactIcon}>📞</Text>
                <Text style={styles.contactText}>Contact</Text>
              </TouchableOpacity>
            </View>

            {/* Performance Indicator */}
            <View style={styles.performanceIndicator}>
              <View style={styles.performanceRow}>
                <View style={styles.performanceItem}>
                  <Text style={styles.performanceIcon}>💰</Text>
                  <Text style={styles.performanceLabel}>Payment Rate</Text>
                  <Text style={styles.performanceValue}>
                    {calculatePaymentProgress(member.paidTotal, member.totalLoanAmount) > 80
                      ? "Excellent"
                      : calculatePaymentProgress(member.paidTotal, member.totalLoanAmount) > 50
                        ? "Good"
                        : "Needs Attention"}
                  </Text>
                </View>
                <View style={styles.performanceItem}>
                  <Text style={styles.performanceIcon}>⭐</Text>
                  <Text style={styles.performanceLabel}>Member Score</Text>
                  <Text style={styles.performanceValue}>
                    {Math.round(calculatePaymentProgress(member.paidTotal, member.totalLoanAmount) / 10)}/10
                  </Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}

        {paginatedMembers.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateIcon}>👥</Text>
            <Text style={styles.emptyStateTitle}>No members found</Text>
            <Text style={styles.emptyStateText}>Try adjusting your search or filter criteria</Text>
          </View>
        )}
      </ScrollView>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalEntries={filteredMembers.length}
        entriesPerPage={entriesPerPage}
        onPageChange={setCurrentPage}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F172A",
  },
  cardsContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  cardsContent: {
    paddingBottom: 20,
  },
  memberCard: {
    backgroundColor: "#1E293B",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#334155",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  memberInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#3B82F6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
  },
  nameContainer: {
    flex: 1,
  },
  memberName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#F8FAFC",
    marginBottom: 4,
  },
  joiningInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  joiningIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  joiningDate: {
    fontSize: 13,
    color: "#94A3B8",
    fontWeight: "500",
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginLeft: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  membershipSection: {
    marginBottom: 16,
  },
  membershipBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#374151",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  membershipIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  membershipText: {
    color: "#F8FAFC",
    fontSize: 13,
    fontWeight: "500",
  },
  financialSection: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#334155",
  },
  amountRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  totalLoanContainer: {
    flex: 1,
    alignItems: "center",
  },
  paidContainer: {
    flex: 1,
    alignItems: "center",
  },
  remainingContainer: {
    flex: 1,
    alignItems: "center",
  },
  amountLabel: {
    fontSize: 12,
    color: "#94A3B8",
    marginBottom: 4,
    textTransform: "uppercase",
    fontWeight: "500",
  },
  totalLoanAmount: {
    fontSize: 16,
    fontWeight: "700",
    color: "#3B82F6",
  },
  paidAmount: {
    fontSize: 16,
    fontWeight: "700",
    color: "#10B981",
  },
  remainingAmount: {
    fontSize: 16,
    fontWeight: "700",
    color: "#F59E0B",
  },
  progressSection: {
    marginTop: 8,
  },
  progressBar: {
    height: 6,
    backgroundColor: "#334155",
    borderRadius: 3,
    marginBottom: 8,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#10B981",
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: "#94A3B8",
    textAlign: "center",
    fontWeight: "500",
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  membershipBadgeContainer: {
    flex: 1,
  },
  membershipLevelBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    alignSelf: "flex-start",
  },
  membershipLevel: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  contactButton: {
    backgroundColor: "#3B82F6",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    shadowColor: "#3B82F6",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  contactIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  contactText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
  },
  performanceIndicator: {
    backgroundColor: "#374151",
    borderRadius: 12,
    padding: 12,
  },
  performanceRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  performanceItem: {
    alignItems: "center",
    flex: 1,
  },
  performanceIcon: {
    fontSize: 16,
    marginBottom: 4,
  },
  performanceLabel: {
    fontSize: 11,
    color: "#94A3B8",
    marginBottom: 2,
    textAlign: "center",
    fontWeight: "500",
  },
  performanceValue: {
    fontSize: 12,
    color: "#F8FAFC",
    fontWeight: "600",
    textAlign: "center",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyStateIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#F8FAFC",
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: "#94A3B8",
    textAlign: "center",
    lineHeight: 20,
  },
})
