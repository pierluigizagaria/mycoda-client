import React, { Component } from 'react';
import { FlatList } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { API } from '../../config/config';
import ChatItem from './ChatItem';
import { SocketContext } from '../SocketContext';
import userData from '../../helpers/userData';

export default class Chats extends Component {
  static contextType = SocketContext

  constructor(props) {
    super(props);
    this.state = { 
      sessions: [],
      realtimeConnected: false, 
      socket: null, 
      refreshing: false, 
    };
    this.fetchSessions = this.fetchSessions.bind(this);
  }

  componentDidMount() {
    this.setupSocket();
    this.fetchSessions();
  }

  componentWillUnmount() {
    this.state.socket.off('connect');
    this.state.socket.off('disconnect');
  }

  setupSocket() {
    const socket = this.context;
    this.state.socket = socket;
    this.state.socket.on('connect', () => {
      this.setState({ realtimeConnected: true });
    });
    this.state.socket.on('disconnect', () => {
      this.setState({ realtimeConnected: false });
    })
  }

  fetchSessions() {
    this.setState({ refreshing: true });
    userData.load()
      .then(data => {
        return fetch(`${API.URL}/api/sessions/open`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${data.accessToken}`,
          },
        });
      })
      .then(response => response.json())
      .then(json => { this.setState({ sessions: json, refreshing: false }); })
      .catch(error => console.error(error))
  }

  render() {
    return (
      <FlatList
        data={this.state.sessions}
        keyExtractor={item => item.pivaFarma}
        onRefresh={this.fetchSessions}
        refreshing={this.state.refreshing}
        renderItem={({ item }) => {
          const date = new Date(item.lastMessage.time);
          const dateText = `${date.getHours()}:${date.getMinutes()}`
          return <ChatItem
            navigation={this.props.navigation}
            userId={item.pivaFarma}
            name="ragSociale"
            message={item.lastMessage.content}
            time={dateText}
            imgUri="https://reactnative.dev/img/tiny_logo.png"/>
        }}/>
    );
  }
}
