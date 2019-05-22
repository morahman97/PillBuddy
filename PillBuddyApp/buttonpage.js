import React from 'react';
import { StyleSheet, Text, View, Button} from 'react-native';

export default class ButtonPage extends React.Component {
    render () {
        return (
            <View>
                <Button title="Navigate to Input Pill" onPress={() => this.props.navigation.navigate('HomePage')}/>
            </View>
        )
    }
};