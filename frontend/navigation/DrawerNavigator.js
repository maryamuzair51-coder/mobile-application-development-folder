import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';

import HomeScreen from '../screen/Homescreen';
import TabNavigator from './TabNavigator';

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  return (
     <Drawer.Navigator>

      <Drawer.Screen
        name="Home"
        component={HomeScreen}
      />

      <Drawer.Screen
        name="Student Section"
        component={TabNavigator}
      />

    </Drawer.Navigator>
  );
}