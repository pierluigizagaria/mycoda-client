import React, { Component, useRef } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { StyleSheet, Alert, Pressable, View  } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import PharmaciesList from './pharmacies/PharmaciesList';
import ChatsList from './chat/ChatsList';
import Payments from './payments/Payments';
import { API } from '../config/config';
import userData from '../helpers/userData';

import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';

const Tab = createMaterialTopTabNavigator();

export default class Home extends Component {
	constructor(props) {
		super(props);
		this.state = { loggedAsPharmacy: false };
		this.toolbarMenu = React.createRef();
	}

	componentDidMount() {
		userData.load(data => 
			data.type === 'pharmacy' ?? this.setState({ loggedAsPharmacy: true}),
		)
		this.checkJwtToken();
		this.setupToolbarMenu();
	}

	logout() {
		userData.delete()
			.then(() => {
				this.props.navigation.navigate('user-login');
			})
			.catch(error => console.error(error));
	}

	checkJwtToken() {
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
				return userData.delete();
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
				{ !this.state.loggedAsPharmacy && (
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
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
	},
});
