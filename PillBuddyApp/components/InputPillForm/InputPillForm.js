import React from 'react';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';
import DateTimePicker from "react-native-modal-datetime-picker"

export default class InputPillForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          isDateTimePickerVisible: false
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
            <View>
                <TextInput
                placeholder="Enter the Name of Medication"
                maxLength={20}
                />
                <Button title="Select Time to Take Pill" onPress={this.showDateTimePicker} />
                <DateTimePicker
                    isVisible={this.state.isDateTimePickerVisible}
                    onConfirm={this.handleDatePicked}
                    onCancel={this.hideDateTimePicker}
                    mode = {'time'}
                />
            </View>

        );
    }
}