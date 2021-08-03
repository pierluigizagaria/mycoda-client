import React, { Component, useState } from 'react';
import { ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/core';
import { View, TextField, Text, Button } from 'react-native-ui-lib';
import { API } from '../../config/config';

export default function Register() {

	const navigation = useNavigation();
	
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [passwordConfirm, setPasswordConfirm] = useState('');
	const [name, setName] = useState('');
	const [surname, setSurname] = useState('');
	const [fiscalCode, setFiscalCode] = useState('');
	const [telephone, setTelephone] = useState('');
	const [validation, setValidation] = useState({
		passwordsDifferent: false,
	});

	const register = () => {
		setValidation({
			passwordsDifferent: password != passwordConfirm,
		});
		if (validation.passwordsDifferent) return;
		const options = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				cf: fiscalCode,
				nome: name,
				cognome: surname,
				numTel: telephone,
				email: email,
				password: password,
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
	
	return (
		<ScrollView>
			<View flex paddingH-30>
				<Text grey20 text30 marginV-20>Registrati</Text>
				<Text primaryColor text65>Email</Text>
				<TextField text70 placeholder="La tua email" dark10
					onChangeText={text => setEmail(text)} />
				<Text primaryColor text65>Password</Text>
				<TextField text70 placeholder="Password" secureTextEntry dark10
					error={validation.passwordsDifferent ? "Le password non coincidono" : ""}
					onChangeText={text => setPassword(text)} />
				<Text primaryColor text65>Conferma Password</Text>
				<TextField text70 placeholder="Reinserisci la tua password" secureTextEntry dark10
					error={validation.passwordsDifferent ? "Le password non coincidono" : ""}
					onChangeText={text => setPasswordConfirm(text)} />
				<Text primaryColor text65>Nome</Text>
				<TextField text70 placeholder="Il tuo nome" dark10
					onChangeText={text => setName(text)} />
				<Text primaryColor text65>Cognome</Text>
				<TextField text70 placeholder="Il tuo cognome" dark10
					onChangeText={text => setSurname(text)} />
				<Text primaryColor text65>Codice Fiscale</Text>
				<TextField text70 placeholder="Il tuo codice fiscale" dark10
					onChangeText={text => setFiscalCode(text)} />
				<Text primaryColor text65>Telefono</Text>
				<TextField text70 placeholder="Il tuo numero di telefono" dark10
					onChangeText={text => setTelephone(text)} />
				<View flex top>
					<Button text70 white background-primaryColor label="Continua" borderRadius={10} marginT-10
						onPress={register} />
					<View flex row top marginB-30 flex centerH marginT-20>
						<Text grey10 text70 centerV>Hai già un account? </Text>
						<Button link text70 primaryColor
							label="Accedi"
							onPress={() => navigation.navigate('user-login')}
						/>
					</View>
				</View>
			</View>
		</ScrollView>
	);
}
