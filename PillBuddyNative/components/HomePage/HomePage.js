import React from 'react';
import { StyleSheet, Alert, Text, View, TextInput, Button,TouchableOpacity, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Input } from 'react-native-elements';
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
if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

export default class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isDateTimePickerVisible: false,

      inputName: 'Pill',
      inputDays: [],
      inputTime: [], 
      pillSlots: [],
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
    date = JSON.stringify(date)
    var tempArray = this.state.inputTime;
    date = date.substring(date.indexOf('T')+1,date.length - 9).split(':').join('-') + '-'
    tempArray.push(date);
    console.log(date)
    console.log("Data is  " + tempArray)
    this.setState({
      inputTime: tempArray
    });
    console.log(tempArray)
    this.hideDateTimePicker();
  };

  toggleDay = day => {
    var tempArray = this.state.inputDays;
    var dayFound = this.state.inputDays.includes(day);
    console.log (dayFound);
    if (dayFound) {
      tempArray.splice(tempArray.indexOf(day), 1)
      this.setState({
        inputDays: tempArray
      });
    }
    else {
      tempArray.push(day)
      this.setState({
        inputDays: tempArray
      });
    }
    console.log(this.state.inputDays)
  }

  toggleSlot = slotNum => {
    var tempArray = this.state.pillSlots;
    var slotFound = this.state.pillSlots.includes(slotNum);

    if (slotFound) {
      tempArray.splice(tempArray.indexOf(slotNum), 1)
      this.setState({
        pillSlots: tempArray
      });
    }
    else {
      tempArray.push(slotNum)
      this.setState({
        pillSlots: tempArray
      });
    }
  }

  metaExist = () => {
    let metaRef = firebase.database().ref('PillInfo/' + userId + '/MetaInfo')

    metaRef.on('value', (snapshot) => {
      let data = snapshot.val();
      metaData = Object.values(data)
      return metaData.length == 0 ? false: true
    })
  }

  updatePillTakenSchedule = () => {
    console.log("WE EHRE EF")
    let userId = firebase.auth().currentUser.uid;
    let pillsRef = firebase.database().ref('PillInfo/' + userId + '/Pills');
    //console.log(this.metaExist())
    pillsRef.on('value', (snapshot) => {
        let data = snapshot.val();
        let pills = Object.values(data);
        console.log("The Data");
        console.log(data);
        console.log(pills);
        let daysTakenJSON = {'0':{}, '1':{}, '2':{}, '3':{}, '4':{}, '5':{}, '6':{}};
        for (var index in pills) {
          console.log("Printing out obj")
          console.log(pills[index])
          var obj = pills[index]
          console.log(obj['pillName'])
          obj['days'].forEach(day => {
            let timeToTake = []
            obj['times'].forEach(time => {
              timeToTake[0] = {'time': time, 'taken': false}
            });
            daysTakenJSON[day][obj['pillName']] = timeToTake
          });
        }
        console.log("See the days taken json")
        firebase.database().ref('PillInfo/' + userId + '/MetaInfo').push({
          daysTakenJSON
        }).then((data)=>{
          //success callback
          console.log('data ' , data)
          console.log(this.state)
      }).catch((error)=>{
          //error callback
          console.log('error ' , error)
      })
        console.log(daysTakenJSON)
     });
  }

  writeUserData = (pillName, days,times, pillSlots, doses) => {
    console.log(times);
    times = times.map(time =>{
      days.forEach(day => {
        return time += JSON.stringify(day)
        
      });
      time+= '-'
      pillSlots.forEach(slot => {
        return time += JSON.stringify(slot)
      });
      return time
    })
    console.log(times)
    userId = firebase.auth().currentUser.uid
    firebase.database().ref('PillInfo/' + userId + '/Pills').push({
        pillName,
        doses,
        days,
        times,
        pillSlots
    }).then((data)=>{
        //success callback
        console.log('data ' , data)
        console.log(this.state)
    }).catch((error)=>{
        //error callback
        console.log('error ' , error)
    })
    this.updatePillTakenSchedule();
    Alert.alert('Pill saved successfully!')
  }
  someFunction = () => {
    console.log("HELLO")
  }

  render() {
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.background}>
          <View style={styles.page}>
            <Text style={styles.tabText}>Add New Pill</Text>
            <Input
              label='Enter the Name of Medication'
              onChangeText={(text) =>{this.setState({inputName: text})}}
            />
            <DateTimePicker
                isVisible={this.state.isDateTimePickerVisible}
                onConfirm={this.handleDatePicked}
                onCancel={this.hideDateTimePicker}
                mode = {'time'}
            />
          </View>
          <Text>Select days of the week to take pill</Text>
          <View style={styles.checkboxContainer}>             
            <TouchableOpacity style={this.state.inputDays.includes(0)? styles.activeCheckbox: styles.inactiveCheckbox} onPress={() => this.toggleDay(0)}>
              <Text>Su</Text>
            </TouchableOpacity>
            <TouchableOpacity style={this.state.inputDays.includes(1)? styles.activeCheckbox: styles.inactiveCheckbox} onPress={() => this.toggleDay(1)}>
              <Text>M</Text>
            </TouchableOpacity>
            <TouchableOpacity style={this.state.inputDays.includes(2)? styles.activeCheckbox: styles.inactiveCheckbox} onPress={() => this.toggleDay(2)}>
              <Text>Tu</Text>
            </TouchableOpacity>
            <TouchableOpacity style={this.state.inputDays.includes(3)? styles.activeCheckbox: styles.inactiveCheckbox} onPress={() => this.toggleDay(3)}>
              <Text>W</Text>
            </TouchableOpacity>
            <TouchableOpacity style={this.state.inputDays.includes(4)? styles.activeCheckbox: styles.inactiveCheckbox} onPress={() => this.toggleDay(4)}>
              <Text>Thu</Text>
            </TouchableOpacity>
            <TouchableOpacity style={this.state.inputDays.includes(5)? styles.activeCheckbox: styles.inactiveCheckbox} onPress={() => this.toggleDay(5)}>
              <Text>F</Text>
            </TouchableOpacity>
            <TouchableOpacity style={this.state.inputDays.includes(6)? styles.activeCheckbox: styles.inactiveCheckbox} onPress={() => this.toggleDay(6)}>
              <Text>Sa</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.checkboxContainer}>
              <TouchableOpacity style={styles.timeContainer} onPress={this.showDateTimePicker}>
                <Text>Add Time to Take Pill</Text>
              </TouchableOpacity>
              <View>
              {this.state.inputTime.map(time => {return <Text>{time}</Text>})}
              </View>
              
          </View>
          <View style={styles.checkboxContainer}>
            <TouchableOpacity style={this.state.pillSlots.includes(0)? styles.activePillSlot: styles.inactivePillSlot} onPress={() => this.toggleSlot(0)}><Text>A</Text></TouchableOpacity>
            <TouchableOpacity style={this.state.pillSlots.includes(1)? styles.activePillSlot: styles.inactivePillSlot} onPress={() => this.toggleSlot(1)}><Text>B</Text></TouchableOpacity>
            <TouchableOpacity style={this.state.pillSlots.includes(2)? styles.activePillSlot: styles.inactivePillSlot} onPress={() => this.toggleSlot(2)}><Text>C</Text></TouchableOpacity>
            <TouchableOpacity style={this.state.pillSlots.includes(3)? styles.activePillSlot: styles.inactivePillSlot} onPress={() => this.toggleSlot(3)}><Text>D</Text></TouchableOpacity>
          </View>
          
          <Button title="Add Pill" onPress={() => this.writeUserData(this.state.inputName, this.state.inputDays, this.state.inputTime, this.state.pillSlots, this.state.numDoses)} />
          <View style={styles.container}>
            <TextInput 
                placeholder='Choose doses'
                keyboardType='numeric'
                value={this.state.myNumber}
                maxLength={10}  //setting limit of input
                onChangeText={(text) => this.setState({numDoses: text})}
            />
          </View> 
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#4285f4',
    padding: 10
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
  timeContainer: {
    width: 150,
    height: 50, 
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center'
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
  activeCheckbox: {
    width: 50,
    height: 50,
    backgroundColor: 'green',
    justifyContent: 'center', 
    alignItems: 'center'
  },
  inactiveCheckbox: {
    width: 50,
    height: 50,
    backgroundColor: 'white',
    justifyContent: 'center', 
    alignItems: 'center'
  },
  activePillSlot: {
    width: 75,
    height: 80,
    backgroundColor: 'green',
    alignItems: 'center',
    justifyContent: 'center'
  },
  inactivePillSlot: {
    width: 75,
    height: 80,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center'
  },
  checkboxContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  tabText: {
    margin: 10,
    fontSize: 40,
    alignSelf: "center"
  },
});
