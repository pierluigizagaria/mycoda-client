import React, { Component } from 'react';
import { View, TextField, Text, Button } from 'react-native-ui-lib';
import Constants from "expo-constants";

export default class Pharmacies extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View>
        <Text grey20 text10 marginT-10 marginB-70 center>Pharmacies</Text>
      </View>
    );
  }
}
