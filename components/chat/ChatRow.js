import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { View, TextField, Text, Button, Image } from 'react-native-ui-lib';

export default class ChatRow extends Component {
    render() {
        return (
            <View style={styles.container}>
                <Image
                    style={styles.logo}
                    source={{
                        uri: 'https://reactnative.dev/img/tiny_logo.png',
                    }}
                />
                <View flex paddingL-10 centerV>
                    <Text grey20 text65>{this.props.name}</Text>
                    <Text grey20 text80>{this.props.lastMessage}</Text>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flexShrink: 1,
        flexDirection: "row",
        height: 50,
        margin: 12,
        overflow: 'hidden',
    },
    logo: {
        width: 50,
        height: 50,
        borderRadius: 18,
    },
});

