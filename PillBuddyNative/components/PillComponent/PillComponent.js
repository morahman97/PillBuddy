import React, { Component } from 'react';
import {  View, Text, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  pillsList: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
  },
  pilltext: {
    fontSize: 24,
    textAlign: 'center',
  }
});

export default class PillComponent extends Component {
  static propTypes = {
    pills: PropTypes.array.isRequired
  };

  render() {
    return (
      <View style={styles.pillsList}>
        {this.props.pills.map((pill, index) => {
            return (
              <View key={index}>
                  <Text style={styles.pilltext}>{pill.pillName}</Text>
                  <Text style={styles.pilltext}>{pill.days}</Text>
              </View>
            )
        })}
      </View>
    );
  }
}
