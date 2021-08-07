import React, { useRef, useContext } from 'react';
import { StyleSheet, Alert, Pressable, View  } from 'react-native';
import { useNavigation } from '@react-navigation/core';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import PharmaciesList from './pharmacies/PharmaciesList';
import ChatsList from './chat/ChatsList';
import Payments from './payments/Payments';
import { API } from '../config/config';
import localUserData from '../helpers/localUserData';
import AuthContext from './AuthContext';

import Menu, { MenuItem } from 'react-native-material-menu';
import { useEffect } from 'react';

export default function Home({ route }) {

	const { localUser } = route.params;
	const { type: loginType, accessToken } = localUser;

	const navigation = useNavigation();

	const Tab = createMaterialTopTabNavigator();
	const toolbarMenu = useRef(null);
	const { signOut } = useContext(AuthContext);

	useEffect(() => {
		setupToolbarMenu();
		testJWTToken();
	}, []);

	const setupToolbarMenu = () => {
		navigation.setOptions({
			headerRight: () => {
				return (
					<Menu
						ref={toolbarMenu}
						button={
							<View
								style={{ borderRadius: 20, overflow: 'hidden' }}>
								<Pressable
									android_ripple={{ color: 'gray' }}
									onPress={() => toolbarMenu.current.show()}>
									<MaterialCommunityIcons name="dots-vertical" size={24}/>
								</Pressable>
							</View>
						}>
						<MenuItem onPress={deleteUserDataSignOut}>Logout</MenuItem>
					</Menu>
				)
			}
		})
	}

	const	testJWTToken = () => {
		fetch(loginType === 'pharmacy' ? `${API.URL}/api/pharmacies/me` : `${API.URL}/api/users/me`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${accessToken}`,
			},
		})
		.then(response => response.json())
		.then(json => {
			if (!('error' in json)) return;
			Alert.alert("Errore", "Sessione scaduta");
			deleteUserDataSignOut();
		})
		.catch(error => console.error(error));
	}

 const deleteUserDataSignOut = () => {
		localUserData.delete()
			.then(signOut)
			.catch(error => console.error(error));
	}

	return (
		<Tab.Navigator initialRouteName="chats" >
			{loginType === 'user' && (
				<Tab.Screen name="pharmacies" component={PharmaciesList}
					initialParams={{ localUser }}
					options={{ title: "Farmacie" }}
				/>
			)}
			<Tab.Screen name="chats" component={ChatsList}
				initialParams={{ localUser }}
				options={{ title: "Chat" }}
			/>
			<Tab.Screen name="payments" component={Payments}
				initialParams={{ localUser }}
				options={{ title: "Pagamenti" }}
			/>
		</Tab.Navigator>
	);
}
