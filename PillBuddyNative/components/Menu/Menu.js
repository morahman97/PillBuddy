import React from 'react';
import { AppRegistry, TabBarIOS, StyleSheet, Text, View, Button} from 'react-native';
//import HomePage from './components/HomePage/HomePage';
//import PillMenu from '../PillMenu/PillMenu';
import ViewPills from "../ViewPills/ViewPills";
import Settings from '../Settings/Settings';
import PillBarChart from '../PillBarChart/PillBarChart'
import { createBottomTabNavigator, createAppContainer } from 'react-navigation';
import firebase from 'firebase';
import AnalyticsPage from '../AnalyticsPage/AnalyticsPage'

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
        <ViewPills/>
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

class TabAnalytics extends React.Component {
  
  render() {
    return (
      <AnalyticsPage/>
    )
  }
}
const TabNavigator = createBottomTabNavigator({
  Pills: TabPills,
  History: TabAnalytics,
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
