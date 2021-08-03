import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, TouchableHighlight } from 'react-native';
import { View, Text, Image } from 'react-native-ui-lib';
import dayjs from 'dayjs';

export default function ChatItem({
	userId,
	imgUri,
	name,
	time,
	badge,
	message
}) {

	const navigation = useNavigation();

	const onPress = () => {
		navigation.navigate('chat-room', { name, userId });
	}

	return (
		<TouchableHighlight 
			onPress={onPress} 
			underlayColor="white">
			<View style={styles.container}>
				<Image style={styles.logo} source={{ uri: imgUri }}
				/>
				<View flex paddingL-10 centerV>
					<View flex row spread top>
						<Text grey10 text65>{name}</Text>
						<Text grey30 text90H >{dayjs(time).format('HH:mm')}</Text>
					</View>
					<View flex row spread bottom>
						<View flex>
							<Text numberOfLines={1} text80 style={{ color: badge > 0 ? 'orange' : 'gray', }}>{message}</Text>
						</View>
						{badge > 0 &&
							<View style={styles.badge} center centerV bg-primaryColor>
								<Text white text90>{badge}</Text>
							</View>
						}
					</View>
				</View>
			</View>
		</TouchableHighlight>
	);
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

