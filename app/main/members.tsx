import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '../../components/header';
import { Pagination } from '../../components/pagination';
import { SearchAndControls } from '../../components/searchandcontrols';
import { Member } from '../../types/index';

const mockMembers: Member[] = [
  {
    id: '1',
    name: 'Prashant',
    joiningDate: '23-Mar-2025',
    totalLoanAmount: 12000,
    paidTotal: 3000,
    membershipDuration: '0 Years',
    status: 'Active',
  },
];

export const MembersScreen: React.FC = () => {
  const [searchValue, setSearchValue] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState('All Status');
  const entriesPerPage = 25;

  const handleAddMember = () => {
    console.log('Add Member pressed');
  };

  const handleCardView = () => {
    console.log('Card View pressed');
  };

  const handleExport = () => {
    console.log('Export pressed');
  };

  const handleFilterPress = () => {
    console.log('Filter pressed');
  };

  const filteredMembers = mockMembers.filter(member =>
    member.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  const totalPages = Math.ceil(filteredMembers.length / entriesPerPage);

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

      <View style={styles.tableContainer}>
        <View style={styles.tableHeader}>
          <TouchableOpacity style={styles.checkbox} />
          <Text style={[styles.headerText, styles.nameColumn]}>Name</Text>
          <Text style={[styles.headerText, styles.joiningDateColumn]}>Joining Date</Text>
          <Text style={[styles.headerText, styles.totalLoanColumn]}>Total Loan Amount</Text>
          <Text style={[styles.headerText, styles.paidTotalColumn]}>Paid Total</Text>
          <Text style={[styles.headerText, styles.membershipColumn]}>Membership Duration</Text>
          <Text style={[styles.headerText, styles.statusColumn]}>Status</Text>
        </View>

        <ScrollView style={styles.tableBody}>
          {filteredMembers.map((member) => (
            <View key={member.id} style={styles.tableRow}>
              <TouchableOpacity style={styles.checkbox} />
              <Text style={[styles.cellText, styles.nameColumn]}>{member.name}</Text>
              <View style={styles.joiningDateColumn}>
                <Text style={styles.dateText}>📅 {member.joiningDate}</Text>
              </View>
              <Text style={[styles.cellText, styles.totalLoanColumn]}>₹ {member.totalLoanAmount.toLocaleString()}</Text>
              <Text style={[styles.cellText, styles.paidTotalColumn]}>₹ {member.paidTotal.toLocaleString()}</Text>
              <View style={styles.membershipColumn}>
                <Text style={styles.durationText}>👥 {member.membershipDuration}</Text>
              </View>
              <View style={styles.statusColumn}>
                <View style={styles.activeBadge}>
                  <Text style={styles.activeText}>{member.status}</Text>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalEntries={filteredMembers.length}
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
  },
  cellText: {
    color: '#fff',
    fontSize: 14,
  },
  nameColumn: {
    flex: 1.5,
  },
  joiningDateColumn: {
    flex: 1.5,
  },
  dateText: {
    color: '#fff',
    fontSize: 14,
  },
  totalLoanColumn: {
    flex: 1.5,
  },
  paidTotalColumn: {
    flex: 1.5,
  },
  membershipColumn: {
    flex: 1.5,
  },
  durationText: {
    color: '#fff',
    fontSize: 14,
  },
  statusColumn: {
    flex: 1,
  },
  activeBadge: {
    backgroundColor: '#28a745',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  activeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
});