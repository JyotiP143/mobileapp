import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface SearchAndControlsProps {
  searchValue: string;
  onSearchChange: (text: string) => void;
  placeholder?: string;
  showFilter?: boolean;
  filterText?: string;
  onFilterPress?: () => void;
  total: number;
  onExport: () => void;
}

export const SearchAndControls: React.FC<SearchAndControlsProps> = ({
  searchValue,
  onSearchChange,
  placeholder = "Search...",
  showFilter = false,
  filterText = "All",
  onFilterPress,
  total,
  onExport,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.leftControls}>
        {showFilter && (
          <TouchableOpacity style={styles.filterButton} onPress={onFilterPress}>
            <Ionicons name="filter" size={16} color="#fff" />
            <Text style={styles.filterText}>{filterText}</Text>
            <Ionicons name="chevron-down" size={16} color="#fff" />
          </TouchableOpacity>
        )}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={16} color="#888" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder={placeholder}
            placeholderTextColor="#888"
            value={searchValue}
            onChangeText={onSearchChange}
          />
        </View>
      </View>
      <View style={styles.rightControls}>
        <TouchableOpacity style={styles.paginationButton}>
          <Text style={styles.paginationText}>25</Text>
          <Ionicons name="chevron-down" size={16} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.totalText}>Total: {total}</Text>
        <TouchableOpacity style={styles.exportButton} onPress={onExport}>
          <Ionicons name="download-outline" size={16} color="#fff" />
          <Text style={styles.exportText}>Export</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap:10,
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#2a2a2a',
  },
  leftControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#404040',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    gap: 6,
  },
  filterText: {
    color: '#fff',
    fontSize: 14,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#404040',
    borderRadius: 6,
    paddingHorizontal: 12,
    width: 200,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    fontSize: 14,
    paddingVertical: 8,
  },
  rightControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  paginationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#404040',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    gap: 6,
  },
  paginationText: {
    color: '#fff',
    fontSize: 14,
  },
  totalText: {
    color: '#fff',
    fontSize: 14,
  },
  exportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#404040',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    gap: 6,
  },
  exportText: {
    color: '#fff',
    fontSize: 14,
  },
});