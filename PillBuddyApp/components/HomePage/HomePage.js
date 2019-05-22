import React from 'react';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';
import DateTimePicker from "react-native-modal-datetime-picker"

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

export default class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isDateTimePickerVisible: false,
      inputName: '',
      inputDate: [], 
      numDoses: ''
    };
  }

  showDateTimePicker = () => {
    this.setState({ isDateTimePickerVisible: true });
  };

  hideDateTimePicker = () => {
    this.setState({ isDateTimePickerVisible: false });
  };

  handleDatePicked = date => {
    console.log("A date has been picked: ", date);
    this.hideDateTimePicker();
  };

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
      <View style={styles.background}>
        <View style={styles.title}>
          <Text>PillBuddy</Text>
        </View>
        <View style={styles.page}>
          <View style={styles.container}>
              <Text>Enter Pill Information</Text>
          </View>
          <View style={styles.container}>
              <TextInput
              placeholder="Enter the Name of Medication"
              maxLength={20}
              />
          </View>
          <View style={styles.container}>
              <Button title="Select Time to Take Pill" onPress={this.showDateTimePicker} />
          </View>
          <DateTimePicker
              isVisible={this.state.isDateTimePickerVisible}
              onConfirm={this.handleDatePicked}
              onCancel={this.hideDateTimePicker}
              mode = {'time'}
          />
          <View style={styles.container}>
              <TextInput 
                  placeholder='Choose doses'
                  keyboardType='numeric'
                  value={this.state.myNumber}
                  maxLength={10}  //setting limit of input
              />
          </View>
        </View>
          <Button title="Add Pill" onPress={() => this.writeUserData('dicksuk@ucsd.edu', 'Shaheryar', 'Shak')} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#4285f4',
    padding: 40
  },
  title: {
    height: 50,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 50,
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 50,
    height: 50,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: '#d6d7da',
    backgroundColor: 'white',
  },
  page: {
      backgroundColor: '#4285f4',
      paddingBottom: 50,
  },
  title: {
    fontSize: 19,
    fontWeight: 'bold',
  },
  activeTitle: {
    color: 'red',
  },
});
