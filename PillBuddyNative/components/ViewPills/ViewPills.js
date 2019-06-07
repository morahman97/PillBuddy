import React, { Component } from 'react';
import { FlatList, View, Text, StyleSheet} from 'react-native';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import PillComponent from '../PillComponent/PillComponent';
import firebase from 'firebase'
import FloatingActionButton from 'react-native-action-button';
import HomePage from '../../components/HomePage/HomePage';
import { ListItem, Overlay } from 'react-native-elements'

const styles = StyleSheet.create({
  tabText: {
    margin: 50,
    fontSize: 40,
    alignSelf: "center"
  },
  container: {
    flex: 1,
    justifyContent: 'center',
  }
})

class ViewPills extends Component {
  state = {
    pills: [],
    isVisible: false,
    dayMap: {
      0: 'Su', 
      1: 'Mon', 
      2: 'Tu',
      3: 'Wed', 
      4: 'Thu', 
      5: 'Fri', 
      6: 'Sat'
    }
  }
  
  parseDayPills = (itemDays) => {
    let dayArray = []
    itemDays.sort().forEach((day) => {
      dayArray.push(this.state.dayMap[day])
    })
    return dayArray
  }

  componentDidMount() {
    let userId = firebase.auth().currentUser.uid
    let pillsRef = firebase.database().ref('PillInfo/' + userId + "/Pills/");
    pillsRef.on('value', (snapshot) => {
      let data = snapshot.val();
      let pills = Object.values(data);
      this.setState({pills});
    });
  }

  keyExtractor = (item, index) => index.toString()

  renderItem = ({ item }) => (
    <ListItem
      title={item.pillName}
      titleStyle={{ fontSize: 20}}
      rightTitle={item.days}
      chevron={true}
      subtitle={JSON.stringify(this.parseDayPills(item.days))}
      subtitleStyle={{ color: 'gray' }}
      bottomDivider={true}
      onPress={() => this.setState({ isVisible: true })}
    />
  )

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.tabText}>My Pills</Text>
        <FlatList
          keyExtractor={this.keyExtractor}
          data={this.state.pills}
          renderItem={this.renderItem}
        />
        <FloatingActionButton
          buttonColor="#428AF8"
          onPress={() => this.props.navigation.navigate('Input')}/>
      </View>
    )
  }
}

class InputScreen extends React.Component {
  render() {
    return (
        <HomePage/>
    );
  }
}

const PillStack = createStackNavigator(
  {
    Input: InputScreen,
    View: ViewPills,
  },
  {
    initialRouteName: 'View',
  }
);

const AppContainer = createAppContainer(PillStack);

export default class App extends React.Component {
  render() {
    return <AppContainer />;
  }
}
