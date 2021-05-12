import React from 'react';
import { NavigationContainer, DefaultTheme  } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet, Text, View } from 'react-native';
import { ThemeManager } from 'react-native-ui-lib';
import Register from './components/Register';
import Login from './components/Login';
import Home from './components/Home';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer theme={MyCodaTheme}>
      <Stack.Navigator initialRouteName="login" 
        screenOptions={{
          headerStyle: {
            elevation: 0,
            shadowOpacity: 0
          }
        }}
      >
        <Stack.Screen name="register" component={Register} 
          options={{ headerShown: false }} />
        <Stack.Screen name="login" component={Login} 
          options={{ headerShown: false }} />
				<Stack.Screen name="home" component={Home} 
          options={{ headerLeft: null, headerTitle: "MyCoda" }}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const MyCodaTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: 'rgb(255, 45, 25)',
  },
};

ThemeManager.setComponentTheme('TextField', {
  floatingPlaceholderColor: { default: 'black', error: 'red', focus: 'red', disabled: 'grey' }
});
