import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Dashboardmain from './dashboard';
import { InvestmentScreen } from './investment';
import { LoansScreen } from './loans';
import { MembersScreen } from './members';
import { WithdrawnScreen } from './withdraw';

const Tab = createBottomTabNavigator();

// ✅ Icon map with type-safe icon names
const ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  Dashboard: 'home-outline',
  Investment: 'trending-up-outline',
  Loans: 'cash-outline',
  Members: 'people-outline',
  Withdrawn: 'wallet-outline',
};

const Appindex = () => {
  return (
    <SafeAreaProvider>
      <Tab.Navigator
        initialRouteName="Dashboard"
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: '#667eea',
          tabBarInactiveTintColor: '#ccc',
          tabBarStyle: {
            backgroundColor: '#1a1a1a',
            borderTopWidth: 0,
          },
          tabBarIcon: ({ color, size }) => {
            const iconName = ICONS[route.name] || 'ellipse';
            return (
              <Ionicons name={iconName} size={size} color={color} />
            );
          },
        })}
      >
        <Tab.Screen name="Dashboard" component={Dashboardmain} />
        <Tab.Screen name="Loans" component={LoansScreen} />
        <Tab.Screen name="Investment" component={InvestmentScreen} />
         <Tab.Screen name="Withdrawn" component={WithdrawnScreen} />
        <Tab.Screen name="Members" component={MembersScreen} />
      </Tab.Navigator>
    </SafeAreaProvider>
  );
};

export default Appindex;
