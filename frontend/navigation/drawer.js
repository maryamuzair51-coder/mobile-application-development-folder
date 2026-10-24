
// ============================================
// MODEVA MAIN DRAWER NAVIGATION
// File: frontend/navigation/drawer.js
// ============================================

import React, { useState } from 'react';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';

import { createDrawerNavigator,DrawerContentScrollView,} from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';

import BottomTabs from './bottom';
import { COLORS as C } from '../../styling/theme';

const Drawer = createDrawerNavigator();

// ============================================
// CUSTOM DRAWER CONTENT
// ============================================

function CustomDrawerContent({ navigation, state, ...props }) {
  const [categoriesExpanded, setCategoriesExpanded] = useState(false);

  // Read the active drawer route.
  const activeDrawerRoute = state.routes[state.index];

  // Read the active bottom tab and nested stack screen.
  const bottomState = activeDrawerRoute?.state;
  const activeTabRoute = bottomState?.routes?.[bottomState.index];
  const activeTab = activeTabRoute?.name;
//?. optional chaining
  const exploreState = activeTabRoute?.state;
  const activeExploreScreen =
    exploreState?.routes?.[exploreState.index]?.name;

  const categoryScreens = ['Accessories', 'Clothing', 'Makeup'];
  const isCategoryActive = categoryScreens.includes(activeExploreScreen);

  // Navigate to a bottom tab by its actual registered name.
  const openTab = (tabName) => {
    navigation.navigate('Shop', {
      screen: tabName,
    });

    navigation.closeDrawer();
  };

  // Navigate to a screen inside the Explore stack.
  
const openCategory = (screenName) => {
  navigation.navigate('Shop', {
    screen: 'Explore',
    params: {                 //params is short for parameters.
    screen: screenName,
    },
  });

  // Close the Categories submenu.
  setCategoriesExpanded(false);

  // Close the drawer.
  navigation.closeDrawer();
};


  // Shop opens the Home tab.
  const openShop = () => openTab('Home');

  // My Orders opens the Bag tab.
  const openOrders = () => openTab('Bag');

  // Settings opens the Account tab.
  const openSettings = () => openTab('Account');

  // Confirm sign out before returning to Splash.
  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: () => {
            // Return to the root Splash screen.
            const rootNavigation = navigation.getParent()?.getParent();

            if (rootNavigation) {
              rootNavigation.reset({
                index: 0,
                routes: [{ name: 'Splash' }],
              });
            }  else {
            // Fallback: try navigating to Splash directly.
            navigation.navigate('Splash');
            }
          },
        },
      ]
    );
  };

  // Reusable category row.
  const renderCategory = (label, screenName) => {
    const selected = activeExploreScreen === screenName;

    return (
      <TouchableOpacity
        key={screenName}
        style={[
          styles.submenuItem,
          selected && styles.activeSubmenuItem,
        ]}
        onPress={() => openCategory(screenName)}
        activeOpacity={0.75}
      >
        <View
          style={[
            styles.submenuDot,
            selected && styles.activeSubmenuDot,
          ]}
        />

        <Text
          style={[
            styles.submenuLabel,
            selected && styles.activeSubmenuLabel,
          ]}
        >
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  // Shop is active on Home and other non-category tabs.
  const isShopActive =
    activeTab === 'Home' ||
    (!isCategoryActive &&
      activeTab !== 'Bag' &&
      activeTab !== 'Account' &&
      activeTab !== 'Saved');

  return (
    <View style={styles.drawerContainer}>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={styles.drawerScrollContent}
      >
        {/* Brand header */}
        <View style={styles.drawerHeader}>
          <View style={styles.logoCircle}>
            <Ionicons
              name="bag-handle-outline"
              size={27}
              color={C.white}
            />
          </View>

          <Text style={styles.drawerBrand}>MODEVA</Text>

          <Text style={styles.drawerTagline}>
            STYLE THAT SPEAKS.
          </Text>
        </View>

        {/* Shop */}
        <TouchableOpacity
          style={[
            styles.menuItem,
            isShopActive && styles.activeMenuItem,
          ]}
          onPress={openShop}
          activeOpacity={0.75}
        >
          <Ionicons
            name="home-outline"
            size={22}
            color={isShopActive ? C.primary : C.text}
          />

          <Text
            style={[
              styles.menuLabel,
              isShopActive && styles.activeMenuLabel,
            ]}
          >
            Shop
          </Text>

          <Ionicons
            name="chevron-forward"
            size={18}
            color={C.muted}
          />
        </TouchableOpacity>

        {/* Expandable Categories */}
        <TouchableOpacity
          style={[
            styles.menuItem,
            (categoriesExpanded || isCategoryActive) &&
              styles.activeMenuItem,
          ]}
          onPress={() =>
            setCategoriesExpanded((previous) => !previous)
          }
          activeOpacity={0.75}
        >
          <Ionicons
            name="grid-outline"
            size={22}
            color={
              categoriesExpanded || isCategoryActive ? C.primary: C.text
            }
          />

          <Text
            style={[
              styles.menuLabel,
              (categoriesExpanded || isCategoryActive) &&
                styles.activeMenuLabel,
            ]}
          >
            Categories
          </Text>

          <Ionicons
            name={categoriesExpanded ? 'remove' : 'add'}
            size={23}
            color={C.primary}
          />
        </TouchableOpacity>

        {/* Category submenu */}
        {categoriesExpanded && (
          <View style={styles.submenu}>
            {renderCategory('Accessories', 'Accessories')}
            {renderCategory('Makeup', 'Makeup')}
            {renderCategory('Clothing', 'Clothing')}
          </View>
        )}

        {/* My Orders opens the Bag tab */}
        <TouchableOpacity
          style={[
            styles.menuItem,
            activeTab === 'Bag' && styles.activeMenuItem,
          ]}
          onPress={openOrders}
          activeOpacity={0.75}
        >
          <Ionicons
            name="bag-outline"
            size={22}
            color={activeTab === 'Bag' ? C.primary : C.text}
          />

          <Text
            style={[
              styles.menuLabel,
              activeTab === 'Bag' && styles.activeMenuLabel,
            ]}
          >
            My Orders
          </Text>

          <Ionicons
            name="chevron-forward"
            size={18}
            color={C.muted}
          />
        </TouchableOpacity>

        {/* Settings opens the Account tab */}
        <TouchableOpacity
          style={[
            styles.menuItem,
            activeTab === 'Account' && styles.activeMenuItem,
          ]}
          onPress={openSettings}
          activeOpacity={0.75}
        >
          <Ionicons
            name="settings-outline"
            size={22}
            color={activeTab === 'Account' ? C.primary : C.text}
          />

          <Text
            style={[
              styles.menuLabel,
              activeTab === 'Account' && styles.activeMenuLabel,
            ]}
          >
            Settings
          </Text>

          <Ionicons
            name="chevron-forward"
            size={18}
            color={C.muted}
          />
        </TouchableOpacity>
      </DrawerContentScrollView>

      {/* Fixed sign-out footer */}
      <View style={styles.drawerFooter}>
        <View style={styles.footerDivider} />

        <TouchableOpacity
          style={styles.signOutButton}
          onPress={handleSignOut}
          activeOpacity={0.75}
        >
          <Ionicons
            name="log-out-outline"
            size={22}
            color={C.error}
          />

          <Text style={styles.signOutLabel}>Sign Out</Text>
        </TouchableOpacity>

        <Text style={styles.footerBrand}>
          MODEVA · STYLE THAT SPEAKS.
        </Text>
      </View>
    </View>
  );
}

// ============================================
// MAIN DRAWER NAVIGATOR
// ============================================

export default function MainDrawer() {
  return (
    <Drawer.Navigator
      initialRouteName="Shop"
      drawerContent={(props) => (
        <CustomDrawerContent {...props} />
      )}
      screenOptions={{
        headerShown: false,
        drawerActiveTintColor: C.primary,
        drawerInactiveTintColor: C.text,
        drawerActiveBackgroundColor: C.primaryLight,
        drawerStyle: {
          backgroundColor: C.background,
          width: 285,
        },
        drawerItemStyle: {
          display: 'none',
        },
        drawerLabelStyle: {
          display: 'none',
        },
      }}
    >
      <Drawer.Screen
        name="Shop"
        component={BottomTabs}
      />
    </Drawer.Navigator>
  );
}

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    backgroundColor: C.background,
  },

  drawerScrollContent: {
    paddingHorizontal: 12,
    paddingBottom: 15,
  },

  drawerHeader: {
    alignItems: 'center',
    paddingTop: 32,
    paddingBottom: 27,
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },

  logoCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: C.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 13,
  },

  drawerBrand: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 4,
    color: C.primary,
  },

  drawerTagline: {
    fontSize: 10,
    letterSpacing: 2,
    color: C.muted,
    marginTop: 7,
  },

  menuItem: {
    minHeight: 53,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    marginBottom: 5,
    borderRadius: 12,
    gap: 13,
  },

  activeMenuItem: {
    backgroundColor: C.primaryLight,
  },

  menuLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: C.text,
  },

  activeMenuLabel: {
    fontWeight: '700',
    color: C.primary,
  },

  submenu: {
    marginLeft: 25,
    marginRight: 6,
    marginBottom: 8,
    paddingLeft: 12,
    borderLeftWidth: 1.5,
    borderLeftColor: C.primaryLight,
  },

  submenuItem: {
    minHeight: 43,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 12,
    paddingRight: 8,
    borderRadius: 8,
    gap: 13,
  },

  activeSubmenuItem: {
    backgroundColor: C.primaryLight,
  },

  submenuDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: C.muted,
  },

  activeSubmenuDot: {
    backgroundColor: C.primary,
  },

  submenuLabel: {
    fontSize: 14,
    color: C.text,
  },

  activeSubmenuLabel: {
    fontWeight: '700',
    color: C.primary,
  },

  drawerFooter: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 20,
  },

  footerDivider: {
    height: 1,
    backgroundColor: C.border,
    marginBottom: 13,
  },

  signOutButton: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 7,
    gap: 13,
  },

  signOutLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: C.error,
  },

  footerBrand: {
    marginTop: 12,
    textAlign: 'center',
    fontSize: 9,
    letterSpacing: 1.3,
    color: C.muted,
  },
});
