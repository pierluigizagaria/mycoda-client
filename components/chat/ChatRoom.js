import React, { useContext, useEffect, useState, useRef } from 'react';
import { StyleSheet, View, ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import { GiftedChat, Actions, Bubble, Time } from 'react-native-gifted-chat';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import 'dayjs/locale/it';
import { API } from '../../config/config';
import { SocketContext } from '../SocketContext';
import { useNavigation, useTheme } from '@react-navigation/native';

export default function ChatRoom({ route }) {

  const { userId, localUser } = route.params;
  const { id: localUserId, type: loginType, accessToken } = localUser;

  const MESSAGES_PER_LOAD = 30;

  const navigation = useNavigation();
  const { colors } = useTheme();

  const [messages, setMessages] = useState([]);
  const [messagesOffset, setMessagesOffset] = useState(0);
  const [loading, setLoading] = useState(true);
  const [shouldLoadMessages, setShouldLoadMessages] = useState(true);

  const { socket } = useContext(SocketContext);

  const messagesRef = useRef();
  messagesRef.current = messages;

  useEffect(loadMessages, []);

  useEffect(() => {
    socket.on('privateMessage', onSocketPrivateMessage);
    socket.on('messageReaded', onSocketMessageReaded);
    return () => {
      socket.off('privateMessage', onSocketPrivateMessage);
      socket.off('messageReaded', onSocketMessageReaded);
    };
  }, [socket]);

  useEffect(() => {
    if (route.params?.post?.payment) {
      const { message, payment } = route.params.post.payment;
      const paymentMessage = {
        _id: message.id,
        type: message.tipo,
        status: message.readed ? 'readed' : 'received',
        user: { _id: message.mittente },
        payment,
      };
      setMessages(prevMessages => GiftedChat.append(prevMessages, [paymentMessage]));
      emitSocketPrivateMessage(userId, paymentMessage);
    }
  }, [route.params?.post]);

  function loadMessages() {
    setLoading(true);
    fetchMessages(messagesOffset, MESSAGES_PER_LOAD)
      .then(messages => {
        setMessagesOffset(prevOffset => prevOffset + messages.length);
        setShouldLoadMessages(messages.length === MESSAGES_PER_LOAD);
        setMessages(prevMessages => GiftedChat.prepend(prevMessages, messages));
        setLoading(false);
      })
      .catch((error) => {
        setShouldLoadMessages(false);
        setLoading(false);
        console.error(error);
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
          type: message.tipo,
          status: message.readed ? 'readed' : 'received',
          user: { _id: message.mittente },
          createdAt: message.time,
          ...(message.tipo === 1 && {
            //image: message.location
            text: 'Immagine',
          }),
          ...(message.tipo === 2 && {
            text: message.content,
          }),
          ...(message.tipo === 3 && {
            payment: message.payment,
            text: 'Pagamento',
          }),
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
      body: JSON.stringify({ content, msgType: type })
    })
      .then((response) => response.json())
      .then((json) => {
        if ('error' in json) throw new Error(json.error.message);
      })
      .catch((error) => console.error(error))
  };

  function onSend([message]) {
    const messageSent = { ...message, pending: true, type: 2 };
    setMessages(prevMessages => GiftedChat.append(prevMessages, [messageSent]));
    postMessage({ content: message.text, type: 2 })
      .then(() => {
        if (!socket) return;
        emitSocketPrivateMessage(userId, messageSent);
      });
  };

  function emitSocketPrivateMessage(userId, message) {
    socket.emit('privateMessage', { to: userId, message }, () => {
      const updatedMessages = messagesRef.current.map(m =>
        m._id === message._id ? ({ ...m, sent: true }) : m
      );
      setMessages(updatedMessages);
    });
  };

  function onSocketPrivateMessage(payload) {
    setMessages((prevMessages) => GiftedChat.append(prevMessages, payload.message));
    socket.emit('messageReaded', { to: payload.from, message: payload.message });
  };

  function onSocketMessageReaded({ message }) {
    const updatedMessages = messagesRef.current.map(m =>
      m._id === message._id ? ({ ...m, received: true }) : m
    );
    setMessages(updatedMessages);
  }

  const renderChatEmpty = () => {
    if (loading) return null;
    return (
      <View style={styles.emptyChatView}>
        <View style={styles.emptyChatContainer}>
          <Text style={styles.emptyChatText}>
            {`Il team MyCoda ti da il benvenuto.
Avvia una conversazione ora e acquista in sicurezza`}
          </Text>
        </View>
      </View>
    );
  };

  const renderCustomView = props => {
    const { user, type, payment } = props.currentMessage;
    switch (type) {
      case 3:
        return (
          <View style={{ ...styles.paymentContainer, ...((localUserId !== user._id) && { paddingBottom: 18 }) }}>
            <Text style={{ paddingBottom: 12, color: 'white' }}>{payment.desc}</Text>
            <TouchableOpacity style={{
              backgroundColor: '#ffc439',
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 4,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
              <Text>Paga con </Text>
              <FontAwesome name="paypal" size={24} color="black" />
            </TouchableOpacity>
          </View>
        );
      default:
        return null;
    }
  };

  const renderBubble = props => {
    return (
      <Bubble
        {...props}
        textStyle={{ left: { color: 'white' } }}
        timeTextStyle={{
          left: { color: 'white', fontSize: 12 },
          right: { color: 'white', fontSize: 12 },
        }}
        wrapperStyle={{ left: { backgroundColor: colors.primary } }}
      />
    )
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
      onLoadEarlier={loadMessages}
      renderChatEmpty={renderChatEmpty}
      renderTime={props => <Time {...props} />}
      renderCustomView={renderCustomView}
      renderLoadEarlier={() => (<ActivityIndicator size="large" color="#d3d3d3" />)}
      renderBubble={renderBubble}
      renderActions={() => loginType === 'pharmacy' ?
        (<>
          <Actions
            onPressActionButton={() => { navigation.navigate('send-payment', route.params); }}
            icon={() => (<Ionicons name="camera" size={24} color={colors.primary} />)}
          />
          <Actions
            onPressActionButton={() => { navigation.navigate('send-payment', route.params); }}
            icon={() => (<Ionicons name="card" size={24} color={colors.primary} />)}
          />
        </>) : null
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
  },
  emptyChatView: {
    flex: 1,
    transform: [{ scaleY: -1 }],
    justifyContent: 'center',
    alignItems: 'center'
  },
  emptyChatContainer: {
    backgroundColor: '#45C476',
    width: '70%',
    padding: 16,
    borderRadius: 16,
  },
  emptyChatText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 16,
  },
  paymentContainer: {
    paddingHorizontal: 18,
    paddingTop: 12,
  }
});
