import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Screens
import HomeScreen from './screens/HomeScreen';
import AddDishScreen from './screens/AddDishScreen';
import ChefSettingsScreen from './screens/ChefSettingsScreen';

// Context Provider
import { MenuProvider } from './src/context/MenuContext';

// Define navigation types
export type RootStackParamList = {
  Home: undefined;
  AddDish: { id?: string } | undefined;
  ChefSettings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <MenuProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerStyle: { backgroundColor: '#2E7D32' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold' },
          }}
        >
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ title: "Christoffel's Pantry — Menu" }}
          />
          <Stack.Screen
            name="AddDish"
            component={AddDishScreen}
            options={{ title: 'Add / Edit Dish' }}
          />
          <Stack.Screen
            name="ChefSettings"
            component={ChefSettingsScreen}
            options={{ title: 'Chef Settings' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </MenuProvider>
  );
}