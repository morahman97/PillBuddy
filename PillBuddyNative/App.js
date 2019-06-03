import React, { Component } from 'react';
import { View, Button} from 'react-native';
import firebase from 'firebase';
import Menu from './components/Menu/Menu';
import Header from './Header';
import LoginForm from './LoginForm';
import LoginScreen from './LoginScreen';

export default class App extends Component {
  state = { loggedIn: null };
  componentDidMount() {
    let config = {
      apiKey: "AIzaSyDrnrsaVw0RLyz6Gf-Ezd0dUK81DCQkCP4",
      authDomain: "pill-buddy.firebaseapp.com",
      databaseURL: "https://pill-buddy.firebaseio.com",
      projectId: "pill-buddy",
      storageBucket: "pill-buddy.appspot.com",
      messagingSenderId: "773140406620",
      appId: "1:773140406620:web:76284dc0f19fbe9f"
    };
    firebase.initializeApp(config);
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({ loggedIn: true })
      } else {
        this.setState({ loggedIn: false })
      }
    })
  }
  renderComponent() {
    if (this.state.loggedIn) {
      return (
       /*<Button
        title="Sign out"
        onPress={() => firebase.auth().signOut()}
        />*/
        <Menu/>
      );
    } else {
      return (
        <LoginScreen />
      );
    }
  }
  render() {
    return (
      this.renderComponent()
/*      <View>
        <Header title='PillBuddy' />
        {this.renderComponent()}
      </View>*/
    );
  }
}
