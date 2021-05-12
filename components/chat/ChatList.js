import React, { Component } from 'react';
import { View, TextField, Text, Button } from 'react-native-ui-lib';
import ChatRow from './ChatRow';


export default class ChatList extends Component {

    render() {
        return (
            <View flex>
                <ChatRow name="Farmacia Vitti" lastMessage="Non ho finito" />
                <ChatRow name="Farmacia Vitti" lastMessage="Non ho finito" />
                <ChatRow name="Farmacia Vitti" lastMessage="Non ho finito" />
                <ChatRow name="Farmacia Vitti" lastMessage="Non ho finito" />
                <ChatRow name="Farmacia Vitti" lastMessage="Non ho finito" />
                <ChatRow name="Farmacia Vitti" lastMessage="Non ho finito" />
                <ChatRow name="Farmacia Vitti" lastMessage="Non ho finito" />
                <ChatRow name="Farmacia Vitti" lastMessage="Non ho finito" />
            </View>
        );
    }
}
