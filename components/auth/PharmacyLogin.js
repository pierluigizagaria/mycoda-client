import React, { Component } from 'react';
import { Alert, ScrollView } from 'react-native';
import { CommonActions } from '@react-navigation/native';
import { View, TextField, Text, Button } from 'react-native-ui-lib';
import { API } from '../../config/config';
import userData from '../../helpers/userData';

export default class Login extends Component {
	constructor(props) {
		super(props);
		this.state = {
			pIva: '',
			password: '',
		};
	}

	login() {
		const options = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				piva: this.state.pIva,
				password: this.state.password,
			})
		};
		fetch(`${API.URL}/api/pharmacies/login`, options)
			.then((response) => response.json())
			.then((json) => {
				if ('error' in json) {
					Alert.alert("Errore", "Credenziali errate");
					return;
				}
				userData.save({
					email: json.email,
					id: json.pIva,
					businessName: json.ragSociale,
					address: json.indirizzo,
					telephone: json.numTel,
					type: 'pharmacy',
				},{
					accessToken: json.accessToken,
					refreshToken: json.refreshToken,
				})
				this.props.navigation.dispatch(
					CommonActions.reset({
						index: 0,
						routes: [{ name: 'home', params: { loggedAsPharmacy: true } }],
					})
				);
			})
			.catch((error) => console.error(error))
	}

	render() {
		return (
			<ScrollView>
				<View flex paddingH-25 paddingT-120 paddingH-30>
					<Text grey20 text10 marginT-10 marginB-70 center>MyCoda</Text>
					<Text grey20 text30 marginB-30>Farmacie</Text>
					<Text red30 text60 marginB-10>Partita IVA</Text>
					<TextField text70 dark10
						placeholder="Partita iva della farmacia"
						onChangeText={text => this.state.pIva = text}
					/>
					<Text red30 text60 marginB-10>Password</Text>
					<TextField text70 secureTextEntry dark10
						placeholder="Password"
						onChangeText={text => this.state.password = text}
					/>
					<View flex top>
						<Button text70 white background-red30 borderRadius={10} marginT-10
							label="Accedi"
							onPress={() => this.login()}
						/>
						<Button link text70 red30 marginT-20
							label="Come posso registrarmi?"
							onPress={() => alert('Schermata di informazioni su affiliamento al servizio.')}
						/>
						<View flex row bottom marginT-30 flex centerH>
							<Text grey10 text70 centerV>Non sei una farmacia? </Text>
							<Button link text70 red30
								label="Accedi"
								onPress={() => this.props.navigation.navigate('user-login')} />
						</View>
					</View>
				</View>
			</ScrollView>
		);
	}
}
