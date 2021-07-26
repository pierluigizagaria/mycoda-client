import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, View, ActivityIndicator, Alert } from 'react-native';
import { GiftedChat, Actions, ActionsProps, Bubble } from 'react-native-gifted-chat';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import 'dayjs/locale/it';
import { API } from '../../config/config';
import { SocketContext } from '../SocketContext';
import userData from '../../helpers/userData';


export default function ChatRoom({route}) {

  const [localUserId, setLocalUserId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messagesOffset, setMessagesOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [shouldLoadMessages, setShouldLoadMessages] = useState(true);

  const { socket } = useContext(SocketContext);
  const userId = route.params.userId;
  const MESSAGES_PER_PAGE = 30;

  useEffect(() => {
    fetchMessages(messagesOffset, MESSAGES_PER_PAGE)
    .then(messages => {
      setMessagesOffset(prevOffset => prevOffset + messages.length);
      setMessages(messages)
    });
  }, []);

  useEffect(() => {
    if (!socket) return;
    socket.on('privateMessage', onSocketPrivateMessage);
    return () => {
      socket.off('privateMessage', onSocketPrivateMessage);
    };
  }, [socket]);

  function emitSocketPrivateMessage(userId, message) {
    if (!socket) {
      Alert.alert('Errore nel invio del messaggio');
      return;
    }
    socket.emit('privateMessage', { to: userId, message });
  };

  function loadEarlier() {
    setLoading(true);
    fetchMessages(messagesOffset, MESSAGES_PER_PAGE)
      .then(messages => {
        setMessagesOffset(prevOffset => prevOffset + messages.length);
        setMessages(previousMessages => (GiftedChat.prepend(previousMessages, messages)));
        setLoading(false);
    });
  };

  function onSocketPrivateMessage(data) {
    setMessages((previousMessages) => (GiftedChat.append(previousMessages, data.message)));
  };

  function fetchMessages(offset, limit) {
    return userData.load()
      .then(data => {
        setLocalUserId(data.id);
        return fetch(`${API.URL}/api/messages/${userId}?offset=${offset}&limit=${limit}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${data.accessToken}`,
          },
        })
      })
      .then(response => response.json())
      .then(json => {
        return json.length > 0 ? json.map(message => ({
          _id: message.id,
          text: message.content,
          createdAt: message.time,
          user: { _id: message.mittente },
        })) : [];
      })
  };

  function postMessage({ content, type }) {
    userData.load()
      .then(data => 
        fetch(`${API.URL}/api/messages/${userId}`, {
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
  };

  function onSend(messages = []) {
    const [ message ] = messages;
    setMessages((previousMessages) => (GiftedChat.append(previousMessages, messages)));
    postMessage({ content: message.text, type: 2});
    emitSocketPrivateMessage(userId, message);
  };
  
  return (
    <GiftedChat
      locale={'it'}
      renderAvatar={null}
      scrollToBottom={true}
      infiniteScroll={true}
      onSend={onSend}
      onLoadEarlier={loadEarlier}
      loadEarlier={shouldLoadMessages}
      isLoadingEarlier={loading}
      renderLoadEarlier={() => (
        <ActivityIndicator size="large" color="#d3d3d3"/>
      )}
      messages={messages}
      user={{ _id: localUserId }}
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

const styles = StyleSheet.create({

});
