import React, { Component } from 'react';
import { ScrollView } from 'react-native';
import ChatItem from './ChatItem';
import { SocketContext } from '../SocketContext';

export default class Chats extends Component {
  static contextType = SocketContext

  constructor(props) {
    super(props);
    this.state = { realtimeConnected: false };    
  }

  componentDidMount() {
    const socket = this.context;
    this.state.socket = socket;
    socket.on('connect', () => {
      this.setState({ realtimeConnected: true });
    });
    socket.on('disconnect', () => {
      this.setState({ realtimeConnected: false });
    })
  }

  componentWillUnmount() {
    socket.off('connect');
    socket.off('disconnect');
  }

  render() {
    return (
      <ScrollView>
        <ChatItem 
          sessionId={1}
          navigation={this.props.navigation}
          name="Farmacia Vitti" 
          message="Non ho finito" 
          time="10:32" 
          imgUri="https://reactnative.dev/img/tiny_logo.png" 
        />
        <ChatItem
          sessionId={2}
          navigation={this.props.navigation}
          name="Farmacia Cecca"
          message="Non ho finito"
          time="10:32"
          imgUri="https://reactnative.dev/img/tiny_logo.png"
        />
      </ScrollView>
    );
  }
}
