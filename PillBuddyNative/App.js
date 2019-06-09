import React, { Component } from 'react';
import { View, Button, AsyncStorage, Alert, Platform, PushNotificationIOS} from 'react-native';
//import RNFirebase from 'react-native-firebase';
import firebase from 'firebase';
import Menu from './components/Menu/Menu';
import Header from './Header';
import NotifService from './components/HomePage/HomePage';
import LoginScreen from './LoginScreen';

export default class App extends Component {
  state = { loggedIn: null };
  async componentDidMount() {
    console.disableYellowBox = true;
    let config = {
      apiKey: "AIzaSyDrnrsaVw0RLyz6Gf-Ezd0dUK81DCQkCP4",
      authDomain: "pill-buddy.firebaseapp.com",
      databaseURL: "https://pill-buddy.firebaseio.com",
      projectId: "pill-buddy",
      storageBucket: "pill-buddy.appspot.com",
      messagingSenderId: "773140406620",
      appId: "1:773140406620:web:76284dc0f19fbe9f"
    };
    if (!firebase.apps.length) {
      firebase.initializeApp(config);
    }
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({ loggedIn: true })
      } else {
        this.setState({ loggedIn: false })
      }
    })
    PushNotificationIOS.requestPermissions([permissions]);
    this.checkPermission();
    this.createNotificationListeners();
  }

  componentWillUnmount() {
    this.notificationListener;
    this.notificationOpenedListener;
  }

  async checkPermission() {
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
      this.getToken();
    } else {
      this.requestPermission();
    }
  }

  async getToken() {
    let fcmToken = await AsyncStorage.getItem('fcmToken');
    if (!fcmToken) {
      fcmToken = await firebase.messaging().getToken();
      if (fcmToken) {
        // user has a device token
        console.log('fcmToken:', fcmToken);
        await AsyncStorage.setItem('fcmToken', fcmToken);
      }
    }
    console.log('fcmToken:', fcmToken);
  }

  //2
  async requestPermission() {
    try {
      await firebase.messaging().requestPermission();
      // User has authorised
      this.getToken();
    } catch (error) {
      // User has rejected permissions
      console.log('permission rejected');
    }
  }

  async createNotificationListeners() {
    /*
    * Triggered when a particular notification has been received in foreground
    * */
    this.notificationListener = firebase.notifications().onNotification((notification) => {
      const { title, body } = notification;
      console.log('onNotification:');
      
        const localNotification = new firebase.notifications.Notification({
          show_in_foreground: true,
        })
        .setNotificationId(notification.notificationId)
        .setTitle(notification.title)
        .setBody(notification.body)

        firebase.notifications()
          .displayNotification(localNotification)
          .catch(err => console.error(err));
    });

    /*
    * If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
    * */
    this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
      const { title, body } = notificationOpen.notification;
      console.log('onNotificationOpened:');
      Alert.alert(title, body)
    });

        /*
    * If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
    * */
    const notificationOpen = await firebase.notifications().getInitialNotification();
    if (notificationOpen) {
      const { title, body } = notificationOpen.notification;
      console.log('getInitialNotification:');
      Alert.alert(title, body)
    }
    /*
    * Triggered for data only payload in foreground
    * */
    this.messageListener = firebase.messaging().onMessage((message) => {
      //process data message
      console.log("JSON.stringify:", JSON.stringify(message));
    });
  }

  renderComponent() {
    if (this.state.loggedIn) {
      return (
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
    );
  }
}
