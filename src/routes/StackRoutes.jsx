import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import Login from '../screens/LoginScreen';
import DashBoard from '../screens/DashBoardScreen';
import Crypto from '../screens/CryptoScreen';
import Transacoes from '../screens/Transacoes';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();


function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#00ff99',
        tabBarInactiveTintColor: '#ccc',
        tabBarStyle: { backgroundColor: '#0d1b2a' },
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'DashBoard') iconName = 'view-dashboard';
          else if (route.name === 'Crypto') iconName = 'currency-usd';
          else if (route.name === 'Transações') iconName = 'swap-horizontal'; 

          return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="DashBoard"
        component={DashBoard}
        options={{ tabBarLabel: 'Dashboard' }}
      />
      <Tab.Screen
        name="Crypto"
        component={Crypto}
        options={{ tabBarLabel: 'Crypto' }}
      />
      <Tab.Screen
        name="Transações"
        component={Transacoes}
        options={{ tabBarLabel: 'Transações' }}
      />
    </Tab.Navigator>
  );
}


export default function Routes() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#0d1b2a' },
        headerTintColor: '#00ff99',
        headerTitleAlign: 'center',
      }}
    >
      <Stack.Screen
        name="Login"
        component={Login}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Home"
        component={AppTabs}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
