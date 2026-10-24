
import 'react-native-gesture-handler';
import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import SplashScreen from './frontend/screens/splashScreen';
import MainDrawer from './frontend/navigation/drawer';

import { WishlistProvider } from './frontend/components/wishlistContext';
import { AuthModalProvider } from './frontend/components/authModalContext';
import { CartProvider } from './frontend/screens/cartScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthModalProvider>
        <CartProvider>
          <WishlistProvider>
            <NavigationContainer>
              <Stack.Navigator
                initialRouteName="Splash"
                screenOptions={{ headerShown: false }}
              >
                <Stack.Screen
                  name="Splash"
                  component={SplashScreen}
                />

                <Stack.Screen
                  name="Main"
                  component={MainDrawer}
                />
              </Stack.Navigator>
            </NavigationContainer>
          </WishlistProvider>
        </CartProvider>
      </AuthModalProvider>
    </SafeAreaProvider>
  );
}
