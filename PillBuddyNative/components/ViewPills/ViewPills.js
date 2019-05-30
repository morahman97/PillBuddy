import React from 'react';
import { AppRegistry, TabBarIOS, StyleSheet, Text, View, Button} from 'react-native';

export default class ViewPills extends React.Component {

  render() {
    return (
      <View style={styles.tabContent}>
        <Text style={styles.tabText}>My Pills</Text>
      </View>
    );
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

