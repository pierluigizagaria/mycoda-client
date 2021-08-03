import React, { useContext, useEffect, useState, useRef } from 'react';
import { StyleSheet, View, ActivityIndicator, Alert } from 'react-native';
import { GiftedChat, Actions, ActionsProps, Bubble } from 'react-native-gifted-chat';
import { Ionicons } from '@expo/vector-icons';
import 'dayjs/locale/it';
import { API } from '../../config/config';
import { SocketContext } from '../SocketContext';
import { useNavigation, useTheme } from '@react-navigation/native';

export default function ChatRoom({route}) {

  const { userId, localUser } = route.params;
  const { id: localUserId, type: loginType, accessToken } = localUser;

  const MESSAGES_PER_PAGE = 50;

  const navigation = useNavigation();
  const { colors } = useTheme();
  
  const [messages, setMessages] = useState([]);
  const [messagesOffset, setMessagesOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [shouldLoadMessages, setShouldLoadMessages] = useState(true);

  const { socket } = useContext(SocketContext);

  const messagesRef = useRef();
  messagesRef.current = messages;

  useEffect(() => {
    if (!socket) return;
    socket.on('privateMessage', onSocketPrivateMessage);
    socket.on('messageReaded', onSocketMessageReaded);
    return () => {
      socket.off('privateMessage', onSocketPrivateMessage);
      socket.off('messageReaded', onSocketMessageReaded);
    };
  }, [socket]);

  useEffect(() => {
    setLoading(true);
    fetchMessages(messagesOffset, MESSAGES_PER_PAGE)
    .then(messages => {
      setMessagesOffset(prevOffset => prevOffset + messages.length);
      setMessages(messages);
      setLoading(false);
    });
  }, []);

  function loadEarlier() {
    setLoading(true);
    fetchMessages(messagesOffset, MESSAGES_PER_PAGE)
      .then(messages => {
        setMessages(prevMessages => (GiftedChat.prepend(prevMessages, messages)));
        setShouldLoadMessages(messages.length > 0);
        setMessagesOffset(prevOffset => prevOffset + messages.length);
        setLoading(false);
      });
  };

  async function fetchMessages(offset, limit) {
    return fetch(`${API.URL}/api/messages/${userId}?offset=${offset}&limit=${limit}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    })
    .then(response => response.json())
    .then(json => {
      if ('error' in json) throw new Error(json.error.message);
      return json.length > 0 ? json.map(message => ({
        _id: message.id,
        text: message.content,
        createdAt: message.time,
        status: message.readed ? 'readed' : 'received',
        user: { _id: message.mittente },
      })) : [];
    })
  };

  async function postMessage({ content, type }) {
    return fetch(`${API.URL}/api/messages/${userId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        content,
        msgType: type,
      })
    })
    .then((response) => response.json())
    .then((json) => {
      if ('error' in json) throw new Error(json.error.message);
    })
    .catch((error) => console.error(error))
  };

  function onSend([ message ]) {
    const messageSent = { ...message, status: 'sent' };
    setMessages(prevMessages => (GiftedChat.append(prevMessages, [messageSent])));
    postMessage({ content: message.text, type: 2})
      .then(() => {
        if (!socket) return;
        emitSocketPrivateMessage(userId, messageSent);
      });
  };

  function emitSocketPrivateMessage(userId, message) {
    socket.emit('privateMessage', { to: userId, message }, () => {
      const updatedMessages = messagesRef.current.map(m => 
        m._id === message._id ? ({ ...m, status: 'received' }) : m
      );
      setMessages([...updatedMessages]);
    });
  };

  function onSocketPrivateMessage(payload) {
    setMessages((prevMessages) => (GiftedChat.append(prevMessages, payload.message)));
    socket.emit('messageReaded', { to: payload.from, message: payload.message });
  };

  function onSocketMessageReaded({message}) {
    const updatedMessages = messagesRef.current.map(m =>
      m._id === message._id ? ({ ...m, status: 'readed' }) : m
    );
    setMessages([...updatedMessages]);
  }

  function renderTicks({ status, user }) {
    if (localUserId !== user._id) return;
    switch (status) {
      case 'sent': 
        return <Ionicons name={"time-outline"} style={styles.messageTicks}/>;
      case 'received': 
        return <Ionicons name={"checkmark-sharp"} style={styles.messageTicks}/>;
      case 'readed': 
        return <Ionicons name={"checkmark-done-sharp"} style={styles.messageTicks}/>;
    }
  }
 
  return (
    <GiftedChat
      locale={'it'}
      renderAvatar={null}
      scrollToBottom={true}
      infiniteScroll={true}
      loadEarlier={shouldLoadMessages}
      isLoadingEarlier={loading}
      messages={messages}
      user={{ _id: localUserId }}
      onSend={onSend}
      onLoadEarlier={loadEarlier}
      renderTicks={renderTicks}
      renderLoadEarlier={() => (
        <ActivityIndicator size="large" color="#d3d3d3"/>
      )}
      renderBubble={props => (
        <Bubble
          {...props}
          textStyle={{ left: { color: 'white' }}}
          timeTextStyle={{ 
            left: { color: 'white', fontSize: 12 },
            right: { color: 'white', fontSize: 12 },
          }}
          wrapperStyle={{ left: { backgroundColor: colors.primary }}}
        />
      )}
      renderActions={(props) => loginType === 'pharmacy' ?
        (<Actions
          onPressActionButton={() => { navigation.navigate('send-payment', route.params); }} 
          icon={() => (<Ionicons name="card" size={24} color={colors.primary}/>)}
          />
        ) : null
      }
    />
  );
}

const styles = StyleSheet.create({
  messageTicks: {
    fontSize: 14,
    color: 'white',
    paddingBottom: 4, 
    paddingRight: 6,
  }
});
