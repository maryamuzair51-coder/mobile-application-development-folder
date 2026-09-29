import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import DrawerNavigator from './DrawerNavigator';

const Stack = createNativeStackNavigator();

export default function StackNavigator() {
  return (
    <Stack.Navigator>

      <Stack.Screen
        name="Main"
        component={DrawerNavigator}
        options={{
          headerShown: false,
        }}
      />

    </Stack.Navigator>
  );
}