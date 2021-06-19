import React, { Component } from 'react';
import { StyleSheet, Text, ActivityIndicator } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import { SocketContext } from '../SocketContext';

export default class ChatRoom extends Component {
  static contextType = SocketContext;

  constructor(props) {
    super(props);
    const { sessionId } = this.props.route.params;
    this.state = { 
      messages:[], 
      isLoading: false, 
      shouldLoadMessages: false,
      sessionId,
    };
    this.chatRef = React.createRef();
    this.loadEarlier = this.loadEarlier.bind(this);
    this.onSend = this.onSend.bind(this);
  }

  componentDidMount() {
    const socket = this.context;
    this.state.socket = socket;
    this.setState({ messages: [
      {
        _id: 2,
        text: 'Messaggi Utente',
        createdAt: new Date(),
        user: {
          _id: 1,
          name: 'React Native',
          avatar: 'https://placeimg.com/140/140/any',
        },
      },
      {
        _id: 1,
        text: 'Messaggi Farmacia',
        createdAt: new Date('2020-03-23'),
        user: {
          _id: 2,
          name: 'React Native',
          avatar: 'https://placeimg.com/140/140/any',
        },
      },
    ]});
  }

  loadEarlier() {
    this.setState({ isLoading: true });
  }

  onSend(messages = []) {
    const [ message ] = messages;
    const { text } = message;
    const { sessionId } = this.state;
    this.setState((previousState) => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }));
    this.state.socket.emit('message', { sessionId, text });
  }
  
  render() {
    return (
      <GiftedChat
        ref={this.chatRef}
        messages={this.state.messages}
        scrollToBottom={true}
        infiniteScroll={true}
        onSend={this.onSend}
        onLoadEarlier={this.loadEarlier}
        loadEarlier={this.state.shouldLoadMessages}
        isLoadingEarlier={this.state.isLoading}
        renderLoadEarlier={() => (
          <ActivityIndicator size="large" color="#d3d3d3"/>
        )}
        user={{ _id: 1 }}
      />
    );
  }
}

const styles = StyleSheet.create({

});
