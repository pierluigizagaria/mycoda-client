import { ThemeProvider } from '@react-navigation/native';
import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { View, Text, Image } from 'react-native-ui-lib';

export default class ChatItem extends Component {
	render() {
		return (
			<View style={styles.container}>
				<Image
					style={styles.logo}
					source={{
						uri: this.props.imgUri,
					}}
				/>
				<View flex paddingH-10 centerV>
					<View row spread centerV>
						<Text grey10 text65>{this.props.name}</Text>
						<Text grey30 text90H>{this.props.time}</Text>
					</View>
					<View row spread centerV>
						<Text grey20 text80>{this.props.message}</Text>
						{ this.props.badge &&
							<View style={styles.badge} center centerV background-red30>
								<Text white text90>{this.props.badge}</Text>
							</View>
						}
					</View>
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		height: 50,
		margin: 13,
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

