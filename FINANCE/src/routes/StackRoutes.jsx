import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import Login from '../screens/LoginScreen';
import DashBoard from '../screens/DashBoardScreen';
import Despesa from '../screens/DespesaScreen';
import Receita from '../screens/ReceitaScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Bottom Tabs (Dashboard, Despesa, Receita)
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
          else if (route.name === 'Despesa') iconName = 'arrow-down-bold-circle';
          else if (route.name === 'Receita') iconName = 'arrow-up-bold-circle';

          return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="DashBoard" component={DashBoard} options={{ tabBarLabel: 'Dashboard' }} />
      <Tab.Screen name="Despesa" component={Despesa} options={{ tabBarLabel: 'Despesas' }} />
      <Tab.Screen name="Receita" component={Receita} options={{ tabBarLabel: 'Receitas' }} />
    </Tab.Navigator>
  );
}

// Pilha principal com Login e após login as Tabs
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
