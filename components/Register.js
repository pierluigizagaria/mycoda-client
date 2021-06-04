import React, { Component } from 'react';
import { ScrollView } from 'react-native'
import { View, TextField, Text, Button } from 'react-native-ui-lib';

export default class Register extends Component {
	render() {
		return (
			<ScrollView>
				<View flex paddingH-30 paddingV-40>
					<Text grey20 text30 marginV-20>Registrati</Text>
					<Text red30 text65>Email</Text>
					<TextField text70 placeholder="La tua email" dark10 />
					<Text red30 text65>Password</Text>
					<TextField text70 placeholder="Password" secureTextEntry dark10 />
					<Text red30 text65>Conferma Password</Text>
					<TextField text70 placeholder="Reinserisci la tua password" secureTextEntry dark10 />
					<Text red30 text65>Nome</Text>
					<TextField text70 placeholder="Il tuo nome" dark10 />
					<Text red30 text65>Cognome</Text>
					<TextField text70 placeholder="Il tuo cognome" dark10 />
					<Text red30 text65>Codice Fiscale</Text>
					<TextField text70 placeholder="Il tuo codice fiscale" dark10 />
					<View flex top>
						<Button text70 white background-red30 label="Continua" borderRadius={10} marginT-10 />
						<View flex row top marginB-30 flex centerH marginT-20>
							<Text grey10 text70 centerV>Hai già un account? </Text>
							<Button link text70 red30
								label="Accedi"
								onPress={() => this.props.navigation.navigate('login')}
							/>
						</View>
					</View>
				</View>
			</ScrollView>
		);
	}
}
