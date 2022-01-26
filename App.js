import React, { Component } from 'react';
import { StatusBar, SafeAreaView, StyleSheet } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import * as SplashScreen from 'expo-splash-screen';
import { enableScreens } from 'react-native-screens';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';
import { ThemeManager, Colors } from 'react-native-ui-lib';
import { SocketContextProvider } from './components/SocketContext';
import PharmacyLogin from './components/auth/PharmacyLogin';
import UserRegister from './components/auth/UserRegister';
import UserLogin from './components/auth/UserLogin';
import Home from './components/Home';
import ChatRoom from './components/chat/ChatRoom';
import localUserData from './helpers/localUserData';
import AuthContext from './components/AuthContext';
import SendPayment from './components/payments/SendPayment';
import WebModal from './components/WebModal';
import { registerForPushNotificationsAsync } from './components/notification';
import * as Notifications from 'expo-notifications';

enableScreens();
const Stack = createNativeStackNavigator();

export default class App extends Component {

  constructor(props) {
    super(props);
    this.state = { isSignedIn: false, loading: true };
  }

  registerDefaultChannel() {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  componentDidMount() {
    SplashScreen.preventAutoHideAsync()
      .then(() => localUserData.load())
      .then(data => {
        this.setState({ loading: false, isSignedIn: !!data?.accessToken, localUser: data });
        this.registerDefaultChannel();
        registerForPushNotificationsAsync(data.accessToken)
          .then((res) => res.json())
          .then((json) => console.log(json))
        Notifications.addNotificationReceivedListener(notification => {
          console.log(notification);
        });
        return SplashScreen.hideAsync()
      })
      .catch(error => console.error(error));
  }

  render() {
    if (this.state.loading) return null;
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar />
        <NavigationContainer theme={MyCodaTheme}>
          <AuthContext.Provider value={{
            signIn: localUser => { this.setState({ isSignedIn: true, localUser }); },
            signOut: () => { this.setState({ isSignedIn: false }); }
          }}>
            {!this.state.isSignedIn ? (
              <>
                <Stack.Navigator
                  screenOptions={{ headerHideShadow: true, headerTopInsetEnabled: false, headerShown: false }}>
                  <Stack.Screen name="user-login" component={UserLogin} />
                  <Stack.Screen name="user-register" component={UserRegister} />
                  <Stack.Screen name="pharmacy-login" component={PharmacyLogin} />
                </Stack.Navigator>
              </>
            ) : (
              <>
                <SocketContextProvider>
                  <Stack.Navigator screenOptions={{ headerHideShadow: true, headerTopInsetEnabled: false }}>
                    <Stack.Screen name="home" component={Home}
                      initialParams={{ localUser: this.state.localUser }}
                      options={{ headerHideBackButton: true, headerTitle: "MyCoda" }}
                    />
                    <Stack.Screen name="chat-room" component={ChatRoom}
                      initialParams={{ localUser: this.state.localUser }}
                      options={({ route }) => ({ title: route.params.name })}
                    />
                    <Stack.Screen name="send-payment" component={SendPayment}
                      initialParams={{ localUser: this.state.localUser }}
                      options={{ headerTitle: "Invia pagamento" }}
                    />
                    <Stack.Screen name="paypal-web-modal" component={WebModal}
                      options={{ presentation: 'modal', headerTitle: 'Pagamento' }}
                    />
                  </Stack.Navigator>
                </SocketContextProvider>
              </>
            )}
          </AuthContext.Provider>
        </NavigationContainer>
      </SafeAreaView>
    );
  }
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
    primary: '#45C476',
  },
};

Colors.loadColors({
  primaryColor: '#45C476',
  secondaryColor: '#81C3D7',
  textColor: '#E08E45',
  errorColor: '#E63B2E',
  successColor: '#ADC76F',
  warnColor: '##FF963C',
});

ThemeManager.setComponentTheme('TextField', {
  underlineColor: { default: '#d3d3d3', error: 'red', focus: '#45C476', disabled: 'gray' }
});
