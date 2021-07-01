import React, { Component } from 'react';
import { View, TextField, Text, Button } from 'react-native-ui-lib';

export default class Login extends Component {
	constructor(props) {
		super(props);
		this.state = {
			cf: '',
			password: '',
		};
	}

	render() {
		return (
			<View flex paddingH-25 paddingT-120 paddingH-30>
				<Text grey20 text10 marginT-10 marginB-70 center>MyCoda</Text>
				<Text grey20 text30 marginB-30>Farmacie</Text>
				<Text red30 text60 marginB-10>Partita IVA</Text>
				<TextField text70 dark10 
					placeholder="Partita iva della farmacia"
					onChangeText={text => this.setState({cf : text})}
				/>
				<Text red30 text60 marginB-10>Password</Text>
				<TextField text70 secureTextEntry dark10
					placeholder="Password"
					onChangeText={text => this.setState({ password: text })}
				/>
				<View flex top>
					<Button text70 white background-red30 borderRadius={10} marginT-10
						label="Accedi"
						onPress={() => this.props.navigation.navigate('home')}
					/>
					<Button link text70 red30 marginT-20
						label="Come posso registrarmi?"
						onPress={() => alert('Schermata di informazioni su affiliamento al servizio.')}
					/>
					<View flex row bottom marginB-30 flex centerH>
						<Text grey10 text70 centerV>Non sei una farmacia? </Text>
						<Button link text70 red30 
							label="Accedi"
							onPress={() => this.props.navigation.navigate('user-login')}/>
					</View>
				</View>
			</View>
		);
	}
	/*
	login() {

		const options = {
			method: 'POST',
			body: JSON.stringify({
				cf: this.state.cf,
				password: this.state.password,
			})
		};
		fetch(Constants.manifest.extra.API_URL, options)
			.then((response) => response.json())
			.then((json) => setData(json.movies))
			.catch((error) => console.error(error))
	}
	*/
}