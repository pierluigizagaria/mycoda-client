import React, { Component } from 'react';
import { View, TextField, Text, Button } from 'react-native-ui-lib';
import Constants from "expo-constants";
import ChatList from './ChatList'

export default class Chats extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View flex>
        <ChatList/>
      </View>
    );
  }
}
