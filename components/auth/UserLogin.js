import React, { useState, useContext } from 'react';
import { Alert, ScrollView, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/core';
import { View, TextField, Text, Button, Image } from 'react-native-ui-lib';
import { API } from '../../config/config';
import localUserData from '../../helpers/localUserData';
import headerLogo from '../../assets/header.png';

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
				localUserData.save({
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
					.then((data) => signIn(data))
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
			<View flex paddingH-30>
				<View flex center >
					<Image source={headerLogo} resizeMode={'contain'} style={{ width: 250, height: 250 }} />
				</View>
				<Text grey20 text30 marginB-30>Accedi</Text>
				<Text primaryColor text60 marginB-10>Codice Fiscale</Text>
				<TextField text70 dark10
					placeholder="Il tuo codice fiscale"
					onChangeText={text => setFiscalCode(text)}
				/>
				<Text primaryColor text60 marginB-10>Password</Text>
				<TextField text70 secureTextEntry dark10
					placeholder="Password"
					onChangeText={text => setPassword(text)}
				/>
				<View flex top>
					<Button text70 white background-primaryColor borderRadius={10} marginT-10
						label="Accedi"
						onPress={login}
					/>
					<Button link text70 primaryColor marginT-20
						label="Registrati"
						onPress={() => navigation.navigate('user-register')}
					/>
					<View flex row bottom marginT-20 centerH>
						<Text grey10 text70 centerV>Hai una farmacia? </Text>
						<Button link text70 primaryColor
							label="Accedi"
							onPress={() => navigation.navigate('pharmacy-login')} />
						<Text grey10 text70 centerV> </Text>
					</View>
					<View flex bottom centerH>
						<Text grey10 text70 centerV>oppure contattaci</Text>
						<Button link text70 primaryColor
							label="+39 347 650 3967"
							onPress={() => Linking.openURL(`tel:+39 347 650 3967`)} />
						<Button link text70 primaryColor
							label="+39 327 776 6271"
							onPress={() => Linking.openURL(`tel:+39 327 776 6271`)} />
					</View>
				</View>
			</View>
		</ScrollView>
	);
}

