import React, { Component, useRef } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { StyleSheet, Alert, Pressable, View  } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import Pharmacies from './pharmacies/Pharmacies';
import ChatsList from './chat/ChatsList';
import Payments from './payments/Payments';
import { API } from '../config/config';

import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';

const Tab = createMaterialTopTabNavigator();

export default class Home extends Component {
	constructor(props) {
		super(props);
		const imPharmacy = this.props.route.params?.imPharmacy ?? false;
		this.state = { imPharmacy };
		this.toolbarMenu = React.createRef();
	}

	componentDidMount() {
		this.checkJwtToken();
		this.setupToolbarMenu();
	}

	logout() {
		SecureStore.deleteItemAsync('jwt')
			.then(() => {
				this.props.navigation.navigate('user-login');
			})
			.catch(error => console.error(error));
	}

	checkJwtToken() {
		SecureStore.getItemAsync('jwt')
			.then(jwt => {
				return fetch(
					this.state.imPharmacy 
					? `${API.URL}/api/pharmacies/me` 
					: `${API.URL}/api/users/me`, {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						'Authorization': `Bearer ${jwt}`,
					},
				});
			})
			.then(response => response.json())
			.then(json => {
				if (!('error' in json)) return;
				this.props.navigation.navigate('user-login');
				Alert.alert("Errore", "Sessione scaduta");
				return SecureStore.deleteItemAsync('jwt');
			})
			.catch(error => console.error(error));
	}

	setupToolbarMenu() {
		this.props.navigation.setOptions({
			headerRight: () => {
				return (
					<Menu
						ref={this.toolbarMenu}
						button={
							<View
								style={{ borderRadius: 20, overflow: 'hidden' }}>
								<Pressable
									android_ripple={{ color: 'gray' }}
									onPress={() => this.toolbarMenu.current.show()}>
									<MaterialCommunityIcons
										name="dots-vertical"
										size={24}
									/>
								</Pressable>
							</View>
						}>
						<MenuItem onPress={() => this.logout()}>Logout</MenuItem>
					</Menu>
				)
			}
		})
	}

	render() {
		return (
			<Tab.Navigator initialRouteName="Chat" >
				{ !this.state.imPharmacy && (
					<Tab.Screen name="pharmacies" component={Pharmacies}
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
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
	},
});
