import React, { useState } from 'react';

import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

import styles from '../../styles/globalStyles';

const Profilescreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={styles.profileContainer}
      showsVerticalScrollIndicator={true}
    >

      {/* Profile Title */}
      <Text style={styles.screenTitle}>
        Profile Screen
      </Text>

      {/* Profile Image */}
      <Image
        source={{
          uri: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2',
        }}
        style={styles.profileImage}
      />

      {/* Name */}
      <Text style={styles.label}>
        Name
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Enter your name"
        value={name}
        onChangeText={setName}
        keyboardType="default"
        inputMode="text"
      />

      {/* Age */}
      <Text style={styles.label}>
        Age
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Enter your age"
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
        
      />

      {/* Live Information */}
      <View style={styles.infoContainer}>

        <Text style={styles.profilePreviewTitle}>
          Your Information
        </Text>

        <Text style={styles.liveText}>
          Name: {name}
        </Text>

        <Text style={styles.liveText}>
          Age: {age}
        </Text>

      </View>


      {/* Back to Home */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={styles.buttonText}>
          Back to Home
        </Text>
      </TouchableOpacity>

    </ScrollView>
  );
};

export default Profilescreen;