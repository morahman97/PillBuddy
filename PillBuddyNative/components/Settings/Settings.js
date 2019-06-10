import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import firebase from 'firebase';
import Connect from '../Connect/Connect';
import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';

class SettingsScreen extends React.Component {
  render() {
    return (
      <View style={styles.tabContent}>
        <Text style={styles.tabText}>Settings</Text>
        <Button
          title="Connect PillBuddy"
          onPress={() => this.props.navigation.navigate('Connect')}
          icon={
            <Icon
              name="bluetooth-b"
              size={20}
              color="white"
            />
          }
          titleStyle={{ marginLeft:10 }}
        />
       <Button
          buttonStyle={{ marginTop:20 }}
          title="Sign out"
          onPress={() => firebase.auth().signOut()}
          icon={
            <Icon
              name="sign-out"
              size={20}
              color="white"
            />
          }
          titleStyle={{ marginLeft:10 }}
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
    alignItems: 'center',
    flexDirection: 'column',
    backgroundColor: '#ececf4',
  },
  tabText: {
    margin: 50,
    fontSize: 40
  }
});
