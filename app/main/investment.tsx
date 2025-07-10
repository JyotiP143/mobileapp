import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '../../components/header';
import { Pagination } from '../../components/pagination';
import { SearchAndControls } from '../../components/searchandcontrols';
import { Investment } from '../../types/index';

const mockInvestments: Investment[] = [
  {
    id: '1',
    date: '25-Mar-2025',
    amount: 100000,
    remarks: 'Initial amount',
  },
];

export const InvestmentScreen: React.FC = () => {
  const [searchValue, setSearchValue] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const entriesPerPage = 25;

  const handleAddInvestment = () => {
    console.log('Add Investment pressed');
  };

  const handleExport = () => {
    console.log('Export pressed');
  };

  const filteredInvestments = mockInvestments.filter(investment =>
    investment.remarks.toLowerCase().includes(searchValue.toLowerCase()) ||
    investment.date.toLowerCase().includes(searchValue.toLowerCase())
  );

  const totalPages = Math.ceil(filteredInvestments.length / entriesPerPage);

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Investment"
        icon="trending-up"
        buttonText="Investment"
        onButtonPress={handleAddInvestment}
      />
      
      <SearchAndControls
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        total={filteredInvestments.length}
        onExport={handleExport}
      />

      <View style={styles.tableContainer}>
        <View style={styles.tableHeader}>
          <TouchableOpacity style={styles.checkbox} />
          <Text style={[styles.headerText, styles.dateColumn]}>DATE</Text>
          <Text style={[styles.headerText, styles.amountColumn]}>AMOUNT</Text>
          <Text style={[styles.headerText, styles.remarksColumn]}>REMARKS</Text>
        </View>

        <ScrollView style={styles.tableBody}>
          {filteredInvestments.map((investment) => (
            <View key={investment.id} style={styles.tableRow}>
              <TouchableOpacity style={styles.checkbox} />
              <Text style={[styles.cellText, styles.dateColumn]}>{investment.date}</Text>
              <Text style={[styles.cellText, styles.amountColumn]}>₹ {investment.amount.toLocaleString()}</Text>
              <Text style={[styles.cellText, styles.remarksColumn]}>{investment.remarks}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalEntries={filteredInvestments.length}
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
});