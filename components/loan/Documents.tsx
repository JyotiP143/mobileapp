"use client"

import { Ionicons } from "@expo/vector-icons"
import * as FileSystem from "expo-file-system"
import * as ImagePicker from "expo-image-picker"
import * as Sharing from "expo-sharing"
import type React from "react"
import { useEffect, useState } from "react"
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import { useImageContext } from "../../context/ImageContext"

const { width } = Dimensions.get("window")
const cardWidth = (width - 48) / 2 // 2 columns with padding

interface DocumentCardProps {
  name: string
  uploadDate: string
  imageUrl: string
  onView: () => void
  onDownload: () => void
}

const DocumentCard: React.FC<DocumentCardProps> = ({ name, uploadDate, imageUrl, onView, onDownload }) => (
  <View style={styles.documentCard}>
    <TouchableOpacity onPress={onView} style={styles.imageContainer}>
      <Image source={{ uri: imageUrl }} style={styles.documentImage} />
    </TouchableOpacity>
    <View style={styles.documentContent}>
      <Text style={styles.documentName} numberOfLines={1}>
        {name}
      </Text>
      <Text style={styles.uploadDate}>Uploaded on {uploadDate}</Text>
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.actionButton} onPress={onView}>
          <Ionicons name="eye-outline" size={16} color="#374151" />
          <Text style={styles.buttonText}>View</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={onDownload}>
          <Ionicons name="download-outline" size={16} color="#374151" />
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
)

interface Props {
  loanData: any
}

export const Documents: React.FC<Props> = ({ loanData }) => {
  const { uploadedImage, setUploadedImage } = useImageContext()
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    ;(async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
      if (status !== "granted") {
        Alert.alert("Permission needed", "Sorry, we need camera roll permissions to upload images!")
      }
    })()
  }, [])

  const pickImage = async (useCamera = false) => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      })

      if (!result.canceled && result.assets[0]) {
        await uploadImage(result.assets[0])
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick image")
    }
  }

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync()
    if (status !== "granted") {
      Alert.alert("Permission needed", "Camera permission is required to take photos")
      return
    }

    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      })

      if (!result.canceled && result.assets[0]) {
        await uploadImage(result.assets[0])
      }
    } catch (error) {
      Alert.alert("Error", "Failed to take photo")
    }
  }

  const uploadImage = async (asset: ImagePicker.ImagePickerAsset) => {
    setIsUploading(true)
    setUploadProgress(0)

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(progressInterval)
            return 100
          }
          return prev + 10
        })
      }, 200)

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      clearInterval(progressInterval)
      setUploadProgress(100)

      // Add to uploaded images
      const newDocument = {
        name: asset.fileName || `Document_${Date.now()}.jpg`,
        uploadDate: new Date().toLocaleDateString(),
        imageUrl: asset.uri,
      }

      setUploadedImage((prev) => [...prev, newDocument])

      setTimeout(() => {
        setUploadProgress(0)
        setIsUploading(false)
      }, 500)
    } catch (error) {
      Alert.alert("Upload Failed", "Failed to upload image")
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  const handleDownload = async (imageUrl: string, fileName: string) => {
    try {
      const fileUri = FileSystem.documentDirectory + fileName
      const { uri } = await FileSystem.downloadAsync(imageUrl, fileUri)

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri)
      } else {
        Alert.alert("Success", "Image saved to device")
      }
    } catch (error) {
      Alert.alert("Error", "Failed to save image")
    }
  }

  const showImageOptions = () => {
    Alert.alert("Add Document", "Choose an option", [
      { text: "Camera", onPress: takePhoto },
      { text: "Gallery", onPress: () => pickImage() },
      { text: "Cancel", style: "cancel" },
    ])
  }

  return (
    <View style={styles.container}>
      <View style={styles.uploadSection}>
        <TouchableOpacity style={styles.uploadButton} onPress={showImageOptions} disabled={isUploading}>
          {isUploading ? (
            <View style={styles.uploadingContainer}>
              <ActivityIndicator size="large" color="#3B82F6" />
              <Text style={styles.uploadingText}>Uploading... {uploadProgress}%</Text>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${uploadProgress}%` }]} />
              </View>
            </View>
          ) : (
            <View style={styles.uploadContent}>
              <Ionicons name="cloud-upload-outline" size={48} color="#9CA3AF" />
              <Text style={styles.uploadTitle}>Upload Document</Text>
              <Text style={styles.uploadSubtitle}>Tap to select from gallery or camera</Text>
              <Text style={styles.uploadHint}>PNG, JPG or GIF (MAX. 10MB)</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.documentsGrid} showsVerticalScrollIndicator={false}>
        <View style={styles.gridContainer}>
          {uploadedImage.map((doc, index) => (
            <DocumentCard
              key={index}
              name={doc.name}
              uploadDate={doc.uploadDate}
              imageUrl={doc.imageUrl}
              onView={() => {
                setSelectedImage(doc.imageUrl)
                setIsModalOpen(true)
              }}
              onDownload={() => handleDownload(doc.imageUrl, doc.name)}
            />
          ))}
        </View>
      </ScrollView>

      <Modal visible={isModalOpen} transparent={true} animationType="fade" onRequestClose={() => setIsModalOpen(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeButton} onPress={() => setIsModalOpen(false)}>
              <Ionicons name="close" size={24} color="#374151" />
            </TouchableOpacity>
            {selectedImage && <Image source={{ uri: selectedImage }} style={styles.modalImage} />}
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  uploadSection: {
    padding: 16,
  },
  uploadButton: {
    backgroundColor: "#374151",
    borderRadius: 12,
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 200,
    borderWidth: 2,
    borderColor: "#D1D5DB",
    borderStyle: "dashed",
  },
  uploadContent: {
    alignItems: "center",
  },
  uploadTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#F9FAFB",
    marginTop: 12,
    marginBottom: 8,
  },
  uploadSubtitle: {
    fontSize: 14,
    color: "#D1D5DB",
    marginBottom: 4,
  },
  uploadHint: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  uploadingContainer: {
    alignItems: "center",
    width: "100%",
  },
  uploadingText: {
    fontSize: 16,
    color: "#F9FAFB",
    marginTop: 12,
    marginBottom: 16,
  },
  progressBar: {
    width: "100%",
    height: 8,
    backgroundColor: "#4B5563",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#3B82F6",
    borderRadius: 4,
  },
  documentsGrid: {
    flex: 1,
    paddingHorizontal: 16,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingBottom: 20,
  },
  documentCard: {
    width: cardWidth,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: "hidden",
  },
  imageContainer: {
    width: "100%",
    height: 120,
  },
  documentImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  documentContent: {
    padding: 12,
  },
  documentName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  uploadDate: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 12,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#F3F4F6",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  buttonText: {
    fontSize: 12,
    color: "#374151",
    marginLeft: 4,
    fontWeight: "500",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    width: "100%",
    maxWidth: 400,
    position: "relative",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 1,
    backgroundColor: "#F3F4F6",
    borderRadius: 20,
    padding: 8,
  },
  modalImage: {
    width: "100%",
    height: 300,
    resizeMode: "contain",
    borderRadius: 8,
  },
})
