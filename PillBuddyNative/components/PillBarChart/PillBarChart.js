import React from 'react'
import { StyleSheet, View, TextInput, Button,TouchableOpacity, TouchableWithoutFeedback, Keyboard } from 'react-native';

import { BarChart, Grid, XAxis} from 'react-native-svg-charts'
import { Text } from 'react-native-svg'
import * as scale from 'd3-scale'

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

export default class PillBarChart extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            pillData: [0,0,0,0,0,0,0]
        }
    }
    componentDidMount() {
        let userId = firebase.auth().currentUser.uid
        let pillsRef = firebase.database().ref('PillInfo/' + userId + '/MetaInfo');
        pillsRef.limitToLast(1).on('value', (snapshot) => {
            let data = snapshot.val();
            let metaInfo = Object.values(data);
            console.log("printing out pill data")
            console.log(metaInfo[0]['daysTakenJSON'])
            this.parsePillData(metaInfo[0]['daysTakenJSON']);

        });
    }

    parsePillData = (metaData) => {
        var tempArray = []
        metaData.forEach((data) => {
            let numMissed = 0
            console.log(data)
            for (var key in data) {
                console.log(data[key][0]['taken'])
                if (data[key][0]['taken'] == 0) numMissed += 1
            }
            tempArray.push(numMissed);
        });
        console.log(tempArray)
        this.setState({
            pillData: tempArray
        });
        console.log(this.state.pillData)
    }

    render() {
 
        const fill = 'rgb(134, 65, 244)'
        //let data=[0,0,0,0,0,0,0]
        console.log(this.state.pillData)
        var data   = this.state.pillData
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

        const CUT_OFF = 20
        const Labels = ({ x, y, bandwidth, data }) => (
            data.map((value, index) => (
                <Text
                    key={ index }
                    x={ x(index) + (bandwidth / 2) }
                    y={ value < CUT_OFF ? y(value) - 10 : y(value) + 15 }
                    fontSize={ 14 }
                    fill={ value >= CUT_OFF ? 'white' : 'black' }
                    alignmentBaseline={ 'middle' }
                    text
                    Anchor={ 'middle' }
                >
                    {value}
                </Text>
            ))
        )

        return (
                <View style={{ flexDirection: 'row', height: 250 }}>
                    <BarChart
                        style={{ flex: 1 }}
                        data={data}
                        svg={{ fill: 'rgba(134, 65, 244, 0.8)' }}
                        contentInset={{ top: 30, bottom: 30 }}
                        spacing={0.2}
                        gridMin={0}
                        
                    >
                    <Grid direction={Grid.Direction.HORIZONTAL}/>
                    <Labels/>
                    </BarChart>
                </View>
        )
    }
 
}
