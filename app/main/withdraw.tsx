import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '../../components/header';
import { Pagination } from '../../components/pagination';
import { SearchAndControls } from '../../components/searchandcontrols';
import { Withdrawal } from '../../types/index';

const mockWithdrawals: Withdrawal[] = [];

export const WithdrawnScreen: React.FC = () => {
  const [searchValue, setSearchValue] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const entriesPerPage = 25;

  const handleWithdraw = () => {
    console.log('Withdraw pressed');
  };

  const handleExport = () => {
    console.log('Export pressed');
  };

  const filteredWithdrawals = mockWithdrawals.filter(withdrawal =>
    withdrawal.remarks.toLowerCase().includes(searchValue.toLowerCase()) ||
    withdrawal.date.toLowerCase().includes(searchValue.toLowerCase())
  );

  const totalPages = Math.ceil(filteredWithdrawals.length / entriesPerPage);

  const EmptyState = () => (
    <View style={styles.emptyState}>
      <View style={styles.emptyIcon}>
        <Ionicons name="document-outline" size={48} color="#666" />
      </View>
      <Text style={styles.emptyText}>No records found</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Withdrawn"
        icon="arrow-down-circle"
        buttonText="Withdraw"
        onButtonPress={handleWithdraw}
      />
      
      <SearchAndControls
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        total={filteredWithdrawals.length}
        onExport={handleExport}
      />

      <View style={styles.tableContainer}>
        <View style={styles.tableHeader}>
          <TouchableOpacity style={styles.checkbox} />
          <Text style={[styles.headerText, styles.dateColumn]}>DATE</Text>
          <Text style={[styles.headerText, styles.amountColumn]}>AMOUNT</Text>
          <Text style={[styles.headerText, styles.remarksColumn]}>REMARKS</Text>
        </View>

        <ScrollView style={styles.tableBody} contentContainerStyle={styles.tableBodyContent}>
          {filteredWithdrawals.length === 0 ? (
            <EmptyState />
          ) : (
            filteredWithdrawals.map((withdrawal) => (
              <View key={withdrawal.id} style={styles.tableRow}>
                <TouchableOpacity style={styles.checkbox} />
                <Text style={[styles.cellText, styles.dateColumn]}>{withdrawal.date}</Text>
                <Text style={[styles.cellText, styles.amountColumn]}>₹ {withdrawal.amount.toLocaleString()}</Text>
                <Text style={[styles.cellText, styles.remarksColumn]}>{withdrawal.remarks}</Text>
              </View>
            ))
          )}
        </ScrollView>
      </View>

      <Pagination
        currentPage={currentPage}
        totalPages={Math.max(1, totalPages)}
        totalEntries={filteredWithdrawals.length}
        entriesPerPage={entriesPerPage}
        onPageChange={setCurrentPage}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  tableContainer: {
    flex: 1,
    backgroundColor: '#2a2a2a',
    margin: 20,
    borderRadius: 8,
  },
  tableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#404040',
  },
  tableBody: {
    flex: 1,
  },
  tableBodyContent: {
    flexGrow: 1,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  checkbox: {
    width: 16,
    height: 16,
    borderWidth: 1,
    borderColor: '#666',
    borderRadius: 2,
    marginRight: 16,
  },
  headerText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  cellText: {
    color: '#fff',
    fontSize: 14,
  },
  dateColumn: {
    flex: 1,
  },
  amountColumn: {
    flex: 1,
  },
  remarksColumn: {
    flex: 2,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    backgroundColor: '#404040',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyText: {
    color: '#888',
    fontSize: 16,
    fontWeight: '500',
  },
});