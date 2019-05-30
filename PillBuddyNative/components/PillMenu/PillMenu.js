import React from 'react';
import { Button, View, Text, StyleSheet } from 'react-native';
import { createStackNavigator, createAppContainer } from 'react-navigation';

import HomePage from '../../components/HomePage/HomePage';
import ViewPills from '../../components/ViewPills/ViewPills';

class MenuScreen extends React.Component {
  render() {
    return (
      <View style={styles.tabContent}>
        <Text style={styles.tabText}>Pill Menu</Text>
        <Button
          title="Input a new pill"
          onPress={() => this.props.navigation.navigate('Input')}
        />
        <Button
          title="View my pills"
          onPress={() => this.props.navigation.navigate('View')}
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

class ViewScreen extends React.Component {
  render() {
    return (
        <ViewPills/>
    );
  }
}


const RootStack = createStackNavigator(
  {
    Menu: MenuScreen,
    Input: InputScreen,
    View: ViewScreen,
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
