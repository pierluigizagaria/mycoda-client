import { ThemeProvider } from '@react-navigation/native';
import React, { Component } from 'react';
import { StyleSheet, TouchableHighlight } from 'react-native';
import { View, Text, Image } from 'react-native-ui-lib';
import { SocketContext } from '../SocketContext';

export default class ChatItem extends Component {
	static contextType = SocketContext;

	constructor(props) {
		super(props);
		this.state = {};
	}
	
	componentDidMount() {
		const socket = this.context;
		this.state.socket = socket;
	}

	onPress() {
		this.props.navigation.navigate('chat-room', { 
			name: this.props.name, 
			sessionId: this.props.sessionId,
		});
	}

	render() {
		return (
			<TouchableHighlight 
				onPress={() => this.onPress()} 
				underlayColor="white">
				<View style={styles.container}>
					<Image
						style={styles.logo}
						source={{ uri: this.props.imgUri }}
					/>
					<View flex paddingL-10 centerV>
						<View flex row spread top>
							<Text grey10 text65>{this.props.name}</Text>
							<Text grey30 text90H>{this.props.time}</Text>
						</View>
						<View flex row spread bottom>
							<Text grey20 text80>{this.props.message}</Text>
							{this.props.badge &&
								<View style={styles.badge} center centerV background-red30>
									<Text white text90>{this.props.badge}</Text>
								</View>
							}
						</View>
					</View>
				</View>
			</TouchableHighlight>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		padding: 12,
		overflow: 'hidden',
	},
	logo: {
		width: 50,
		height: 50,
		borderRadius: 18,
	},
	badge: {
		width: 22,
		height: 22,
		borderRadius: 8,
	},
});

