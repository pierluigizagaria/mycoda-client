import React from 'react';
import { StatusBar, SafeAreaView, StyleSheet  } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { enableScreens } from 'react-native-screens';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';
import { ThemeManager } from 'react-native-ui-lib';
import { SocketContextProvider } from './components/SocketContext';
import PharmacyLogin from './components/auth/PharmacyLogin';
import UserRegister from './components/auth/UserRegister';
import UserLogin from './components/auth/UserLogin';
import Home from './components/Home';
import ChatRoom from './components/chat/ChatRoom';

enableScreens();
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar/>
      <SocketContextProvider>
        <NavigationContainer theme={MyCodaTheme}>
          <Stack.Navigator 
            screenOptions={{ headerHideShadow: true, headerTopInsetEnabled: false }}>
            <Stack.Screen 
              name="user-login" 
              component={UserLogin}
              options={{ headerShown: false }} />
            <Stack.Screen
              name="user-register"
              component={UserRegister}
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
                headerTitle: "MyCoda",
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

const MyCodaTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#FF2D00',
  },
};

ThemeManager.setComponentTheme('TextField', {
  errorColor: '#ff0033',
  underlineColor: { default: '#d3d3d3', error: 'red', focus: '#FF2D00', disabled: 'gray' }
});
