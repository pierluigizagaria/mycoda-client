import React, { Component } from 'react';
import { ScrollView } from 'react-native';
import { View, TextField, Text, Button } from 'react-native-ui-lib';
import ChatItem from './ChatItem';

export default class ChatList extends Component {
	render() {
		return (
			<ScrollView>
				<ChatItem name="Farmacia Vitti" message="Non ho finito" time="10:32" imgUri="https://reactnative.dev/img/tiny_logo.png"/>
				<ChatItem name="Farmacia Vitti" message="Non ho finito" badge={2} time="10:32" imgUri="https://reactnative.dev/img/tiny_logo.png"/>
				<ChatItem name="Farmacia Vitti" message="Non ho finito" badge={2} time="10:32" imgUri="https://reactnative.dev/img/tiny_logo.png"/>
				<ChatItem name="Farmacia Vitti" message="Non ho finito" badge={2} time="10:32" imgUri="https://reactnative.dev/img/tiny_logo.png"/>
				<ChatItem name="Farmacia Vitti" message="Non ho finito" badge={2} time="10:32" imgUri="https://reactnative.dev/img/tiny_logo.png"/>
				<ChatItem name="Farmacia Vitti" message="Non ho finito" badge={2} time="10:32" imgUri="https://reactnative.dev/img/tiny_logo.png"/>
				<ChatItem name="Farmacia Vitti" message="Non ho finito" badge={2} time="10:32" imgUri="https://reactnative.dev/img/tiny_logo.png"/>
				<ChatItem name="Farmacia Vitti" message="Non ho finito" badge={2} time="10:32" imgUri="https://reactnative.dev/img/tiny_logo.png"/>
				<ChatItem name="Farmacia Vitti" message="Non ho finito" badge={2} time="10:32" imgUri="https://reactnative.dev/img/tiny_logo.png" />
				<ChatItem name="Farmacia Vitti" message="Non ho finito" badge={2} time="10:32" imgUri="https://reactnative.dev/img/tiny_logo.png" />
				<ChatItem name="Farmacia Vitti" message="Non ho finito" badge={2} time="10:32" imgUri="https://reactnative.dev/img/tiny_logo.png" />
				<ChatItem name="Farmacia Vitti" message="Non ho finito" badge={2} time="10:32" imgUri="https://reactnative.dev/img/tiny_logo.png" />
				<ChatItem name="Farmacia Vitti" message="Non ho finito" badge={2} time="10:32" imgUri="https://reactnative.dev/img/tiny_logo.png" />
				<ChatItem name="Farmacia Vitti" message="Non ho finito" badge={2} time="10:32" imgUri="https://reactnative.dev/img/tiny_logo.png" />
				<ChatItem name="Farmacia Vitti" message="Non ho finito" badge={2} time="10:32" imgUri="https://reactnative.dev/img/tiny_logo.png" />
			</ScrollView>
		);
	}
}
