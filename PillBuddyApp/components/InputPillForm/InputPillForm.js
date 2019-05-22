import React from 'react';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';
import DateTimePicker from "react-native-modal-datetime-picker"

export default class InputPillForm extends React.Component {
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
    render() {
        return (
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

        );
    }
}

const styles = StyleSheet.create({
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