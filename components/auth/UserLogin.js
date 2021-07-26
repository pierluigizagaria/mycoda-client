import React, { useState, useContext } from 'react';
import { Alert, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/core';
import { View, TextField, Text, Button } from 'react-native-ui-lib';
import { API } from '../../config/config';
import userData from '../../helpers/userData';

export default function UserLogin() {

	const navigation = useNavigation();
	
	const [fiscalCode, setFiscalCode] = useState('');
	const [password, setPassword] = useState('');
	const { signIn } = useContext(AuthContext);

	const login = () => {
		fetch(`${API.URL}/api/users/login`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				cf: fiscalCode,
				password: password,
			})
		})
			.then((response) => response.json())
			.then((json) => {
				if ('error' in json) {
					Alert.alert("Errore", "Credenziali errate");
					return;
				}
				userData.save({
					email: json.email,
					id: json.cf,
					name: json.nome,
					surname: json.cognome,
					telephone: json.numTel,
					type: 'user',
				}, {
					accessToken: json.accessToken,
					refreshToken: json.refreshToken,
				})
					.then(() => signIn())
					.catch(error => {
						Alert.alert('Errore', 'Si è verificato un errore in fase di login');
						console.error(error);
						return;
					})
			})
			.catch((error) => console.error(error))
	}

	return (
		<ScrollView>
			<View flex paddingH-25 paddingT-120 paddingH-30>
				<Text grey20 text10 marginT-10 marginB-70 center>MyCoda</Text>
				<Text grey20 text30 marginB-30>Accedi</Text>
				<Text red30 text60 marginB-10>Codice Fiscale</Text>
				<TextField text70 dark10
					placeholder="Il tuo codice fiscale"
					onChangeText={text => setFiscalCode(text)}
				/>
				<Text red30 text60 marginB-10>Password</Text>
				<TextField text70 secureTextEntry dark10
					placeholder="Password"
					onChangeText={text => setPassword(text)}
				/>
				<View flex top>
					<Button text70 white background-red30 borderRadius={10} marginT-10
						label="Accedi"
						onPress={login}
					/>
					<Button link text70 red30 marginT-20
						label="Registrati"
						onPress={() => navigation.navigate('user-register')}
					/>
					<View flex row bottom marginT-30 flex centerH>
						<Text grey10 text70 centerV>Sei una farmacia? </Text>
						<Button link text70 red30
							label="Accedi"
							onPress={() => navigation.navigate('pharmacy-login')} />
					</View>
				</View>
			</View>
		</ScrollView>
	);
}

