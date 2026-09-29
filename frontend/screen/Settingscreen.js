
import React, { useState } from 'react';
import {
  View,
  Text,
  Switch,
  TouchableOpacity,
  Alert,
} from 'react-native';

import styles from '../../styles/globalStyles';

const Settingsscreen = ({ navigation }) => {

  const [darkMode, setDarkMode] = useState(false);

  // Function to handle Dark Mode switch
  const handleDarkMode = (value) => {

    if (value) {

      setDarkMode(true);

      // Show an alert when Dark Mode is activated
      Alert.alert(
        'Dark Mode',
        'Dark mode is activated!'
      );
    }

    // If the user turns OFF Dark Mode
    else {

      Alert.alert(
        'Turn Off Dark Mode',
        'Are you sure you want to turn off Dark Mode?',
        [
          {
            text: 'No',
            style: 'cancel',
          },
          {
            text: 'Yes',
            onPress: () => setDarkMode(false),
          },
        ]
      );
    }
  };

  return (

    <View
      style={[
        styles.settingsContainer,

        // Change background color according to Dark Mode
        {
          backgroundColor: darkMode ? '#1e1e1e' : '#f5f7fa',
        },
      ]}
    >

      {/* Title of the Settings screen */}
      <Text
        style={[
          styles.screenTitle,

          // White title in Dark Mode and dark title in Light Mode
          {
            color: darkMode ? '#ffffff' : '#222222',
          },
        ]}
      >
        Settings
      </Text>

      <View
        style={[
          styles.darkModeContainer,
          {
            backgroundColor: darkMode ? '#333333' : '#ffffff',
          },
        ]}
      >
        <Text
          style={[
            styles.settingText,

            // Change text color according to Dark Mode
            {
              color: darkMode ? '#ffffff' : '#222222',
            },
          ]}
        >
          Dark Mode
        </Text>

        {/* Switch used to turn Dark Mode ON or OFF */}
        <Switch
          value={darkMode}
          onValueChange={handleDarkMode}
        />

      </View>

      <TouchableOpacity
        style={styles.backHomeButton}

        // Navigate to the Home screen when button is pressed
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={styles.backHomeButtonText}>
          Back to Home
        </Text>
      </TouchableOpacity>

    </View>
  );
};

export default Settingsscreen;
