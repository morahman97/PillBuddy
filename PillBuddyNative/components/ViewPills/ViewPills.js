import React, { Component } from 'react';
import { View, Text, StyleSheet} from 'react-native';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import PillComponent from '../PillComponent/PillComponent';
import firebase from 'firebase'
import FloatingActionButton from 'react-native-action-button';
import HomePage from '../../components/HomePage/HomePage';

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
    pills: []
  }
  
  componentDidMount() {
    let userId = firebase.auth().currentUser.uid
    let pillsRef = firebase.database().ref('PillInfo/' + userId);
    pillsRef.on('value', (snapshot) => {
      let data = snapshot.val();
      let pills = Object.values(data);
      this.setState({pills});
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.tabText}>My Pills</Text>
        {
          this.state.pills.length > 0
          ? <PillComponent pills={this.state.pills} />
          : <Text>No pills!</Text>
        }
        <FloatingActionButton
          hideShadow={true} // this is to avoid a bug in the FAB library.
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
