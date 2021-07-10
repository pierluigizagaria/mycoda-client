import React, { Component } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { GiftedChat, Actions, ActionsProps } from 'react-native-gifted-chat';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import { API } from '../../config/config';
import { SocketContext } from '../SocketContext';
import userData from '../../helpers/userData';

export default class ChatRoom extends Component {
  static contextType = SocketContext;

  constructor(props) {
    super(props);
    const { userId } = this.props.route.params;
    this.state = { 
      messages: [], 
      isLoading: false, 
      shouldLoadMessages: false,
      userId,
    };
    this.chatRef = React.createRef();
    this.loadEarlier = this.loadEarlier.bind(this);
    this.onSend = this.onSend.bind(this);
  }

  componentDidMount() {
    this.fetchMessages();
    this.setupSocket();
  }

  loadEarlier() {
    this.setState({ isLoading: true });
  }

  setupSocket() {
    const socket = this.context;
    this.state.socket = socket;
  }

  fetchMessages() {
    this.setState({ refreshing: true });
    userData.load()
      .then(data => {
        fetch(`${API.URL}/api/messages/${this.state.userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${data.accessToken}`,
          },
        })
          .then(response => response.json())
          .then(json => {
            const messages = json.length > 0 ? json.map(message => ({
              _id: message.id,
              text: message.content,
              createdAt: message.time,
              user: {
                _id: message.mittente,
                //name: 'React Native',
                //avatar: 'https://placeimg.com/140/140/any',
              },
            })) : [];
            this.setState({
              messages,
              localUserId: data.id,
              refreshing: false,
            });
          })
          .catch(error => console.error(error));
      })
      .catch(error => console.error(error));
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
        showUserAvatar={false}
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
        user={{ _id: this.state.localUserId }}
        renderActions={(props) => 
          <Actions
            options={{
              ['Foto']: () => console.log('yeah'),
              ['Invia Pagamento']: () => console.log('yeah'),
            }}
            icon={() => (
              <MaterialCommunityIcons name="dots-vertical" size={24}/>
            )}
            onSend={args => console.log(args)}
            />
        }
      />
    );
  }
}

const styles = StyleSheet.create({

});
