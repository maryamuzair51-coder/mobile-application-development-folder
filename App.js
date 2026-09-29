/* using separate js*/ 
/* import { View } from "react-native"; 
import HomeScreen from "./frontend/HomeScreen"; 
import ProfileScreen from "./frontend/ProfileScreen"; 
export default function App() { 
return ( 
<View> 
<HomeScreen /> 
<ProfileScreen /> 
</View> 
); 
}*/

/* using props in parent component 

import { View } from "react-native";

import HomeScreen from "./frontend/HomeScreen";
import ProfileScreen from "./frontend/ProfileScreen";

export default function App() {
  return (
    <View>
      <HomeScreen /* custom component
        name="Maryam Uzair"
        program="Mobile Application Development"
        semester={5}
      />

      <ProfileScreen
        university="Riphah Internation University "
        department="CS"
        city="Islamabad"
      />
    </View>
  );
}*/
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';

import StackNavigator from './frontend/navigation/StackNavigator';


// use state to manage the current screen
/*
const [screen, setScreen] = useState("home");

if (screen === "home") {
  return (
    <HomeScreen
      goToProfile={() => setScreen("profile")}
      goToSettings={() => setScreen("settings")}
      goToContact={() => setScreen("contact")}
    />
  );
}

if (screen === "profile") {
  return (
    <ProfileScreen
      goToHome={() => setScreen("home")}
    />
  );
}

if (screen === "settings") {
  return (
    <SettingsScreen
      goToHome={() => setScreen("home")}
    />
  );
}

if (screen === "contact") {
  return (
    <ContactScreen
      goToHome={() => setScreen("home")}
    />
  );
}
*/


// Main App
export default function App() {
  return (
    <NavigationContainer>
      <StackNavigator />
    </NavigationContainer>
  );
}