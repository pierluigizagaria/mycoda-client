import React, { Component } from 'react';
import { ScrollView } from 'react-native';
import ChatItem from './ChatItem';

export default class Chats extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <ScrollView>
        <ChatItem 
          navigation={this.props.navigation}
          name="Farmacia Vitti" 
          message="Non ho finito" 
          time="10:32" 
          imgUri="https://reactnative.dev/img/tiny_logo.png" 
        />
      </ScrollView>
    );
  }
}
