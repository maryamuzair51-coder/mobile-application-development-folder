
// frontend/screens/accountScreen.js

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  StatusBar,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Shared authentication context
// Adjust this path if your context file is in another folder.
import { useAuthModal } from '../components/authModalContext';
import { COLORS as C } from '../../styling/theme';

export default function AccountScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  // Get the real login state and user details from the shared provider.
  const {currentUser,isLoggedIn,openAuthModal,logout,} = useAuthModal();

  // Navigate back to Home.
  const goHome = () => {
    navigation.navigate('Home');
  };

  // Open another screen registered in your navigation.
  //like cart or wishlist
  const openScreen = (screenName) => {
    try {
      navigation.navigate(screenName);
    } catch (error) {
      Alert.alert(
        'Screen unavailable',
        `${screenName} is not connected to navigation yet.`
      );
    }
  };

  // Show the currently logged-in user's profile information.
  const showPersonalInformation = () => {
    if (!isLoggedIn || !currentUser) {
      openAuthModal();
      return;
    }

    Alert.alert(
      'Personal Information',
      `Name: ${currentUser.name}\nEmail: ${currentUser.email}`,
      [{ text: 'OK' }]
    );
  };

  
  
  // Sign out and return to the root Splash screen.
  const handleLogout = () => {
    if (!isLoggedIn) {
      openAuthModal();
      return;
    }

    Alert.alert(
      'Sign Out',
      'Would you like to sign out of MODEVA?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: () => {
            // Clear the current authentication state.
            logout();

            // Find the root navigator containing Splash.
            let rootNavigation = navigation;

            while (rootNavigation.getParent()) {
              rootNavigation = rootNavigation.getParent();
            }

            // Reset navigation so the user returns to Splash.
            rootNavigation.reset({
              index: 0,
              routes: [{ name: 'Splash' }],
            });
          },
        },
      ],
    );
  };


  // Demo tracking information. Replace this with real order data later.
  const showTrackingDetails = () => {
    Alert.alert(
      'Parcel Tracking',
      'Order Number: SE102456\n' +
        'Courier: MODEVA Delivery\n' +
        'Tracking Number: SE-TRK-102456\n' +
        'Parcel Status: Processing\n' +
        'Estimated Delivery: 3–5 business days\n\n' +
        'Note: These are sample tracking details.',
      [{ text: 'OK' }]
    );
  };

  // Account menu items.
  const menuItems = [
    {
      title: 'Personal Information',
      subtitle: 'View your name and contact details',
      icon: 'person-outline',
      action: showPersonalInformation,
    },
    {
      title: 'My Addresses',
      subtitle: 'Manage your delivery addresses',
      icon: 'location-outline',
      action: () =>
        Alert.alert(
          'My Addresses',
          'Your delivery address management can be connected here.'
        ),
    },
    {
      title: 'Payment Methods',
      subtitle: 'Manage your payment preferences',
      icon: 'card-outline',
      action: () =>
        Alert.alert(
          'Payment Methods',
          'Your payment options can be connected here.'
        ),
    },
    {
      title: 'Notifications',
      subtitle: 'Stay updated on your orders',
      icon: 'notifications-outline',
      action: () =>
        Alert.alert(
          'Notifications',
          'Your notification settings can be connected here.'
        ),
    },
    {
      title: 'Help & Support',
      subtitle: 'FAQs and assistance',
      icon: 'help-circle-outline',
      action: () =>
        Alert.alert(
          'Help & Support',
          'Contact MODEVA support for assistance.'
        ),
    },
    {
      title: 'Settings',
      subtitle: 'App preferences and privacy',
      icon: 'settings-outline',
      action: () => openScreen('Settings'),
    },
  ];

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: Math.max(insets.top, 8),
        },
      ]}
    >
      <StatusBar
        barStyle="dark-content"
        backgroundColor={C.background}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          paddingBottom: Math.max(insets.bottom, 20) + 20,
        }}
      >
        {/* Back to Home button */}
        <TouchableOpacity
          style={styles.backHomeButton}
          activeOpacity={0.75}
          onPress={goHome}
        >
          <Ionicons
            name="arrow-back"
            size={18}
            color={C.primary}
          />
          <Text style={styles.backHomeText}>
            Back to Home
          </Text>
        </TouchableOpacity>

        {/* Account page heading */}
        <View style={styles.header}>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>
              My Account
            </Text>
            <Text style={styles.headerSubtitle}>
              Your shopping, all in one place
            </Text>
          </View>

          <TouchableOpacity
            style={styles.headerIcon}
            onPress={() => openScreen('Settings')}
            accessibilityRole="button"
            accessibilityLabel="Open settings"
          >
            <Ionicons
              name="settings-outline"
              size={23}
              color={C.text}
            />
          </TouchableOpacity>
        </View>

        {/* Profile card: displays real user details after login */}
        <View style={styles.profileCard}>
          <View style={styles.profileTop}>
            <View style={styles.avatar}>
              <Ionicons
                name="person"
                size={34}
                color={C.primary}
              />
            </View>

            <View style={styles.profileInfo}>
              <Text style={styles.welcome}>
                {isLoggedIn ? 'WELCOME BACK' : 'WELCOME TO'}
              </Text>

              <Text
                style={styles.profileName}
                numberOfLines={2}
              >
                {isLoggedIn
                  ? currentUser?.name || 'MODEVA Customer'
                  : 'MODEVA'}
              </Text>

              <Text style={styles.profileDescription}>
                {isLoggedIn
                  ? currentUser?.email || ''
                  : 'Sign in for a more personal experience'}
              </Text>
            </View>
          </View>

          {/* Show the login button only when logged out */}
          {!isLoggedIn && (
            <TouchableOpacity
              style={styles.signInButton}
              activeOpacity={0.85}
              onPress={() => openAuthModal()}
            >
              <Text style={styles.signInText}>
                Sign In / Create Account
              </Text>
              <Ionicons
                name="arrow-forward"
                size={18}
                color={C.white}
              />
            </TouchableOpacity>
          )}
        </View>

        {/* Shopping shortcuts */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            My Shopping
          </Text>
          <Text style={styles.sectionHint}>
            Quick access
          </Text>
        </View>

        <View style={styles.quickLinks}>
          {/* Orders */}
          <TouchableOpacity
            style={styles.quickCard}
            activeOpacity={0.8}
            onPress={() => openScreen('Bag')}
          >
            <View
              style={[
                styles.quickIcon,
                { backgroundColor: C.primaryLight },
              ]}
            >
              <Ionicons
                name="receipt-outline"
                size={24}
                color={C.primary}
              />
            </View>

            <Text style={styles.quickTitle}>
              My Orders
            </Text>
            <Text style={styles.quickSubtitle}>
              View purchases
            </Text>
          </TouchableOpacity>

          {/* Order tracking */}
          <TouchableOpacity
            style={styles.quickCard}
            activeOpacity={0.8}
            onPress={showTrackingDetails}
          >
            <View
              style={[
                styles.quickIcon,
                { backgroundColor: '#E7EFE5' },
              ]}
            >
              <Ionicons
                name="cube-outline"
                size={24}
                color={C.green}
              />
            </View>

            <Text style={styles.quickTitle}>
              Track Order
            </Text>
            <Text style={styles.quickSubtitle}>
              Delivery status
            </Text>
          </TouchableOpacity>

          {/* Wishlist */}
          <TouchableOpacity
            style={styles.quickCard}
            activeOpacity={0.8}
            onPress={() => openScreen('Saved')}
          >
            <View
              style={[
                styles.quickIcon,
                { backgroundColor: '#F8E8E4' },
              ]}
            >
              <Ionicons
                name="heart-outline"
                size={24}
                color={C.primary}
              />
            </View>

            <Text style={styles.quickTitle}>
              Wishlist
            </Text>
            <Text style={styles.quickSubtitle}>
              Saved items
            </Text>
          </TouchableOpacity>
        </View>

        {/* Account settings */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            Account Settings
          </Text>
        </View>

        <View style={styles.menuCard}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={item.title}
              style={[
                styles.menuItem,
                index !== menuItems.length - 1 &&
                  styles.menuItemBorder,
              ]}
              activeOpacity={0.7}
              onPress={item.action}
            >
              <View style={styles.menuIcon}>
                <Ionicons
                  name={item.icon}
                  size={22}
                  color={C.primary}
                />
              </View>

              <View style={styles.menuText}>
                <Text style={styles.menuTitle}>
                  {item.title}
                </Text>
                <Text style={styles.menuSubtitle}>
                  {item.subtitle}
                </Text>
              </View>

              <Ionicons
                name="chevron-forward"
                size={19}
                color={C.muted}
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Sign in or sign out depending on current session */}
        <TouchableOpacity
          style={styles.logoutButton}
          activeOpacity={0.7}
          onPress={handleLogout}
        >
          <Ionicons
            name={isLoggedIn ? 'log-out-outline' : 'log-in-outline'}
            size={21}
            color={C.primary}
          />
          <Text style={styles.logoutText}>
            {isLoggedIn ? 'Sign Out' : 'Sign In'}
          </Text>
        </TouchableOpacity>

        {/* App footer */}
        <Text style={styles.versionText}>
          MODEVA · Your everyday shopping companion
        </Text>
      </ScrollView>
    </View>
  );
}

// Styles for the Account screen
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.background,
  },

  backHomeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginTop: 8,
    marginHorizontal: 20,
    marginBottom: 4,
    paddingVertical: 9,
    paddingHorizontal: 13,
    backgroundColor: C.primaryLight,
    borderRadius: 12,
    gap: 8,
  },

  backHomeText: {
    color: C.primary,
    fontSize: 13,
    fontWeight: '700',
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 22,
  },

  headerTextContainer: {
    flex: 1,
  },

  headerTitle: {
    fontSize: 27,
    fontWeight: '800',
    color: C.text,
    letterSpacing: -0.5,
  },

  headerSubtitle: {
    fontSize: 13,
    color: C.muted,
    marginTop: 5,
  },

  headerIcon: {
    width: 44,
    height: 44,
    borderRadius: 15,
    backgroundColor: C.white,
    borderWidth: 1,
    borderColor: C.border,
    justifyContent: 'center',
    alignItems: 'center',
  },

  profileCard: {
    backgroundColor: C.white,
    marginHorizontal: 20,
    padding: 18,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: C.border,
  },

  profileTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  avatar: {
    width: 68,
    height: 68,
    borderRadius: 23,
    backgroundColor: C.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },

  profileInfo: {
    flex: 1,
    marginLeft: 14,
  },

  welcome: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.5,
    color: C.primary,
  },

  profileName: {
    fontSize: 23,
    fontWeight: '800',
    color: C.text,
    marginTop: 3,
  },

  profileDescription: {
    fontSize: 11,
    color: C.muted,
    marginTop: 4,
    lineHeight: 16,
  },

  signInButton: {
    marginTop: 19,
    backgroundColor: C.primary,
    minHeight: 49,
    borderRadius: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 9,
  },

  signInText: {
    color: C.white,
    fontSize: 14,
    fontWeight: '700',
  },

  sectionHeader: {
    marginHorizontal: 20,
    marginTop: 27,
    marginBottom: 13,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: C.text,
  },

  sectionHint: {
    fontSize: 12,
    color: C.muted,
  },

  quickLinks: {
    flexDirection: 'row',
    marginHorizontal: 20,
    gap: 10,
  },

  quickCard: {
    flex: 1,
    minWidth: 0,
    backgroundColor: C.white,
    borderRadius: 18,
    paddingHorizontal: 10,
    paddingVertical: 15,
    borderWidth: 1,
    borderColor: C.border,
  },

  quickIcon: {
    width: 43,
    height: 43,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },

  quickTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: C.text,
  },

  quickSubtitle: {
    fontSize: 10,
    color: C.muted,
    marginTop: 5,
    lineHeight: 14,
  },

  menuCard: {
    backgroundColor: C.white,
    marginHorizontal: 20,
    borderRadius: 20,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: C.border,
  },

  menuItem: {
    minHeight: 76,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },

  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },

  menuIcon: {
    width: 43,
    height: 43,
    borderRadius: 14,
    backgroundColor: '#FBF1E9',
    alignItems: 'center',
    justifyContent: 'center',
  },

  menuText: {
    flex: 1,
  },

  menuTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: C.text,
  },

  menuSubtitle: {
    fontSize: 11,
    color: C.muted,
    marginTop: 4,
    lineHeight: 15,
  },

  logoutButton: {
    marginHorizontal: 20,
    marginTop: 22,
    height: 52,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: C.border,
    backgroundColor: C.white,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 9,
  },

  logoutText: {
    color: C.primary,
    fontSize: 14,
    fontWeight: '700',
  },

  versionText: {
    fontSize: 11,
    color: C.muted,
    textAlign: 'center',
    marginTop: 19,
    marginHorizontal: 20,
  },
});
