
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { Ionicons } from '@expo/vector-icons';

// Import screens used in the tabs
import ProfileScreen from '../screen/Profilescreen';
import SettingsScreen from '../screen/Settingscreen';
import ContactScreen from '../screen/contact';

// Create the Tab Navigator
const Tab = createBottomTabNavigator();

export default function TabNavigator() {

  return (

    <Tab.Navigator

      // screenOptions applies common settings to all tabs
      screenOptions={({ route }) => ({

        // Hide the header at the top of the screen
        headerShown: false,

        // Function used to display an icon for each tab
        tabBarIcon: ({ focused, color, size }) => {

          // Variable to store the icon name
          let iconName;

          // If the current tab is Profile
          if (route.name === 'Profile') {

            // Show filled person icon when selected
            // Show outline person icon when not selected
            iconName = focused
              ? 'person' : 'person-outline';
          }

          // If the current tab is Settings
          else if (route.name === 'Settings') {

            // Show filled settings icon when selected
            // Show outline settings icon when not selected
            iconName = focused
              ? 'settings'
              : 'settings-outline';
          }

          // If the current tab is Contact
          else if (route.name === 'Contact') {

            // Show filled mail icon when selected
            // Show outline mail icon when not selected
            iconName = focused
              ? 'mail'
              : 'mail-outline';
          }

          // Return the Ionicons component
          return (
            <Ionicons
              name={iconName}
              size={size}
              color={color}
            />
          );
        },

        // Color of the selected tab
        tabBarActiveTintColor: '#2f80ed',

        // Color of the unselected tabs
        tabBarInactiveTintColor: 'gray',
      })}
    >

      {/* Profile Tab */}
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
      />

      {/* Settings Tab */}
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
      />

      {/* Contact Tab */}
      <Tab.Screen
        name="Contact"
        component={ContactScreen}
      />

    </Tab.Navigator>
  );
}
