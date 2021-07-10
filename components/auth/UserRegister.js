import React, { Component } from 'react';
import { ScrollView, Alert } from 'react-native'
import { View, TextField, Text, Button } from 'react-native-ui-lib';
import { API } from '../../config/config';

export default class Register extends Component {

	constructor(props) {
		super(props);
		this.state = {
			email: '',
			password: '',
			passwordConfirm: '',
			name: '',
			surname: '',
			fiscalCode: '',
			telephone: '',
			validation: {
				passwordsDifferent: false,
			}
		};
	}

	register() {
		const validation = {
				passwordsDifferent: this.state.password !== this.state.passwordConfirm,
		}
		this.setState({ validation });
		if (validation.passwordsDifferent) return;
		const options = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				cf: this.state.fiscalCode,
				nome: this.state.name,
				cognome: this.state.surname,
				numTel: this.state.telephone,
				email: this.state.email,
				password: this.state.password,
			})
		};
		fetch(`${API.URL}/api/users/register`, options)
			.then((response) => response.json())
			.then((json) => {
				if ('error' in json) {
					Alert.alert("Errore", "Alcuni valori non sono validi");
					return;
				}
				Alert.alert("Ottimo", "Registrazione avvenuta con successo");
				this.props.navigation.navigate('user-login');
			})
			.catch((error) => console.error(error))
	}

	render() {
		return (
			<ScrollView>
				<View flex paddingH-30>
					<Text grey20 text30 marginV-20>Registrati</Text>
					<Text red30 text65>Email</Text>
					<TextField text70 placeholder="La tua email" dark10
						onChangeText={(text) => this.state.email = text}/>
					<Text red30 text65>Password</Text>
					<TextField text70 placeholder="Password" secureTextEntry dark10 
						error={this.state.validation.passwordsDifferent ? "Le password non coincidono" : ""}
						onChangeText={(text) => this.state.password = text}/>
					<Text red30 text65>Conferma Password</Text>
					<TextField text70 placeholder="Reinserisci la tua password" secureTextEntry dark10
						error={this.state.validation.passwordsDifferent ? "Le password non coincidono" : ""}
						onChangeText={(text) => this.state.passwordConfirm = text}/>
					<Text red30 text65>Nome</Text>
					<TextField text70 placeholder="Il tuo nome" dark10 
						onChangeText={(text) => this.state.name = text}/>
					<Text red30 text65>Cognome</Text>
					<TextField text70 placeholder="Il tuo cognome" dark10 
						onChangeText={(text) => this.state.surname = text} />
					<Text red30 text65>Codice Fiscale</Text>
					<TextField text70 placeholder="Il tuo codice fiscale" dark10 
						onChangeText={(text) => this.state.fiscalCode = text}/>
					<Text red30 text65>Telefono</Text>
					<TextField text70 placeholder="Il tuo numero di telefono" dark10
						onChangeText={(text) => this.state.telephone = text} />
					<View flex top>
						<Button text70 white background-red30 label="Continua" borderRadius={10} marginT-10 
							onPress={() => this.register()}/>
						<View flex row top marginB-30 flex centerH marginT-20>
							<Text grey10 text70 centerV>Hai già un account? </Text>
							<Button link text70 red30
								label="Accedi"
								onPress={() => this.props.navigation.navigate('user-login')}
							/>
						</View>
					</View>
				</View>
			</ScrollView>
		);
	}
}
