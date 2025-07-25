import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

interface ProfileImage {
  mimeType: string;
  imageData: string;
}

interface UserData {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  companyName: string;
  joinDate: string;
}

interface ProfileState {
  name: string;
  email: string;
  phone: string;
  location: string;
  companyName: string;
  joinDate: string;
}

interface ImageData {
  imageData: string;
  imageName: string;
  mimeType: string;
  UploadedDate: Date;
  customerId: string;
  owner: string;
}

interface ProfileHeaderProps {
  userData: {
    userData: UserData;
  };
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ userData }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [avatarSrc, setAvatarSrc] = useState<string>('https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png');
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [newAvatarFile, setNewAvatarFile] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const [profile, setProfile] = useState<ProfileState>({
    name: '--',
    email: '--',
    phone: '--',
    location: '--',
    companyName: '--',
    joinDate: '--',
  });

  useEffect(() => {
    if (userData && userData.userData) {
      setProfile({
        name: userData.userData.name || '--',
        email: userData.userData.email || '--',
        phone: userData.userData.phone || '--',
        location: userData.userData.location || '--',
        companyName: userData.userData.companyName || '--',
        joinDate: formatDate(userData.userData.joinDate) || '--',
      });
    }
  }, [userData]);

  const formatDate = (dateString: string): string => {
    const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleInputChange = (name: keyof ProfileState, value: string) => {
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
      base64: true,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      setNewAvatarFile(asset);
      setPreviewUrl(asset.uri);
    }
  };

  const handleSaveAvatar = async () => {
    if (!newAvatarFile || !newAvatarFile.base64) return;

    setLoading(true);
    try {
      const imageData: ImageData = {
        imageData: newAvatarFile.base64,
        imageName: newAvatarFile.fileName || 'profile.jpg',
        mimeType: newAvatarFile.type || 'image/jpeg',
        UploadedDate: new Date(),
        customerId: 'ProfileImage',
        owner: userData.userData.id,
      };

      // Replace this with actual API call
      console.log('Uploading image data:', imageData);
      setAvatarSrc(previewUrl || avatarSrc);
      setIsUploadOpen(false);
    } catch (err) {
      Alert.alert('Error', 'Failed to upload image.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    setIsEditing(false);
    try {
      console.log('Saving profile:', profile);
    } catch (err) {
      Alert.alert('Error', 'Failed to save profile.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.banner} />
      <View style={styles.avatarContainer}>
        <TouchableOpacity onPress={() => setIsUploadOpen(true)}>
          <Image source={{ uri: avatarSrc }} style={styles.avatar} />
        </TouchableOpacity>
        <Text style={styles.nameText}>{profile.name}</Text>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.button} onPress={() => setIsUploadOpen(true)}>
          <Ionicons name="camera" size={18} color="#fff" />
          <Text style={styles.buttonText}>Change Photo</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={isEditing ? handleSaveProfile : () => setIsEditing(true)}>
          <MaterialIcons name={isEditing ? 'check' : 'edit'} size={18} color="#fff" />
          <Text style={styles.buttonText}>{isEditing ? 'Save' : 'Edit Profile'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.detailsContainer}>
        {Object.entries(profile).map(([key, value]) => (
          <View key={key} style={styles.detailRow}>
            <Text style={styles.label}>{key}</Text>
            {isEditing && key !== 'joinDate' ? (
              <TextInput
                style={styles.input}
                value={value}
                onChangeText={(text) => handleInputChange(key as keyof ProfileState, text)}
              />
            ) : (
              <Text style={styles.value}>{value}</Text>
            )}
          </View>
        ))}
      </View>

      {/* Upload Modal */}
      <Modal visible={isUploadOpen} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Upload New Profile Picture</Text>
            <TouchableOpacity onPress={handlePickImage} style={styles.uploadButton}>
              <Ionicons name="image" size={22} color="#333" />
              <Text style={{ marginLeft: 10 }}>Choose Image</Text>
            </TouchableOpacity>
            {previewUrl && (
              <Image source={{ uri: previewUrl }} style={styles.preview} />
            )}
            <View style={styles.modalActions}>
              <TouchableOpacity onPress={() => setIsUploadOpen(false)}>
                <Text style={{ color: 'red' }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity disabled={loading} onPress={handleSaveAvatar}>
                {loading ? <ActivityIndicator /> : <Text>Save</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { paddingBottom: 30, backgroundColor: '#fff' },
  banner: { height: 100, backgroundColor: '#6C63FF' },
  avatarContainer: { alignItems: 'center', marginTop: -50 },
  avatar: { width: 100, height: 100, borderRadius: 50, borderWidth: 3, borderColor: '#fff' },
  nameText: { fontSize: 20, fontWeight: '600', marginTop: 10 },
  buttonRow: { flexDirection: 'row', justifyContent: 'center', gap: 10, marginTop: 10 },
  button: { flexDirection: 'row', backgroundColor: '#6C63FF', padding: 10, borderRadius: 8, alignItems: 'center', marginHorizontal: 5 },
  buttonText: { color: '#fff', marginLeft: 5 },
  detailsContainer: { padding: 16 },
  detailRow: { marginBottom: 12 },
  label: { fontWeight: '600', color: '#555' },
  value: { fontSize: 16, color: '#333' },
  input: { borderBottomWidth: 1, borderColor: '#ccc', paddingVertical: 4, fontSize: 16 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#fff', padding: 24, borderRadius: 12, width: '80%' },
  modalTitle: { fontSize: 18, fontWeight: '600', marginBottom: 16, textAlign: 'center' },
  uploadButton: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  preview: { width: 100, height: 100, borderRadius: 50, alignSelf: 'center', marginVertical: 12 },
  modalActions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 },
});

export default ProfileHeader;
