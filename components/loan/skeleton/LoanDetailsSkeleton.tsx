"use client"

import React from "react"
import { Animated, ScrollView, StyleSheet, View } from "react-native"

const LoanDetailsSkeleton: React.FC = () => {
  const animatedValue = new Animated.Value(0)

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    ).start()
  }, [])

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  })

  const SkeletonBox = ({ width, height, style }: { width: number; height: number; style?: any }) => (
    <Animated.View style={[styles.skeleton, { width, height, opacity }, style]} />
  )

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header Section */}
      <View style={styles.headerSection}>
        <SkeletonBox width={120} height={24} style={styles.headerItem} />
        <SkeletonBox width={80} height={24} style={styles.headerItem} />
        <SkeletonBox width={150} height={24} style={styles.headerItem} />
      </View>

      {/* Info Cards Grid */}
      <View style={styles.cardsGrid}>
        {[...Array(4)].map((_, i) => (
          <View key={i} style={styles.card}>
            <SkeletonBox width={120} height={20} style={styles.cardTitle} />
            <SkeletonBox width={80} height={32} />
          </View>
        ))}
      </View>

      {/* Tabs */}
      <View style={styles.tabsSection}>
        {["General Info", "Payment Schedule", "History", "Documents"].map((_, i) => (
          <SkeletonBox key={i} width={120} height={40} style={styles.tab} />
        ))}
      </View>

      {/* Loan Information Section */}
      <View style={styles.loanInfoSection}>
        <SkeletonBox width={200} height={32} style={styles.sectionTitle} />

        {/* Loan Details Grid */}
        <View style={styles.detailsGrid}>
          {[...Array(4)].map((_, i) => (
            <View key={i} style={styles.detailItem}>
              <SkeletonBox width={150} height={20} style={styles.detailLabel} />
              <SkeletonBox width={100} height={32} />
            </View>
          ))}
        </View>

        {/* Contact Information */}
        <View style={styles.contactSection}>
          {["Payment Method", "Issue Date", "Email", "Phone"].map((_, i) => (
            <View key={i} style={styles.contactItem}>
              <SkeletonBox width={150} height={20} />
              <SkeletonBox width={200} height={20} />
            </View>
          ))}
        </View>

        {/* Total Paid and Processing Fee */}
        <View style={styles.summaryGrid}>
          <View style={[styles.summaryCard, styles.greenCard]}>
            <SkeletonBox width={100} height={20} style={styles.summaryTitle} />
            <SkeletonBox width={80} height={32} />
          </View>
          <View style={[styles.summaryCard, styles.blueCard]}>
            <SkeletonBox width={120} height={20} style={styles.summaryTitle} />
            <SkeletonBox width={80} height={32} />
          </View>
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1e293b",
    padding: 16,
  },
  skeleton: {
    backgroundColor: "#374151",
    borderRadius: 8,
  },
  headerSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    flexWrap: "wrap",
  },
  headerItem: {
    marginRight: 16,
    marginBottom: 8,
  },
  cardsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  card: {
    backgroundColor: "#374151",
    borderRadius: 12,
    padding: 16,
    width: "48%",
    marginBottom: 12,
  },
  cardTitle: {
    marginBottom: 8,
  },
  tabsSection: {
    flexDirection: "row",
    marginBottom: 24,
    flexWrap: "wrap",
  },
  tab: {
    marginRight: 16,
    marginBottom: 8,
  },
  loanInfoSection: {
    backgroundColor: "#374151",
    borderRadius: 12,
    padding: 20,
  },
  sectionTitle: {
    marginBottom: 24,
  },
  detailsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  detailItem: {
    width: "48%",
    marginBottom: 16,
  },
  detailLabel: {
    marginBottom: 8,
  },
  contactSection: {
    marginBottom: 24,
  },
  contactItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  summaryGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  summaryCard: {
    width: "48%",
    padding: 16,
    borderRadius: 12,
  },
  greenCard: {
    backgroundColor: "#065f46",
  },
  blueCard: {
    backgroundColor: "#1e40af",
  },
  summaryTitle: {
    marginBottom: 8,
  },
})

export default LoanDetailsSkeleton
