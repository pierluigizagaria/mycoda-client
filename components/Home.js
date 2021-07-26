import React, { useRef, useContext } from 'react';
import { StyleSheet, Alert, Pressable, View  } from 'react-native';
import { useNavigation } from '@react-navigation/core';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import PharmaciesList from './pharmacies/PharmaciesList';
import ChatsList from './chat/ChatsList';
import Payments from './payments/Payments';
import { API } from '../config/config';
import userData from '../helpers/userData';
import AuthContext from './AuthContext';

import Menu, { MenuItem } from 'react-native-material-menu';
import { useEffect } from 'react';

export default function Home({ route }) {

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
						<MenuItem onPress={() => clearDataSignOut()}>Logout</MenuItem>
					</Menu>
				)
			}
		})
	}

	const	testJWTToken = () => {
		userData.load()
			.then(data => {
				return fetch(
					data.type === 'pharmacy'
						? `${API.URL}/api/pharmacies/me`
						: `${API.URL}/api/users/me`, {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						'Authorization': `Bearer ${data.accessToken}`,
					},
				});
			})
			.then(response => response.json())
			.then(json => {
				if (!('error' in json)) return;
				Alert.alert("Errore", "Sessione scaduta");
				clearDataSignOut();
			})
			.catch(error => console.error(error));
	}

 const clearDataSignOut = () => {
		userData.delete()
			.then(() => {
				signOut();
			})
			.catch(error => console.error(error));
	}

	return (
		<Tab.Navigator initialRouteName="chats" >
			{!route.params.signedInAsPharmacy && (
				<Tab.Screen name="pharmacies" component={PharmaciesList}
					options={{ title: "Farmacie" }}
				/>
			)}
			<Tab.Screen name="chats" component={ChatsList}
				options={{ title: "Chat" }}
			/>
			<Tab.Screen name="payments" component={Payments}
				options={{ title: "Pagamenti" }}
			/>
		</Tab.Navigator>
	);
}
