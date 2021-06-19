import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { enableScreens } from 'react-native-screens';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';
import { ThemeManager } from 'react-native-ui-lib';
import { SocketContextProvider } from './components/SocketContext';
import PharmacyLogin from './components/PharmacyLogin';
import UserRegister from './components/UserRegister';
import UserLogin from './components/UserLogin';
import Home from './components/Home';
import ChatRoom from './components/chat/ChatRoom';

enableScreens();
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SocketContextProvider>
      <NavigationContainer theme={MyCodaTheme}>
        <Stack.Navigator 
          initialRouteName="user-login"
          screenOptions={{ headerHideShadow: true }}>
          <Stack.Screen 
            name="user-register" 
            component={UserRegister}
            options={{ headerShown: false }} />
          <Stack.Screen 
            name="user-login" 
            component={UserLogin}
            options={{ headerShown: false }} />
          <Stack.Screen
            name="pharmacy-login"
            component={PharmacyLogin}
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
    </SocketContextProvider>
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
