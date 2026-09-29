import React from 'react';
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';

import styles from '../../styles/globalStyles';
// arrow function
const Homescreen = ({ navigation }) => {
  return (
    <ImageBackground
      source={{
        uri: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3',
      }}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0,0,0,0.45)',
          padding: 20,
        }}
      >
        <Text
          style={[
            styles.title,
            {
              fontFamily: 'sans-serif',
            },
          ]}
        >
          Student App
        </Text>

        <Text style={styles.subtitle}>
          Welcome to your Student Dashboard
        </Text>

        {/* Profile */}
        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            navigation.navigate('Student Section', {
              screen: 'Profile',
            })
          }
        >
          <Text style={styles.buttonText}>
            Go to Profile
          </Text>
        </TouchableOpacity>

        {/* Settings */}
        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            navigation.navigate('Student Section', {
              screen: 'Settings',
            })
          }
        >
          <Text style={styles.buttonText}>
            Go to Settings
          </Text>
        </TouchableOpacity>

        {/* Contact */}
        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            navigation.navigate('Student Section', {
              screen: 'Contact',
            })
          }
        >
          <Text style={styles.buttonText}>
            Go to Contact
          </Text>
        </TouchableOpacity>

      </View>
    </ImageBackground>
  );
};

export default Homescreen;