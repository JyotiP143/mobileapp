import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '../../components/header';
import { Pagination } from '../../components/pagination';
import { SearchAndControls } from '../../components/searchandcontrols';
import { Loan } from '../../types/index';
const mockLoans: Loan[] = [
  {
    id: '1',
    name: 'Prashant',
    customerId: 'CUST-1001',
    loanId: 'LN-1001',
    loanAmount: 6000,
    installments: 6,
    nextPayment: '11 May 2025',
    status: 'Active',
    phone: '7624821788',
  },
  {
    id: '2',
    name: 'Prashant',
    customerId: 'CUST-1001',
    loanId: 'LN-1002',
    loanAmount: 4000,
    installments: 3,
    nextPayment: '25 Jun 2025',
    status: 'Active',
    phone: '7624821788',
  },
];

export const LoansScreen: React.FC = () => {
  const [searchValue, setSearchValue] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState('All');
  const entriesPerPage = 25;

  const handleAddLoan = () => {
    console.log('Add Loan pressed');
  };

  const handleExport = () => {
    console.log('Export pressed');
  };

  const handleFilterPress = () => {
    console.log('Filter pressed');
  };

  const handlePayPress = (loanId: string) => {
    console.log('Pay pressed for loan:', loanId);
  };

  const filteredLoans = mockLoans.filter(loan =>
    loan.name.toLowerCase().includes(searchValue.toLowerCase()) ||
    loan.loanId.toLowerCase().includes(searchValue.toLowerCase()) ||
    loan.customerId.toLowerCase().includes(searchValue.toLowerCase())
  );

  const totalPages = Math.ceil(filteredLoans.length / entriesPerPage);

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Loans"
        icon="card"
        buttonText="Add Loan"
        onButtonPress={handleAddLoan}
      />
      
      <SearchAndControls
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        showFilter={true}
        filterText={filterStatus}
        onFilterPress={handleFilterPress}
        total={filteredLoans.length}
        onExport={handleExport}
      />

      <View style={styles.tableContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <TouchableOpacity style={styles.checkbox} />
              <Text style={[styles.headerText, styles.nameColumn]}>NAME</Text>
              <Text style={[styles.headerText, styles.customerIdColumn]}>CUSTOMER ID</Text>
              <Text style={[styles.headerText, styles.loanIdColumn]}>LOAN ID</Text>
              <Text style={[styles.headerText, styles.loanAmountColumn]}>LOAN AMOUNT</Text>
              <Text style={[styles.headerText, styles.installmentsColumn]}>INSTALLMENTS</Text>
              <Text style={[styles.headerText, styles.nextPaymentColumn]}>NEXT PAYMENT</Text>
              <Text style={[styles.headerText, styles.statusColumn]}>STATUS</Text>
              <Text style={[styles.headerText, styles.actionsColumn]}>ACTIONS</Text>
            </View>

            <ScrollView style={styles.tableBody}>
              {filteredLoans.map((loan) => (
                <View key={loan.id} style={styles.tableRow}>
                  <TouchableOpacity style={styles.checkbox} />
                  <View style={styles.nameColumn}>
                    <Text style={styles.nameText}>{loan.name}</Text>
                    {loan.phone && <Text style={styles.phoneText}>📞 {loan.phone}</Text>}
                  </View>
                  <Text style={[styles.cellText, styles.customerIdColumn]}>👤 {loan.customerId}</Text>
                  <Text style={[styles.cellText, styles.loanIdColumn]}>{loan.loanId}</Text>
                  <Text style={[styles.cellText, styles.loanAmountColumn]}>₹ {loan.loanAmount.toLocaleString()}</Text>
                  <View style={styles.installmentsColumn}>
                    <View style={styles.installmentsBadge}>
                      <Text style={styles.installmentsText}>🔶 {loan.installments}</Text>
                    </View>
                  </View>
                  <View style={styles.nextPaymentColumn}>
                    <Text style={styles.paymentAmount}>₹ 1000.00</Text>
                    <Text style={styles.paymentDate}>{loan.nextPayment}</Text>
                  </View>
                  <View style={styles.statusColumn}>
                    <View style={styles.dueBadge}>
                      <Text style={styles.dueText}>Due</Text>
                    </View>
                    <View style={styles.activeBadge}>
                      <Text style={styles.activeText}>Active</Text>
                    </View>
                  </View>
                  <View style={styles.actionsColumn}>
                    <TouchableOpacity 
                      style={styles.payButton}
                      onPress={() => handlePayPress(loan.loanId)}
                    >
                      <Text style={styles.payButtonText}>💳 Pay</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        </ScrollView>
      </View>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalEntries={filteredLoans.length}
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
  table: {
    minWidth: 1200,
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
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  cellText: {
    color: '#fff',
    fontSize: 14,
  },
  nameColumn: {
    width: 120,
  },
  nameText: {
    color: '#4285f4',
    fontSize: 14,
    fontWeight: '500',
  },
  phoneText: {
    color: '#888',
    fontSize: 12,
    marginTop: 2,
  },
  customerIdColumn: {
    width: 120,
  },
  loanIdColumn: {
    width: 100,
  },
  loanAmountColumn: {
    width: 120,
  },
  installmentsColumn: {
    width: 120,
    alignItems: 'center',
  },
  installmentsBadge: {
    backgroundColor: '#ff6b35',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  installmentsText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  nextPaymentColumn: {
    width: 120,
  },
  paymentAmount: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  paymentDate: {
    color: '#888',
    fontSize: 12,
    marginTop: 2,
  },
  statusColumn: {
    width: 100,
    gap: 4,
  },
  dueBadge: {
    backgroundColor: '#dc3545',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  dueText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '500',
  },
  activeBadge: {
    backgroundColor: '#ffc107',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  activeText: {
    color: '#000',
    fontSize: 10,
    fontWeight: '500',
  },
  actionsColumn: {
    width: 80,
  },
  payButton: {
    backgroundColor: '#4285f4',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  payButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
});