import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { enableScreens } from 'react-native-screens';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';
import { HeaderBackButton } from '@react-navigation/stack';
import { StyleSheet, Text, View } from 'react-native';
import { ThemeManager } from 'react-native-ui-lib';
import Register from './components/Register';
import Login from './components/Login';
import Home from './components/Home';
import ChatRoom from './components/chat/ChatRoom';

enableScreens();
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer theme={MyCodaTheme}>
      <Stack.Navigator 
        initialRouteName="login"
        screenOptions={{ headerHideShadow: true }}>
        <Stack.Screen 
          name="register" 
          component={Register}
          options={{ headerShown: false }} />
        <Stack.Screen 
          name="login" 
          component={Login}
          options={{ headerShown: false }} />
        <Stack.Screen 
          name="home" 
          component={Home}
          options={{ 
            headerHideBackButton: true, 
            headerTitle: "MyCoda" 
          }}/>
        <Stack.Screen
          name="chat-room"
          component={ChatRoom}
          options={({ route }) => ({ 
            title: route.params.name 
          })} />
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
