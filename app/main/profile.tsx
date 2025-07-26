"use client"
import ProfileHeader from "@/components/profile/profile-header"
import { StyleSheet, View } from "react-native"

// Mock useUser for v0 preview
import { useUser } from "@/context/UserContext"

const ProfilePage = () => {
  const { loanData, isLoading, userInfo } = useUser()

  return (
    <View style={styles.mainContainer}>
      {isLoading ? (
        <View style={styles.profileSkeleton}>
          <View style={styles.headerBackground}></View>
          <View style={styles.headerContentContainer}>
            <View style={styles.profileImageContainer}>
              {/* Skeleton for Profile Avatar */}
              <View style={styles.avatarSkeleton}></View>
            </View>
            <View style={styles.headerDetailsContainer}>
              <View style={styles.nameSkeletonContainer}>
                {/* Skeleton for Name */}
                <View style={styles.nameSkeleton}></View>
              </View>
              {/* Skeleton for Buttons */}
              <View style={styles.buttonsContainer}>
                <View style={styles.buttonSkeleton}></View>
                <View style={styles.buttonSkeleton}></View>
              </View>
            </View>
          </View>
          <View style={styles.contactInfoContainer}>
            {/* Skeleton for Contact Info */}
            {[...Array(5)].map((_, index) => (
              <View key={index} style={styles.contactItemSkeleton}>
                <View style={styles.iconSkeleton}></View>
                <View style={styles.textSkeleton}></View>
              </View>
            ))}
          </View>
          {/* Cards Skeleton */}
          <View style={styles.cardsContainer}>
            <View style={styles.cardSkeleton}></View>
            <View style={styles.cardSkeleton}></View>
            <View style={styles.cardSkeleton}></View>
          </View>
        </View>
      ) : (
       <View style={styles.loadedContentContainer}>
  <ProfileHeader userData={{ userData: userInfo } as any} />
  
</View>

      )}
    </View>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    padding: 24, // p-6
    backgroundColor: "#1a1a1a", // Assuming a dark background for the page
  },
  profileSkeleton: {
    flex: 1,
  },
  headerBackground: {
    height: 192, // h-48
    backgroundColor: "#a78bfa", // from-blue-400 to-purple-500 (simplified to one color for skeleton)
    borderRadius: 8, // Added for a softer look
  },
  headerContentContainer: {
    marginTop: -48, // -mt-12 (approx)
    paddingHorizontal: 16, // px-4
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 20, // sm:space-x-5
  },
  profileImageContainer: {
    flexDirection: "row",
  },
  avatarSkeleton: {
    height: 96, // h-24
    width: 96, // w-24
    borderRadius: 9999, // rounded-full
    borderWidth: 4, // ring-4
    borderColor: "white", // ring-white
    backgroundColor: "#d1d5db", // bg-gray-300
    // No direct animate-pulse in RN, but the color gives a hint
  },
  headerDetailsContainer: {
    marginTop: 24, // mt-6
    flex: 1,
    minWidth: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 24, // sm:space-x-6
    paddingBottom: 4, // sm:pb-1
  },
  nameSkeletonContainer: {
    // sm:hidden md:block mt-6 min-w-0 flex-1
    marginTop: 24,
    minWidth: 0,
    flex: 1,
  },
  nameSkeleton: {
    height: 24, // h-6
    width: 160, // w-40
    backgroundColor: "#d1d5db", // bg-gray-300
    borderRadius: 4, // rounded
  },
  buttonsContainer: {
    marginTop: 24, // mt-6
    flexDirection: "column",
    gap: 12, // space-y-3
    // sm:flex-row sm:space-y-0 sm:space-x-4
  },
  buttonSkeleton: {
    height: 40, // h-10
    width: 128, // w-32
    backgroundColor: "#d1d5db", // bg-gray-300
    borderRadius: 6, // rounded
  },
  contactInfoContainer: {
    marginTop: 24, // mt-6
    paddingHorizontal: 16, // px-4
    flexDirection: "row", // grid grid-cols-1
    flexWrap: "wrap", // Allows items to wrap
    gap: 16, // gap-x-4 gap-y-6
  },
  contactItemSkeleton: {
    flexDirection: "row",
    alignItems: "center",
    fontSize: 14, // text-sm
    width: "48%", // Approx for sm:grid-cols-2
    // For md:grid-cols-3, would need more complex logic or fixed widths
  },
  iconSkeleton: {
    height: 20, // h-5
    width: 20, // w-5
    backgroundColor: "#d1d5db", // bg-gray-300
    borderRadius: 9999, // rounded-full
    marginRight: 8, // mr-2
  },
  textSkeleton: {
    height: 20, // h-5
    width: 96, // w-24
    backgroundColor: "#d1d5db", // bg-gray-300
    borderRadius: 4, // rounded
  },
  cardsContainer: {
    marginTop: 32, // mt-8
    flexDirection: "row",
    gap: 20, // gap-5
    paddingHorizontal: 16, // Added for consistency
  },
  cardSkeleton: {
    flex: 1,
    height: 208, // h-52
    backgroundColor: "#e5e7eb", // bg-gray-200
    borderRadius: 8, // rounded-md
  },
  loadedContentContainer: {
    flex: 1,
    gap: 32, // space-y-8
  },
})

export default ProfilePage;
