import React from 'react';
import { StyleSheet, Text, View, Button} from 'react-native';
import { FormLabel, FormInput, FormValidationMessage } from 'react-native-elements';
import InputPillForm from './components/InputPillForm/InputPillForm';

var firebase = require("firebase");

var config = {
  apiKey: "AIzaSyDrnrsaVw0RLyz6Gf-Ezd0dUK81DCQkCP4",
  authDomain: "pill-buddy.firebaseapp.com",
  databaseURL: "https://pill-buddy.firebaseio.com",
  projectId: "pill-buddy",
  storageBucket: "pill-buddy.appspot.com",
  messagingSenderId: "773140406620",
  appId: "1:773140406620:web:76284dc0f19fbe9f"
};
// Initialize Firebase
firebase.initializeApp(config);

export default class App extends React.Component {

  writeUserData = (email,fname,lname) => {
    firebase.database().ref('UsersList/').push({
        email,
        fname,
        lname
    }).then((data)=>{
        //success callback
        console.log('data ' , data)
    }).catch((error)=>{
        //error callback
        console.log('error ' , error)
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Open up App.js to start working on your app!</Text>
        <InputPillForm></InputPillForm>
        <Button title="Suk a dik" onPress={() => this.writeUserData('dicksuk@ucsd.edu', 'Shaheryar', 'Shak')} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 40
  },
});
