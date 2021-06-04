import React, { Component } from 'react';
import { ScrollView } from 'react-native';
import PharmacyItem from './PharmacyItem';

export default class Pharmacies extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <ScrollView>
        <PharmacyItem name="Farmacia Vitti" address="Via Corato, Andria" imgUri="https://reactnative.dev/img/tiny_logo.png" />
        <PharmacyItem name="Farmacia Vitti" address="Via Corato, Andria" imgUri="https://reactnative.dev/img/tiny_logo.png" />
        <PharmacyItem name="Farmacia Vitti" address="Via Corato, Andria" imgUri="https://reactnative.dev/img/tiny_logo.png" />
        <PharmacyItem name="Farmacia Vitti" address="Via Corato, Andria" imgUri="https://reactnative.dev/img/tiny_logo.png" />
        <PharmacyItem name="Farmacia Vitti" address="Via Corato, Andria" imgUri="https://reactnative.dev/img/tiny_logo.png" />
        <PharmacyItem name="Farmacia Vitti" address="Via Corato, Andria" imgUri="https://reactnative.dev/img/tiny_logo.png" />
        <PharmacyItem name="Farmacia Vitti" address="Via Corato, Andria" imgUri="https://reactnative.dev/img/tiny_logo.png" />
        <PharmacyItem name="Farmacia Vitti" address="Via Corato, Andria" imgUri="https://reactnative.dev/img/tiny_logo.png" />
        <PharmacyItem name="Farmacia Vitti" address="Via Corato, Andria" imgUri="https://reactnative.dev/img/tiny_logo.png" />
        <PharmacyItem name="Farmacia Vitti" address="Via Corato, Andria" imgUri="https://reactnative.dev/img/tiny_logo.png" />
        <PharmacyItem name="Farmacia Vitti" address="Via Corato, Andria" imgUri="https://reactnative.dev/img/tiny_logo.png" />
        <PharmacyItem name="Farmacia Vitti" address="Via Corato, Andria" imgUri="https://reactnative.dev/img/tiny_logo.png" />
        <PharmacyItem name="Farmacia Vitti" address="Via Corato, Andria" imgUri="https://reactnative.dev/img/tiny_logo.png" />
        <PharmacyItem name="Farmacia Vitti" address="Via Corato, Andria" imgUri="https://reactnative.dev/img/tiny_logo.png" />
        <PharmacyItem name="Farmacia Vitti" address="Via Corato, Andria" imgUri="https://reactnative.dev/img/tiny_logo.png" />
      </ScrollView>
    );
  }
}
