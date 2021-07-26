import React, {useEffect, useState, useContext } from 'react';
import { FlatList } from 'react-native';
import { API } from '../../config/config';
import ChatItem from './ChatItem';
import userData from '../../helpers/userData';
import { SocketContext } from '../SocketContext';

export default function Chats() {

  const [sessions, setSessions] = useState([]);
  const [socketConnected, setSocketConnected] = useState(false); 
  const [refreshing, setRefreshing] = useState(false);
  const { 
    socket, 
    connect: connectSocket, 
    disconnect: disconnectSocket
  } = useContext(SocketContext);

  useEffect(() => {
    fetchSessions();
    connectSocket();
    return () => { 
      disconnectSocket(); 
    };
  }, []);

  useEffect(() => {
    if (!socket) return;
    socket.on('connect', onSocketConnect);
    socket.on('disconnect', onSocketDisconnect);
    socket.on('privateMessage', onSocketPrivateMessage);
    return () => {
      socket.off('connect', onSocketConnect);
      socket.off('disconnect', onSocketDisconnect);
      socket.off('privateMessage', onSocketPrivateMessage);
    }
  }, [socket, sessions]);

  const onSocketConnect = () => {
    console.log('Socket connected');
    setSocketConnected(true);
  };

  const onSocketDisconnect = (reason) => {
    console.log(`Socket disconnected: ${reason}`);
    setSocketConnected(false);
  };

  const onSocketPrivateMessage = (payload) => {
    const updatedSessions = sessions.map(session => (
      session.userId === payload.from ? ({
        ...session,
        newMessagesCount: ++session.newMessagesCount,
        lastMessage: {
          ...session.lastMessage,
          content: payload.message.text,
          time: payload.message.createdAt,
        }
      }) : session
    ));
    setSessions([...updatedSessions]);
  };

  const fetchSessions = () => {
    setRefreshing(true);
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
      .then(json => {
        setSessions(json);
        setRefreshing(false);
      })
      .catch(error => console.error(error))
  };

  return (
    <FlatList
      data={sessions}
      onRefresh={fetchSessions}
      refreshing={refreshing}
      keyExtractor={item => item.userId}
      renderItem={({ item }) => (
        <ChatItem
          userId={item.userId}
          name={item.displayName}
          message={item.lastMessage.content}
          badge={item.newMessagesCount}
          time={item.lastMessage.time}
          imgUri="https://reactnative.dev/img/tiny_logo.png"/>
      )}/>
  );
}
