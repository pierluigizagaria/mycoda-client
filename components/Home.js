import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { StyleSheet  } from 'react-native';
import Pharmacies from './pharmacies/Pharmacies';
import ChatsList from './chat/ChatsList';
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
