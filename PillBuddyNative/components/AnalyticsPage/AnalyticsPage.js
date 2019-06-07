import React from 'react'
import { Dimensions } from 'react-native'
import { StyleSheet, View, Text, Button,TouchableOpacity, TouchableWithoutFeedback, Keyboard } from 'react-native';

import { BarChart, Grid, XAxis} from 'react-native-svg-charts'
import * as scale from 'd3-scale'

import PillBarChart from '../PillBarChart/PillBarChart'
import { tsConstructorType } from '@babel/types';

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


export default class AnalyticsPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            displayData: false, 
            dataToDisplay: []
        };
    } 

    componentDidMount() {
        let userId = firebase.auth().currentUser.uid
        let pillsRef = firebase.database().ref('PillInfo/' + userId + '/MetaInfo');
        pillsRef.limitToLast(1).on('value', (snapshot) => {
            let data = snapshot.val();
            let metaInfo = Object.values(data);
            console.log("printing out pill data")
            console.log(metaInfo[0]['daysTakenJSON'][0])
            var tempArray = this.parsePillData(metaInfo[0]['daysTakenJSON'][0]);
            this.setState({
                dataToDisplay: tempArray
            })
        });
    }

    parseTime  = (time) => {
        timeSubstring = time.substring(0,5).split('-').join(':')
        return timeSubstring
    }

    parsePillData = (mondayData) => {
        let componentArray = []
        for (var key in mondayData) {
            if (!mondayData[key]['taken']) {
                let textValue = <Text style={styles.missedPill}>{key}: {this.parseTime(mondayData[key][0]['time'])}</Text>
                componentArray.push(textValue)
            }
        }
        console.log(componentArray)
        return componentArray
        
    }

    toggleDisplayData = () => {
        console.log("Hello world")
        this.setState({displayData: !this.state.displayData})
        console.log(this.state.displayData)
    }

    render() {
        
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        /*data1 = <View style={styles.missedPillContainer}>
                    <Text style={styles.missedDay}>Monday</Text>
                    <Text style={styles.missedPill}>Kadian 12:00pm: 2 doses</Text>
                    <Text style={styles.missedPill}>Vicodin 4:00pm: 3 doses</Text>
                    <Text style={styles.missedPill}>Lomotil 6:00pm: 1 dose</Text>
                </View>*/
        data1 = <View style={styles.missedPillContainer}>
            <Text style={styles.missedDay}>Monday</Text>
            {this.state.dataToDisplay}
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