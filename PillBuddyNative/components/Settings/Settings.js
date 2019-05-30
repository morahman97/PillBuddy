import React from 'react';
import { Button, View, Text, StyleSheet } from 'react-native';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import firebase from 'firebase';
import Connect from '../Connect/Connect';

class SettingsScreen extends React.Component {
  render() {
    return (
      <View style={styles.tabContent}>
        <Text style={styles.tabText}>Settings Menu</Text>
        <Button
          title="Connect a PillBuddy device"
          onPress={() => this.props.navigation.navigate('Connect')}
        />
       <Button
          title="Sign out"
          onPress={() => firebase.auth().signOut()}
        />
      </View>
    );
  }
}

class ConnectScreen extends React.Component {
  render() {
    return (
      <Connect/>
    );
  }
}


const SettingsStack = createStackNavigator(
  {
    SettingsMenu: SettingsScreen,
    Connect: ConnectScreen,
  },
  {
    initialRouteName: 'SettingsMenu',
  }
);

const AppContainer = createAppContainer(SettingsStack);

export default class App extends React.Component {
  render() {
    return <AppContainer />;
  }
}

var styles = StyleSheet.create({
  tabContent: {
    flex: 1,
    alignItems: 'center'
  },
  tabText: {
    margin: 50,
    fontSize: 40
  }
});
