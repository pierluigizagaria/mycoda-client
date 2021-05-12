import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { ThemeProvider } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { View, Text, Image } from 'react-native-ui-lib';

export default class PharmacyItem extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Image
          style={styles.logo}
          source={{
            uri: this.props.imgUri,
          }}
        />
        <View flex paddingH-10 centerV>
          <View row spread centerV>
            <Text grey10 text65>{this.props.name}</Text>
          </View>
          <View row centerV>
            <MaterialCommunityIcons name="map-marker" size={16} color="red"/>
            <Text grey20 text80>{this.props.address}</Text>
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
    margin: 13,
    overflow: 'hidden',
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: 18,
  },
});
