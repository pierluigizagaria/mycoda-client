import React, { Component } from 'react';
import { StyleSheet, TouchableHighlight } from 'react-native';
import { ThemeProvider } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { View, Text, Image } from 'react-native-ui-lib';

export default class PharmacyItem extends Component {

  onPress() {
    this.props.navigation.navigate('chat-room', {
      name: this.props.name,
      userId: this.props.userId,
    });
  }

  render() {
    return (
      <TouchableHighlight
        onPress={() => this.onPress()}
        underlayColor="white">
        <View style={styles.container}>
          <Image
            style={styles.logo}
            source={{
              uri: this.props.imgUri,
            }}
          />
          <View flex paddingH-10>
            <View flex row top>
              <Text grey10 text65>{this.props.name}</Text>
            </View>
            <View flex row bottom centerV>
              <MaterialCommunityIcons name="map-marker" size={16} color="red"/>
              <Text grey20 text80>{this.props.address}</Text>
            </View>
          </View>
        </View>
      </TouchableHighlight>
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

