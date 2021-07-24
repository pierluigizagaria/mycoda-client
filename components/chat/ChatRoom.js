import React, { Component } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { GiftedChat, Actions, ActionsProps, Bubble } from 'react-native-gifted-chat';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { API } from '../../config/config';
import { SocketContext } from '../SocketContext';
import userData from '../../helpers/userData';

export default class ChatRoom extends Component {
  static contextType = SocketContext;

  constructor(props) {
    super(props);
    const { userId } = this.props.route.params;
    this.state = { 
      userId,
      messages: [], 
      isLoading: false, 
      shouldLoadMessages: true,
    };
    this.loadEarlier = this.loadEarlier.bind(this);
    this.onSend = this.onSend.bind(this);
  }

  componentDidMount() {
    this.fetchMessages();
  }

  componentDidUpdate(previousProps, previousState) {
    this.state.socket = this.context.socket;
    if (previousState.socket != this.state.socket) {
      this.registerSocketEvents();
    }
  }

  componentWillUnmount() {
    this.unsetupSocket();
  }

  loadEarlier() {
    this.setState({ isLoading: true });
    console.log("Loading more")
  }

  registerSocketEvents() {
    this.state.socket?.on('privateMessage', data => {
      this.setState((previousState) => ({
        messages: GiftedChat.append(previousState.messages, data.message),
      }));
    });
  }

  unsetupSocket() {
    this.state.socket?.off('privateMessage');
  }

  fetchMessages() {
    this.setState({ refreshing: true });
    userData.load()
      .then(data => {
        this.state.localUserId = data.id;
        return fetch(`${API.URL}/api/messages/${this.state.userId}?limit=20`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${data.accessToken}`,
          },
        })
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
          refreshing: false,
        });
      })
      .catch(error => console.error(error));
  }

  postMessage({ content, type }) {
    userData.load()
      .then(data => 
        fetch(`${API.URL}/api/messages/${this.state.userId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${data.accessToken}`,
          },
          body: JSON.stringify({
            content,
            msgType: type,
          })
        })
      )
      .then((response) => response.json())
      .then((json) => {
        if ('error' in json) {
          console.error(json);
          return;
        }
      })
      .catch((error) => console.error(error))
  }

  onSend(messages = []) {
    const [ message ] = messages;
    const { userId } = this.state;
    this.setState((previousState) => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }));
    this.postMessage({ content: message.text, type: 2});
    this.state.socket?.emit('privateMessage', { to: userId, message });
  }
  
  render() {
    return (
      <GiftedChat
        renderAvatar ={null}
        scrollToBottom={true}
        infiniteScroll={true}
        onSend={this.onSend}
        onLoadEarlier={this.loadEarlier}
        loadEarlier={this.state.shouldLoadMessages}
        isLoadingEarlier={this.state.isLoading}
        renderLoadEarlier={() => (
          <ActivityIndicator size="large" color="#d3d3d3"/>
        )}
        messages={this.state.messages}
        user={{ _id: this.state.localUserId }}
        renderBubble={props => {
          return (
            <Bubble
              {...props}
              textStyle={{ left: { color: 'white' }}}
              timeTextStyle={{ left: { color: 'white' }}}
              wrapperStyle={{ left: { backgroundColor: '#FF6947' }}}
            />
          );
        }}
        /*
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
        */
      />
    );
  }
}

const styles = StyleSheet.create({

});
