import React, { useState } from 'react';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import styles from '../../styles/globalStyles';

const Contactscreen = ({ navigation }) => {

  const [email, setEmail] = useState('');

  // Submit button
  const handleSubmit = () => {

    if (email.trim() === '') {
      Alert.alert(
        'Error',
        'Please enter your email address.'
      );
      return;
    }

    Alert.alert(
      'Success',
      'Your email has been submitted!'
    );

    setEmail('');
  };

  return (
    <View style={styles.contactContainer}>

      {/* Title */}
      <Text style={styles.screenTitle}>
        Contact Screen
      </Text>

      {/* Email Input */}
      <View style={styles.emailInputContainer}>

        <Ionicons
          name="mail-outline"
          size={24}
          color="#555555"
          style={styles.emailIcon}
        />

        <TextInput
          style={styles.emailInput}
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          inputMode="email"
          autoCapitalize="none"
        />

      </View>

      {/* Submit Button */}
      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleSubmit}
        activeOpacity={0.8}
      >
        <Text style={styles.submitButtonText}>
          Submit
        </Text>
      </TouchableOpacity>

      {/* Back to Home */}
<TouchableOpacity
  style={styles.backHomeButton}
  onPress={() => {
    navigation.navigate('Home');
  }}
>
  <Text style={styles.backHomeButtonText}>
    Back to Home
  </Text>
</TouchableOpacity>

    </View>
  );
};

export default Contactscreen;