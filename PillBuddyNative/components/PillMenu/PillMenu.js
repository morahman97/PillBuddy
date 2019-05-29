import React from 'react';
import { Button, View, Text, StyleSheet } from 'react-native';
import { createStackNavigator, createAppContainer } from 'react-navigation';

import HomePage from '../../components/HomePage/HomePage';

class MenuScreen extends React.Component {
  render() {
    return (
      <View style={styles.tabContent}>
        <Text style={styles.tabText}>Pill Menu</Text>
        <Button
          title="Input a new pill"
          onPress={() => this.props.navigation.navigate('Input')}
        />
      </View>
    );
  }
}

class InputScreen extends React.Component {
  render() {
    return (
        <HomePage/>
    );
  }
}

const RootStack = createStackNavigator(
  {
    Menu: MenuScreen,
    Input: InputScreen,
  },
  {
    initialRouteName: 'Menu',
  }
);

const AppContainer = createAppContainer(RootStack);

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
