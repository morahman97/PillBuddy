import React from 'react';
import { AppRegistry, TabBarIOS, StyleSheet, Text, View, Button} from 'react-native';
import firebase from 'firebase';

export default class ViewPills extends React.Component {

  getMyPills() {
    var userId = firebase.auth().currentUser.uid;
    return firebase.database().ref('PillInfo/' + userId).once('value').then(function(snapshot) {
      snapshot.forEach(function(childNodes){
        console.log(childNodes.val().pillName);
      });
      //var data = snapshot.val();
      //console.log(data)
    });
  }

  render() {
    return (
      <View style={styles.tabContent}>
        <Text style={styles.tabText}>My Pills</Text>
        <Button title="View my Pills" onPress={() => this.getMyPills()} />
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

