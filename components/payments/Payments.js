import React, { Component } from 'react';
import { ScrollView } from 'react-native';
import PaymentItem from './PaymentItem';

export default class Payments extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <ScrollView>
        <PaymentItem name="Farmacia Vitti" address="Via Corato, Andria" imgUri="https://reactnative.dev/img/tiny_logo.png" />
        <PaymentItem name="Farmacia Vitti" address="Via Corato, Andria" imgUri="https://reactnative.dev/img/tiny_logo.png" />
        <PaymentItem name="Farmacia Vitti" address="Via Corato, Andria" imgUri="https://reactnative.dev/img/tiny_logo.png" />
        <PaymentItem name="Farmacia Vitti" address="Via Corato, Andria" imgUri="https://reactnative.dev/img/tiny_logo.png" />
        <PaymentItem name="Farmacia Vitti" address="Via Corato, Andria" imgUri="https://reactnative.dev/img/tiny_logo.png" />
        <PaymentItem name="Farmacia Vitti" address="Via Corato, Andria" imgUri="https://reactnative.dev/img/tiny_logo.png" />
        <PaymentItem name="Farmacia Vitti" address="Via Corato, Andria" imgUri="https://reactnative.dev/img/tiny_logo.png" />
        <PaymentItem name="Farmacia Vitti" address="Via Corato, Andria" imgUri="https://reactnative.dev/img/tiny_logo.png" />
        <PaymentItem name="Farmacia Vitti" address="Via Corato, Andria" imgUri="https://reactnative.dev/img/tiny_logo.png" />
        <PaymentItem name="Farmacia Vitti" address="Via Corato, Andria" imgUri="https://reactnative.dev/img/tiny_logo.png" />
        <PaymentItem name="Farmacia Vitti" address="Via Corato, Andria" imgUri="https://reactnative.dev/img/tiny_logo.png" />
        <PaymentItem name="Farmacia Vitti" address="Via Corato, Andria" imgUri="https://reactnative.dev/img/tiny_logo.png" />
        <PaymentItem name="Farmacia Vitti" address="Via Corato, Andria" imgUri="https://reactnative.dev/img/tiny_logo.png" />
        <PaymentItem name="Farmacia Vitti" address="Via Corato, Andria" imgUri="https://reactnative.dev/img/tiny_logo.png" />
        <PaymentItem name="Farmacia Vitti" address="Via Corato, Andria" imgUri="https://reactnative.dev/img/tiny_logo.png" />
      </ScrollView>
    );
  }
}
