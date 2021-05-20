import React, { Component } from 'react';
import { View, TextField, Text, Button } from 'react-native-ui-lib';
import Constants from "expo-constants";
import PaymentList from './PaymentList'

export default class Payments extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View flex>
        <PaymentList />
      </View>
    );
  }
}
