import React from 'react'
import { StyleSheet, View, TextInput, Button,TouchableOpacity, TouchableWithoutFeedback, Keyboard } from 'react-native';

import { BarChart, Grid, XAxis} from 'react-native-svg-charts'
import { Text } from 'react-native-svg'
import * as scale from 'd3-scale'

export default class PillBarChart extends React.Component {
 
    render() {
 
        const fill = 'rgb(134, 65, 244)'
        const data   = [ 2, 3, 0, 1, 0, 1, 3 ]
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
                    textAnchor={ 'middle' }
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
