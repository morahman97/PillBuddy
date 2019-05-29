import React from 'react';
import { AppRegistry, TabBarIOS, StyleSheet, Text, View, Button} from 'react-native';
import HomePage from './components/HomePage/HomePage';
import Settings from './components/Settings/Settings';
import { createBottomTabNavigator, createAppContainer } from 'react-navigation';
//import Icon from 'react-native-vector-icons/FontAwesome'; // use for tab icons

/*
export default class StarterTabBarIOS extends React.Component {

  constructor(props) {
    super(props);
    this.state = {selectedTab: 'tabHistory'};
  }

  setTab(tabId) {
    this.setState({selectedTab: tabId});
  }

  render() {
    return (
      <TabBarIOS>
        <TabBarIOS.Item
          title={ 'Dosage History' }
          selected={this.state.selectedTab === 'tabHistory'}
          onPress={() => this.setTab('tabHistory')}>
          <TabHistory/>
        </TabBarIOS.Item>

        <TabBarIOS.Item
          title={ 'Manage Pills' }
          selected={this.state.selectedTab === 'tabPills'}
          onPress={() => this.setTab('tabPills')}>
          <TabPills/>
        </TabBarIOS.Item>

        <TabBarIOS.Item
          title={ 'Settings' }
          selected={this.state.selectedTab === 'tabSettings'}
          onPress={() => this.setTab('tabSettings')}>
          <TabSettings/>
        </TabBarIOS.Item>
      </TabBarIOS>
    );
  }

}*/

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
        <HomePage/>
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
