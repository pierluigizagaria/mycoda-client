import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { StyleSheet, Text, View } from 'react-native';
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
				<Tab.Screen name="Pharmacies" component={Pharmacies} 
					options={{ title: "Farmacie" }}
				/>
				<Tab.Screen name="Chat" component={Chats} 
					options={{ title: "Chat" }}
				/>
				<Tab.Screen name="Payments" component={Payments} 
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
