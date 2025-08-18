import { Ionicons } from "@expo/vector-icons"
import type React from "react"
import { FlatList, ScrollView, StyleSheet, Text, View } from "react-native"

interface Props {
  loanData: any
}

// Helper function to format the date as '23 Jan 2025'
const formatDate = (date: string | Date) => {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

const Badge: React.FC<{ children: React.ReactNode; variant?: string; className?: string }> = ({
  children,
  variant = "default",
  className,
}) => {
  const isPaid = className?.includes("bg-green-700")
  const isPending = className?.includes("bg-orange-500")

  return (
    <View style={[styles.badge, isPaid && styles.badgePaid, isPending && styles.badgePending]}>
      <Text style={[styles.badgeText, isPaid && styles.badgeTextPaid, isPending && styles.badgeTextPending]}>
        {children}
      </Text>
    </View>
  )
}

export const PaymentHistory: React.FC<Props> = ({ loanData }) => {
  const paidEMIs = loanData.emiHistory.filter((payment: any) => payment.paidStatus !== "Due")
  const totalPaid = paidEMIs.reduce((acc: number, payment: any) => acc + Number(payment.amount), 0)

  const lastPaidAmount = paidEMIs.length > 0 ? paidEMIs[paidEMIs.length - 1].amount : 0

  let nextDueDate = null
  for (const payment of loanData.emiHistory) {
    if (payment.paidStatus === "Due") {
      nextDueDate = payment.date
      break
    }
  }

  if (!nextDueDate && loanData.emiHistory.length > 0) {
    const lastPayment = loanData.emiHistory[loanData.emiHistory.length - 1]
    const nextMonth = new Date(lastPayment.dueDate)
    nextMonth.setMonth(nextMonth.getMonth() + 1)
    nextDueDate = nextMonth
  }

  const paidItems = loanData.emiHistory.filter((loan: any) => loan.paidStatus === "Paid")

  const renderPaymentItem = ({ item }: { item: any }) => (
    <View style={styles.tableRow}>
      <View style={styles.tableCell}>
        <Text style={styles.tableCellText}>{formatDate(item.date)}</Text>
      </View>
      <View style={styles.tableCell}>
        <Text style={[styles.tableCellText, styles.monospace]}>{item.transactionId}</Text>
      </View>
      <View style={styles.tableCell}>
        <Text style={styles.tableCellText}>{item.method}</Text>
      </View>
      <View style={styles.tableCell}>
        <Text style={styles.tableCellText}>₹{Number(item.amount).toFixed(2)}</Text>
      </View>
      <View style={styles.tableCell}>
        <Badge variant="secondary" className={item.paidStatus === "Paid" ? "bg-green-700" : "bg-orange-500"}>
          {item.paidStatus === "Paid" ? "Paid" : "Pending"}
        </Badge>
      </View>
    </View>
  )

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>Payment History</Text>
        </View>

        {/* Summary Cards */}
        <View style={styles.summaryGrid}>
          <View style={[styles.summaryCard, styles.greenCard]}>
            <View style={styles.summaryContent}>
              <View>
                <Text style={styles.summaryLabel}>Total Paid</Text>
                <Text style={styles.summaryValue}>₹{totalPaid}</Text>
              </View>
              <View style={styles.summaryBadge}>
                <Text style={styles.summaryBadgeText}>{paidEMIs.length} Payments</Text>
              </View>
            </View>
          </View>

          <View style={[styles.summaryCard, styles.blueCard]}>
            <View style={styles.summaryRow}>
              <Ionicons name="card" size={20} color="#2563eb" />
              <View style={styles.summaryInfo}>
                <Text style={styles.summaryLabel}>Last Payment</Text>
                <Text style={styles.summaryValue}>₹{lastPaidAmount}</Text>
              </View>
            </View>
          </View>

          <View style={[styles.summaryCard, styles.purpleCard]}>
            <View style={styles.summaryRow}>
              <Ionicons name="calendar" size={20} color="#7c3aed" />
              <View style={styles.summaryInfo}>
                <Text style={styles.summaryLabel}>Next Due Date</Text>
                <Text style={styles.summaryValue}>
                  {nextDueDate ? formatDate(nextDueDate) : "All payments are clear"}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Payment History Table */}
        <View style={styles.tableContainer}>
          <View style={styles.tableHeader}>
            <View style={styles.tableHeaderCell}>
              <Text style={styles.tableHeaderText}>Date</Text>
            </View>
            <View style={styles.tableHeaderCell}>
              <Text style={styles.tableHeaderText}>Transaction ID</Text>
            </View>
            <View style={styles.tableHeaderCell}>
              <Text style={styles.tableHeaderText}>Method</Text>
            </View>
            <View style={styles.tableHeaderCell}>
              <Text style={styles.tableHeaderText}>Amount</Text>
            </View>
            <View style={styles.tableHeaderCell}>
              <Text style={styles.tableHeaderText}>Status</Text>
            </View>
          </View>

          {paidItems.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No data&apos;s present</Text>
            </View>
          ) : (
            <FlatList
              data={paidItems}
              renderItem={renderPaymentItem}
              keyExtractor={(item) => item._id}
              scrollEnabled={false}
            />
          )}
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    backgroundColor: "#64748b",
    borderRadius: 12,
    padding: 24,
    margin: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: 8,
  },
  summaryGrid: {
    flexDirection: "column",
    gap: 16,
    marginBottom: 24,
  },
  summaryCard: {
    borderRadius: 8,
    padding: 16,
  },
  greenCard: {
    backgroundColor: "#f0fdf4",
  },
  blueCard: {
    backgroundColor: "#eff6ff",
  },
  purpleCard: {
    backgroundColor: "#faf5ff",
  },
  summaryContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  summaryInfo: {
    flex: 1,
  },
  summaryLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#16a34a",
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#15803d",
  },
  summaryBadge: {
    backgroundColor: "#dcfce7",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  summaryBadgeText: {
    fontSize: 12,
    color: "#16a34a",
    fontWeight: "500",
  },
  tableContainer: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#374151",
    overflow: "hidden",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#374151",
    paddingVertical: 12,
  },
  tableHeaderCell: {
    flex: 1,
    paddingHorizontal: 12,
  },
  tableHeaderText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#ffffff",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#374151",
    paddingVertical: 12,
    backgroundColor: "#4b5563",
  },
  tableCell: {
    flex: 1,
    paddingHorizontal: 12,
    justifyContent: "center",
  },
  tableCellText: {
    fontSize: 14,
    color: "#ffffff",
  },
  monospace: {
    fontFamily: "monospace",
    fontSize: 12,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: "flex-start",
  },
  badgePaid: {
    backgroundColor: "#15803d",
  },
  badgePending: {
    backgroundColor: "#ea580c",
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "500",
  },
  badgeTextPaid: {
    color: "#ffffff",
  },
  badgeTextPending: {
    color: "#ffffff",
  },
  emptyState: {
    padding: 32,
    alignItems: "center",
  },
  emptyStateText: {
    fontSize: 14,
    color: "#d1d5db",
    textAlign: "center",
  },
})
