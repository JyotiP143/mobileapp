import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { InvestmentScreen } from './investment';
import { LoansScreen } from './loans';
import { MembersScreen } from './members';
import { WithdrawnScreen } from './withdraw';

type Screen = 'investment' | 'loans' | 'members' | 'withdrawn';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('investment');

  const renderScreen = () => {
    switch (currentScreen) {
      case 'investment':
        return <InvestmentScreen />;
      case 'loans':
        return <LoansScreen />;
      case 'members':
        return <MembersScreen />;
      case 'withdrawn':
        return <WithdrawnScreen />;
      default:
        return <InvestmentScreen />;
    }
  };

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        {renderScreen()}
        
        {/* Bottom Navigation for Demo */}
        <View style={styles.bottomNav}>
          <TouchableOpacity
            style={[styles.navButton, currentScreen === 'investment' && styles.activeNavButton]}
            onPress={() => setCurrentScreen('investment')}
          >
            <Text style={[styles.navText, currentScreen === 'investment' && styles.activeNavText]}>
              Investment
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.navButton, currentScreen === 'loans' && styles.activeNavButton]}
            onPress={() => setCurrentScreen('loans')}
          >
            <Text style={[styles.navText, currentScreen === 'loans' && styles.activeNavText]}>
              Loans
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.navButton, currentScreen === 'members' && styles.activeNavButton]}
            onPress={() => setCurrentScreen('members')}
          >
            <Text style={[styles.navText, currentScreen === 'members' && styles.activeNavText]}>
              Members
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.navButton, currentScreen === 'withdrawn' && styles.activeNavButton]}
            onPress={() => setCurrentScreen('withdrawn')}
          >
            <Text style={[styles.navText, currentScreen === 'withdrawn' && styles.activeNavText]}>
              Withdrawn
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#2a2a2a',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#404040',
  },
  navButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  activeNavButton: {
    backgroundColor: '#4285f4',
  },
  navText: {
    color: '#888',
    fontSize: 12,
    fontWeight: '500',
  },
  activeNavText: {
    color: '#fff',
  },
});