import React, { Component, useState } from 'react';
import { ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/core';
import { View, TextField, Text, Button } from 'react-native-ui-lib';
import { API } from '../../config/config';

export default function SendPayment({route}) {

  const { userId, localUser } = route.params;
  const { accessToken } = localUser;

  const navigation = useNavigation();
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  function onSendPayment() {
    if (amount <= 0 || description === '') {
      return Alert.alert('Totale o descrizione non validi');
    }
    fetch(`${API.URL}/api/payments/${userId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        amount,
        description,
      })
    })
      .then((response) => response.json())
      .then((json) => {
        if ('error' in json) throw new Error(json.error.message);
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
          <Button text70 white background-primaryColor label="Invia pagamento" borderRadius={10} marginT-10
            onPress={onSendPayment} />
        </View>
      </View>
    </ScrollView>
  );
}
