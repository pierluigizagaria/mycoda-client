import React, { useContext, useEffect, useState, useRef } from 'react';
import { StyleSheet, View, ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import { GiftedChat, Actions, Bubble } from 'react-native-gifted-chat';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import 'dayjs/locale/it';
import { API } from '../../config/config';
import { SocketContext } from '../SocketContext';
import { useNavigation, useTheme } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';

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

  useEffect(() => loadMessages(), []);

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
        createdAt: message.time,
        user: { _id: message.mittente },
        payment,
      };
      setMessages(prevMessages => GiftedChat.append(prevMessages, [paymentMessage]));
      emitSocketPrivateMessage(userId, paymentMessage);
    }
  }, [route.params?.post]);

  const loadMessages = () => {
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

  const fetchMessages = async (offset, limit) => {
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
          ...(message.tipo === 1 && { image: message.location }),
          ...(message.tipo === 2 && { text: message.content }),
          ...(message.tipo === 3 && { payment: message.payment }),
        })) : [];
      })
  };

  const postMessage = async ({ content, type }) => {
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

  const onSend = ([message]) => {
    const messageSent = { ...message, status: 'sent', type: 2 };
    setMessages(prevMessages => GiftedChat.append(prevMessages, [messageSent]));
    postMessage({ content: message.text, type: 2 })
      .then(() => {
        if (!socket) return;
        emitSocketPrivateMessage(userId, messageSent);
      });
  };

  const emitSocketPrivateMessage = (userId, message) => {
    socket.emit('privateMessage', { to: userId, message }, () => {
      const updatedMessages = messagesRef.current.map(m =>
        m._id === message._id ? ({ ...m, status: 'received' }) : m
      );
      setMessages(updatedMessages);
    });
  };

  const onSocketPrivateMessage = payload => {
    if (userId !== payload.from) return;
    setMessages(prevMessages => GiftedChat.append(prevMessages, payload.message));
    socket.emit('messageReaded', { to: payload.from, message: payload.message });
  };

  const onSocketMessageReaded = ({ message }) => {
    const updatedMessages = messagesRef.current.map(m =>
      m._id === message._id ? ({ ...m, status: 'readed' }) : m
    );
    setMessages(updatedMessages);
  }


  const openPaymentModal = url => {
    navigation.navigate('paypal-web-modal', { uri: url });
  };

  const onCameraAction = () => {
    ImagePicker.launchCameraAsync()
      .then(({ cancelled, uri }) => {
        if (cancelled) return;
        uploadPicture(uri)
          .then(json => {
            const pictureMessage = {
              _id: json.message.id,
              type: json.message.tipo,
              status: 'sent',
              user: { _id: localUserId },
              createdAt: json.message.time,
              image: json.message.location,
            };
            setMessages(prevMessages => GiftedChat.append(prevMessages, pictureMessage))
            emitSocketPrivateMessage(userId, pictureMessage);
          })
          .catch(error => console.error(error));
      })
      .catch(error => console.error(error));
  };

  const onPaymentAction = () => {
    navigation.navigate('send-payment', route.params);
  }

  const uploadPicture = async localUri => {
    let filename = localUri.split('/').pop();
    let match = /\.(\w+)$/.exec(filename);
    let type = match ? `image/${match[1]}` : `image`;
    let formData = new FormData();
    formData.append('image', { uri: localUri, name: filename, type });
    const response = await fetch(`${API.URL}/api/images/${userId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
      body: formData,
    });
    return await response.json();
  };

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
    const { type, payment, user } = props.currentMessage;
    switch (type) {
      case 3:
        return (
          <View style={styles.paymentContainer}>
            <Text style={styles.paymentText}>{payment.description}</Text>
            <Text style={styles.paymentAmount}>{`${payment.somma} €`}</Text>
            <TouchableOpacity style={styles.paymentButton} 
              disabled={user._id === localUserId}
              onPress={() => openPaymentModal(payment.approvalUrl)}>
              <Text>Paga con </Text>
              <FontAwesome name="paypal" size={24} color="black" />
            </TouchableOpacity>
          </View>
        );
      default:
        return null;
    }
  };

  const renderTicks = ({ status, user }) => {
    if (localUserId !== user._id) return;
    switch (status) {
      case 'sent':
        return <Ionicons name={"time-outline"} style={styles.messageTicks} />;
      case 'received':
        return <Ionicons name={"checkmark-sharp"} style={styles.messageTicks} />;
      case 'readed':
        return <Ionicons name={"checkmark-done-sharp"} style={styles.messageTicks} />;
    }
  };

  const renderBubble = props => {
    const { type } = props.currentMessage;
    return (
      <Bubble
        {...props}
        textStyle={{ left: { color: 'white' } }}
        timeTextStyle={{
          left: { color: 'white', fontSize: 12 },
          right: { color: 'white', fontSize: 12 },
        }}
        wrapperStyle={{ 
          right: {
            ...(type === 3 && ({width: '50%'})),
          },
          left: { 
            ...(type === 3 && ({ width: '50%' })),
            backgroundColor: colors.primary 
          } 
        }}
      />
    )
  };

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
      renderCustomView={renderCustomView}
      renderTicks={renderTicks}
      renderBubble={renderBubble}
      renderLoadEarlier={() => (<ActivityIndicator size="large" color="#d3d3d3" />)}
      renderActions={() => 
        <>
          { loginType === 'pharmacy' && (
            <Actions
              onPressActionButton={onPaymentAction}
              icon={() => (<Ionicons name="card" size={24} color={colors.primary} />)}/>
          )} 
          <Actions
            icon={() => (<Ionicons name="camera" size={24} color={colors.primary} />)}
            onPressActionButton={onCameraAction}/>
        </>
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
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  paymentText: { 
    paddingBottom: 8, 
    color: 'white' 
  },
  paymentAmount: {
    textAlign: 'center',
    fontSize: 24,
    paddingBottom: 8,
    fontWeight: 'bold',
    color: 'white'
  },
  paymentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffc439',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 4,
  },
  modal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  modalContainer: {
    backgroundColor: 'white',
    width: '100%',
    height: '100%',
  },
});
