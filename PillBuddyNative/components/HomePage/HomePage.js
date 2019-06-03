import React from 'react';
import { StyleSheet, Alert, Text, View, TextInput, Button,TouchableOpacity, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { CheckBox } from 'react-native-elements'
import DateTimePicker from "react-native-modal-datetime-picker"
import firebase from 'firebase'

export default class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isDateTimePickerVisible: false,
      inputName: '',
      inputDays: [],
      inputTime: [], 
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
    var tempArray = this.state.inputTime;
    tempArray.push(JSON.stringify(date));
    //console.log(JSON.stringify(date).splice(date.indexOf('T'),date.length - 1))
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
      this.style = styles.inactiveCheckbox;
    }
    else {
      tempArray.push(day)
      this.setState({
        inputDays: tempArray
      });
      this.style = styles.activeCheckbox;
    }
    console.log(this.state.inputDays)
  }

  writeUserData = (pillName, days,times, doses) => {
    userId = firebase.auth().currentUser.uid
    firebase.database().ref('PillInfo/' + userId).push({
        pillName,
        days,
        times,
        doses
    }).then((data)=>{
        //success callback
        console.log('data ' , data)
        console.log(this.state)
    }).catch((error)=>{
        //error callback
        console.log('error ' , error)
    })
    Alert.alert('Pill saved successfully!')
  }

  render() {
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
                onChangeText={(text) =>{this.setState({inputName: text})}}
                />
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
                    onChangeText={(text) => this.setState({numDoses: text})}
                />
            </View> 
          </View>
          <Button title="Add Pill" onPress={() => this.writeUserData(this.state.inputName, this.state.inputDays, this.state.inputTime, JSON.stringify(this.state.numDoses))} />
          <View style={styles.checkboxContainer}>             
            <TouchableOpacity style={this.state.inputDays.includes('Su')? styles.activeCheckbox: styles.inactiveCheckbox} onPress={() => this.toggleDay('Su')}>
              <Text>Su</Text>
            </TouchableOpacity>
            <TouchableOpacity style={this.state.inputDays.includes('M')? styles.activeCheckbox: styles.inactiveCheckbox} onPress={() => this.toggleDay('M')}>
              <Text>M</Text>
            </TouchableOpacity>
            <TouchableOpacity style={this.state.inputDays.includes('Tu')? styles.activeCheckbox: styles.inactiveCheckbox} onPress={() => this.toggleDay('Tu')}>
              <Text>Tu</Text>
            </TouchableOpacity>
            <TouchableOpacity style={this.state.inputDays.includes('W')? styles.activeCheckbox: styles.inactiveCheckbox} onPress={() => this.toggleDay('W')}>
              <Text>W</Text>
            </TouchableOpacity>
            <TouchableOpacity style={this.state.inputDays.includes('Thu')? styles.activeCheckbox: styles.inactiveCheckbox} onPress={() => this.toggleDay('Thu')}>
              <Text>Thu</Text>
            </TouchableOpacity>
            <TouchableOpacity style={this.state.inputDays.includes('F')? styles.activeCheckbox: styles.inactiveCheckbox} onPress={() => this.toggleDay('F')}>
              <Text>F</Text>
            </TouchableOpacity>
            <TouchableOpacity style={this.state.inputDays.includes('Sa')? styles.activeCheckbox: styles.inactiveCheckbox} onPress={() => this.toggleDay('Sa')}>
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
        </View>
      </TouchableWithoutFeedback>
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
    width: 30,
    height: 30,
    backgroundColor: 'green',
    justifyContent: 'center', 
    alignItems: 'center'
  },
  inactiveCheckbox: {
    width: 30,
    height: 30,
    backgroundColor: 'white',
    justifyContent: 'center', 
    alignItems: 'center'
  },
  checkboxContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
});
