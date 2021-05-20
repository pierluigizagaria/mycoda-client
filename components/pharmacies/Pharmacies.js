import React, { Component } from 'react';
import { View, TextField, Text, Button } from 'react-native-ui-lib';
import Constants from "expo-constants";
import PharmacyList from './PharmacyList'

export default class Pharmacies extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View flex>
        <PharmacyList />
      </View>
    );
  }
}
