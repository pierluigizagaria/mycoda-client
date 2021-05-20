import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { ThemeProvider } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { View, Text, Image } from 'react-native-ui-lib';

export default class PaymentItem extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Image
          style={styles.logo}
          source={{
            uri: this.props.imgUri,
          }}
        />
        <View flex row paddingL-10>
          <View flex spread>
            <View flex spread top>
              <Text grey10 text65>{this.props.name}</Text>
            </View>
            <View flex row bottom>
              <MaterialCommunityIcons name="cart" size={18} color="red" />
              <Text numberOfLines={1} ellipsizeMode='tail' grey20 text80 style={styles.text}>{"Compresse speciali ultra lunghe magiche"}</Text>
            </View>
          </View>
          <View flex row right centerV>
            <Text numberOfLines={1} grey20 text70 style={styles.text}>{"3.50"}</Text>
            <MaterialCommunityIcons name="currency-eur" size={16} color="red" />
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    height: 50,
    margin: 14,
    overflow: 'hidden',
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: 18,
  },
});

