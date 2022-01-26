import React, { Component } from 'react';
import { FlatList } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { API } from '../../config/config';
import PharmacyItem from './PharmacyItem';
import localUserData from '../../helpers/localUserData';

export default class Pharmacies extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pharmacies: [],
      refreshing: false
    };
    this.fetchPharmacies = this.fetchPharmacies.bind(this);
  }

  componentDidMount() {
    this.fetchPharmacies();
  }

  fetchPharmacies() {
    this.setState({ refreshing: true });
    localUserData.load()
      .then(data => {
        return fetch(`${API.URL}/api/pharmacies`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${data.accessToken}`,
          },
        });
      })
      .then(response => response.json())
      .then(json => this.setState({
        pharmacies: json,
        refreshing: false
      }))
      .catch(error => console.error(error))
  }

  render() {
    return (
      <FlatList
        data={this.state.pharmacies}
        keyExtractor={item => item.pIva}
        onRefresh={this.fetchPharmacies}
        refreshing={this.state.refreshing}
        renderItem={({ item }) => (
          <PharmacyItem
            key={item.pIva}
            navigation={this.props.navigation}
            userId={item.pIva}
            name={item.ragSociale}
            address={item.indirizzo}
            imgUri="https://reactnative.dev/img/tiny_logo.png" />
        )} />
    );
  }
}
