import React, { Component } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { StyleSheet } from 'react-native';
import Pharmacies from './pharmacies/Pharmacies';
import Chats from './chat/Chats';
import Payments from './payments/Payments';

const Tab = createMaterialTopTabNavigator();

export default class Home extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		return (
			<Tab.Navigator initialRouteName="Chat" >
				<Tab.Screen name="pharmacies" component={Pharmacies} 
					options={{ title: "Farmacie" }}
				/>
				<Tab.Screen name="chats" component={Chats}
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
