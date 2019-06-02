import React from 'react';
import { AppRegistry, TabBarIOS, StyleSheet, Text, View, Button} from 'react-native';
//import HomePage from './components/HomePage/HomePage';
import PillMenu from '../PillMenu/PillMenu';
import Settings from '../Settings/Settings';
import { createBottomTabNavigator, createAppContainer } from 'react-navigation';
//import Icon from 'react-native-vector-icons/FontAwesome'; // use for tab icons

/**
 * History Tab
 */
class TabHistory extends React.Component {

  render() {
    return (
      <View style={styles.tabContent}>
        <Text style={styles.tabText}>Dosage History</Text>
      </View>
    );
  }

}

/**
 * Pills Tab
 */
class TabPills extends React.Component {

  render() {
    return (
        <PillMenu/>
    );
  }

}

/**
 * Settings Tab
 */
class TabSettings extends React.Component {

  render() {
    return (
      <Settings/>
    );
  }

}

const TabNavigator = createBottomTabNavigator({
  History: TabHistory,
  Pills: TabPills,
  Settings: TabSettings,
});

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

export default createAppContainer(TabNavigator);
