import React, { Component } from 'react';
import { ScrollView } from 'react-native'
import { View, TextField, Text, Button } from 'react-native-ui-lib';

export default class Register extends Component {
	render() {
		return (
			<ScrollView>
				<View flex paddingH-25 paddingT-70 paddingH-30>
					<Text grey20 text30 marginB-30>Registrati</Text>
					<Text red30 text60 marginB-10>Email</Text>
					<TextField text70 placeholder="La tua email" dark10 />
					<Text red30 text60 marginB-10>Password</Text>
					<TextField text70 placeholder="Password" secureTextEntry dark10 />
					<Text red30 text60 marginB-10>Conferma Password</Text>
					<TextField text70 placeholder="Conferma la password" secureTextEntry dark10 />
					<Text red30 text60 marginB-10>Nome</Text>
					<TextField text70 placeholder="Il tuo nome" secureTextEntry dark10 />
					<Text red30 text60 marginB-10>Cognome</Text>
					<TextField text70 placeholder="Il tuo cognome" secureTextEntry dark10 />
					<Text red30 text60 marginB-10>Codice Fiscale</Text>
					<TextField text70 placeholder="Il tuo codice fiscale" secureTextEntry dark10 />
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
