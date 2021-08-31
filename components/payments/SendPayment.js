import React, { Component, useState } from 'react';
import { ScrollView, Alert, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation, StackActions  } from '@react-navigation/core';
import { View, TextField, Text, Button } from 'react-native-ui-lib';
import { API } from '../../config/config';

export default function SendPayment({route}) {

  const { userId, localUser } = route.params;
  const { accessToken } = localUser;

  const navigation = useNavigation();
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [sendingPayment, setSendingPayment] = useState(false);

  function onSendPayment() {
    if (amount <= 0 || description === '') {
      return Alert.alert('Totale o descrizione non validi');
    }
    setSendingPayment(true);
    fetch(`${API.URL}/api/payments/${userId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        somma: amount,
        desc: description,
      })
    })
      .then((response) => response.json())
      .then((json) => {
        if ('error' in json) throw new Error(json.error.message);
        navigation.navigate({
          name: 'chat-room',
          params: { post: { payment: json } },
          merge: true,
        });
      })
      .catch((error) => console.error(error))
  }

  return (
    <ScrollView>
      <View flex paddingH-30 paddingV-30>
        <Text primaryColor text65>Importo</Text>
        <TextField text70 placeholder="Importo pagamento" dark10 keyboardType={"decimal-pad"}
          onChangeText={text => setAmount(text)} />
        <Text primaryColor text65>Descrizione</Text>
        <TextField text70 placeholder="Breve descrizione del pagamento" dark10
          onChangeText={text => setDescription(text)} />
        <View flex top>
          <TouchableOpacity style={sendingPayment ? { ...styles.sendPaymentButton, ...styles.disabledButton } : styles.sendPaymentButton}
            onPress={onSendPayment} 
            disabled={sendingPayment}>
            <Text style={styles.sendPaymentText}>{sendingPayment ? "Invio del pagamento" : "Invia pagamento"}</Text>
            { sendingPayment && (
              <ActivityIndicator style={{ marginHorizontal: 4 }} size="small" color="white" />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  sendPaymentButton: {
    flex: 1,
    flexDirection: 'row',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    backgroundColor: '#45C476',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  sendPaymentText: {
    color: 'white'
  },
  disabledButton: {
    opacity: 0.7,
  },
});
