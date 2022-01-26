import React, { useEffect, useState, useContext, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import { FlatList, StyleSheet, View, Text } from 'react-native';
import { API } from '../../config/config';
import ChatItem from './ChatItem';
import { SocketContext } from '../SocketContext';

export default function Chats({ route }) {
  const navigation = useNavigation();

  const { localUser } = route.params;
  const { accessToken, type: loginType } = localUser;

  const [sessions, _setSessions] = useState([]);
  const sessionsRef = useRef(sessions);
  const setSessions = sessions => {
    sessionsRef.current = sessions;
    _setSessions(sessions);
  }

  const [refreshing, setRefreshing] = useState(false);

  const {
    socket,
    connect: connectSocket,
    disconnect: disconnectSocket
  } = useContext(SocketContext);

  useEffect(() => {
    fetchSessions();
    connectSocket(accessToken);
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
  }, [socket]);

  useEffect(() => navigation.addListener('focus', fetchSessions), [navigation]);

  const onSocketConnect = () => {
    console.log('Socket connected');
  };

  const onSocketDisconnect = (reason) => {
    console.log(`Socket disconnected: ${reason}`);
  };

  const onSocketPrivateMessage = (payload) => {
    const currentSessions = sessionsRef.current;
    const { newSession, updatedSessions } = currentSessions.reduce(({ updatedSessions }, session) => {
      if (session.userId === payload.from)
        updatedSessions.unshift({
          ...session,
          newMessagesCount: ++session.newMessagesCount,
          lastMessage: {
            ...session.lastMessage,
            content: payload.message.text,
            time: payload.message.createdAt,
          }
        });
      else updatedSessions.push(session);
      return {
        newSession: !session.userId === payload.from,
        updatedSessions,
      }
    }, { newSession: true, updatedSessions: [] })
    newSession ? fetchSessions() : setSessions(updatedSessions);
  };

  const fetchSessions = () => {
    setRefreshing(true);
    fetch(`${API.URL}/api/sessions/open`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    })
      .then(response => response.json())
      .then(json => {
        if ('error' in json) throw new Error(json.error.message);
        setSessions(json);
        setRefreshing(false);
      })
      .catch(error => {
        setRefreshing(false);
        setSessions([]);
      })
  };

  const renderChatEmpty = () => {
    if (refreshing) return null;
    return (
      <View style={styles.emptyChatView}>
        <View style={styles.emptyChatContainer}>
          <Text style={styles.emptyChatText}>{
            loginType === 'user' ?
              `Cerca e contatta il tuo farmacista di fiducia per i tuoi acquisti.` :
              `Quì appariranno le richieste di supporto da parte dei tuoi clienti.`
          }
          </Text>
        </View>
      </View>
    );
  };

  return (
    <FlatList
      data={sessions}
      onRefresh={fetchSessions}
      refreshing={refreshing}
      keyExtractor={item => item.userId}
      contentContainerStyle={{ flexGrow: 1 }}
      ListEmptyComponent={renderChatEmpty}
      renderItem={({ item }) => (
        <ChatItem
          key={item.userId}
          userId={item.userId}
          name={item.displayName}
          badge={item.newMessagesCount}
          imgUri="https://reactnative.dev/img/tiny_logo.png"
          time={item.lastMessage?.time}
          {...(item.lastMessage?.tipo === 1 && ({ message: '📷 Immagine' }))}
          {...(item.lastMessage?.tipo === 2 && ({ message: item.lastMessage.content }))}
          {...(item.lastMessage?.tipo === 3 && ({ message: '💳 Pagamento' }))} />
      )} />
  );
}

const styles = StyleSheet.create({
  emptyChatView: {
    flex: 1,
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyChatContainer: {
    top: '-10%',
    backgroundColor: '#45C476',
    width: '70%',
    padding: 16,
    borderRadius: 16,
  },
  emptyChatText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 16,
  }
});
