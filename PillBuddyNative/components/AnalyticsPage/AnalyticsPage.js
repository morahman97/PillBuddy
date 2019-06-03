import React from 'react'
import { Dimensions } from 'react-native'
import { StyleSheet, View, Text, Button,TouchableOpacity, TouchableWithoutFeedback, Keyboard } from 'react-native';

import { BarChart, Grid, XAxis} from 'react-native-svg-charts'
import * as scale from 'd3-scale'

import PillBarChart from '../PillBarChart/PillBarChart'
import { tsConstructorType } from '@babel/types';

export default class AnalyticsPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            displayData: false
        };
    } 

    toggleDisplayData = () => {
        console.log("Hello world")
        this.setState({displayData: !this.state.displayData})
        console.log(this.state.displayData)
    }

    render() {
        
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        data1 = <View style={styles.missedPillContainer}>
                    <Text style={styles.missedDay}>Monday</Text>
                    <Text style={styles.missedPill}>Kadian 12:00pm: 2 doses</Text>
                    <Text style={styles.missedPill}>Vicodin 4:00pm: 3 doses</Text>
                    <Text style={styles.missedPill}>Lomotil 6:00pm: 1 dose</Text>
                </View>
        return (
            <View style={styles.container}>
                <View style={{alignItems: 'center'}}>
                    <Text style={styles.tabText}>Pill History</Text>
                </View>
                    
                <View style={styles.chartTitle}>
                    <Text style={styles.chartTitleText}>Missed Pills this Week</Text>
                </View>
                <TouchableOpacity style={{backgroundColor: 'white'}} onPress={this.toggleDisplayData}>
                    <PillBarChart/>
                </TouchableOpacity>
                <XAxis
                    style={{marginTop: -25}}
                    data={ days }
                    scale={scale.scaleBand}
                    formatLabel={ (value, index) => days[index]}
                    labelStyle={ { color: 'black' } }
                />
                {this.state.displayData ? data1: <Text></Text>}
            </View>
            
            
        )
    }
}


var styles = StyleSheet.create({
    container: {
        backgroundColor: '#4285f4', 
        flex: 1
    },

    tabText: {
      marginTop: 50,
      marginBottom: 20,
      fontSize: 40,
      color: 'white'
    },
    chartTitle: {
        alignItems: 'center',
        marginTop: 30,
        marginBottom: 20,
        color: 'white'
    },
    chartTitleText: {
        fontSize: 30,
        color: 'white'
    },
    showInfo: {
        display: 'none'
    },
    hideInfo: {
        fontSize: 20
    },
    missedPillContainer: {
        alignItems: 'center',
        marginTop: 10
    },

    missedDay: {
        fontSize: 30,
        marginTop: 20,
        marginBottom: 10,
        color: 'white'
    },
    missedPill: {
        fontSize: 20,
        marginBottom: 10,
        color: 'white'
    }
  });