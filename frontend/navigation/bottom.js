
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import HomeScreen from '../screens/homeScreen';
import AccessoriesScreen from '../screens/accessories';
import ClothesScreen from '../screens/clothing';
import MakeupScreen from '../screens/makeupScreen';
import ProductDetailsScreen from '../screens/productDetails';
import CartScreen from '../screens/cartScreen';
import WishlistScreen from '../screens/wishlistScreen';
import CheckoutScreen from '../screens/checkoutScreen';
import OrderConfirmationScreen from '../screens/orderConfirmationScreen.js';
import AccountScreen from '../screens/accountScreen';
import { COLORS } from '../../styling/theme';

const Tab = createBottomTabNavigator();
const ExploreStack = createNativeStackNavigator();
const CartStack = createNativeStackNavigator();

// Placeholder screens for tabs not implemented yet
function PlaceholderScreen({ title }) {
  return (
    <View style={styles.placeholder}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>Explore MODEVA</Text>
    </View>
  );
}

// Accessories, Clothing, Makeup and Product Details
function ExploreStackScreen() {
  return (
    <ExploreStack.Navigator
      initialRouteName="Accessories"
      screenOptions={{ headerShown: false }}
    >
      <ExploreStack.Screen
        name="Accessories"
        component={AccessoriesScreen}
      />

      <ExploreStack.Screen
        name="Clothing"
        component={ClothesScreen}
      />

      <ExploreStack.Screen
        name="Makeup"
        component={MakeupScreen}
      />

      <ExploreStack.Screen
        name="ProductDetails"
        component={ProductDetailsScreen}
      />
    </ExploreStack.Navigator>
  );
}

// Cart and Checkout share the Bag tab's navigation stack
function CartStackScreen() {
  return (
    <CartStack.Navigator
      screenOptions={{ headerShown: false }}
    >
      <CartStack.Screen
        name="Cart"
        component={CartScreen}
         options={{ headerShown: false }}
      />

      {/* Register Checkout here if CartScreen navigates
          to navigation.navigate('Checkout') */}
      {/* Uncomment after creating/importing CheckoutScreen:*/}
      <CartStack.Screen
        name="Checkout"
        component={CheckoutScreen}
         options={{ headerShown: false }}
      />

     <CartStack.Screen
  name="OrderConfirmation"
  component={OrderConfirmationScreen}
  options={{ headerShown: false }}
/>
      
    </CartStack.Navigator>
  );
}

// Icons for bottom tabs
const tabIcons = {
  Home: ['home-outline', 'home'],
  Explore: ['grid-outline', 'grid'],
  Saved: ['heart-outline', 'heart'],
  Bag: ['bag-handle-outline', 'bag-handle'],
  Account: ['person-outline', 'person'],
};

export default function BottomTabs() {
  const insets = useSafeAreaInsets();
  const bottomInset = Math.max(insets.bottom, 0);

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => {
        const iconPair = tabIcons[route.name] || [ 'ellipse-outline','ellipse' ];

        return {
          headerShown: false,
          tabBarHideOnKeyboard: true,
          tabBarActiveTintColor: COLORS.primary || '#B94F2D',
          tabBarInactiveTintColor:
            COLORS.secondaryText || '#81766F',
          tabBarShowLabel: true,

          tabBarStyle: {
            backgroundColor:
              COLORS.cream || COLORS.background || '#FBF6F0',
            borderTopColor: COLORS.border || '#E9DDD2',
            borderTopWidth: StyleSheet.hairlineWidth,
            height: 58 + bottomInset,
            paddingTop: 5,
            paddingBottom: Math.max(bottomInset, 5),
            elevation: 8,
          },

          tabBarLabelStyle: {
            fontSize: 10,
            fontWeight: '600',
            marginTop: 1,
          },

          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? iconPair[1] : iconPair[0]}
              size={21}
              color={color}
            />
          ),
        };
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
      />

      <Tab.Screen
        name="Explore"
        component={ExploreStackScreen}
      />

      <Tab.Screen
  name="Saved"
  component={WishlistScreen}
  options={{
    title: 'Wishlist',
    tabBarLabel: 'Wishlist',
    tabBarIcon: ({ color, size, focused }) => (
      <Ionicons
        name={focused ? 'heart' : 'heart-outline'}
        size={size}
        color={color}
      />
    ),
  }}
/>

      {/* REAL CART SCREEN */}
      <Tab.Screen
        name="Bag"
        component={CartStackScreen}
        options={{
          tabBarLabel: 'Bag',
        }}
      />

      <Tab.Screen
  name="Account"
  component={AccountScreen}
  options={{
    tabBarLabel: 'Account',
    tabBarIcon: ({ color, size }) => (
      <Ionicons name="person-outline" size={size} color={color} />
    ),
  }}
/>
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  placeholder: {
    flex: 1,
    backgroundColor:
      COLORS.cream || COLORS.background || '#FBF6F0',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },

  title: {
    fontSize: 22,
    color: COLORS.text || '#28221F',
    fontWeight: '600',
    marginBottom: 8,
  },

  description: {
    fontSize: 14,
    color: COLORS.secondaryText || '#81766F',
  },
});
