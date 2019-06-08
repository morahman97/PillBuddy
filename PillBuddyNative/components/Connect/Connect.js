import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  NativeAppEventEmitter,
  NativeEventEmitter,
  NativeModules,
  Platform,
  PermissionsAndroid,
  ListView,
  ScrollView,
  AppState,
  Dimensions,
} from 'react-native';
import { stringToBytes } from 'convert-string';
import { bytesToString } from 'convert-string';
import BleManager from 'react-native-ble-manager';

const window = Dimensions.get('window');
const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

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

export default class App extends Component {
  constructor(){
    super()

    this.state = {
      scanning:false,
      peripherals: new Map(),
      appState: ''
    }

    this.handleDiscoverPeripheral = this.handleDiscoverPeripheral.bind(this);
    this.handleStopScan = this.handleStopScan.bind(this);
    this.handleUpdateValueForCharacteristic = this.handleUpdateValueForCharacteristic.bind(this);
    this.handleDisconnectedPeripheral = this.handleDisconnectedPeripheral.bind(this);
    this.handleAppStateChange = this.handleAppStateChange.bind(this);
  }

  componentDidMount() {
    AppState.addEventListener('change', this.handleAppStateChange);

    BleManager.start({showAlert: false});

    this.handlerDiscover = bleManagerEmitter.addListener('BleManagerDiscoverPeripheral', this.handleDiscoverPeripheral );
    this.handlerStop = bleManagerEmitter.addListener('BleManagerStopScan', this.handleStopScan );
    this.handlerDisconnect = bleManagerEmitter.addListener('BleManagerDisconnectPeripheral', this.handleDisconnectedPeripheral );
    this.handlerUpdate = bleManagerEmitter.addListener('BleManagerDidUpdateValueForCharacteristic', this.handleUpdateValueForCharacteristic );



    if (Platform.OS === 'android' && Platform.Version >= 23) {
        PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION).then((result) => {
            if (result) {
              console.log("Permission is OK");
            } else {
              PermissionsAndroid.requestPermission(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION).then((result) => {
                if (result) {
                  console.log("User accept");
                } else {
                  console.log("User refuse");
                }
              });
            }
      });
    }

  }

  handleAppStateChange(nextAppState) {
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      console.log('App has come to the foreground!')
      BleManager.getConnectedPeripherals([]).then((peripheralsArray) => {
        console.log('Connected peripherals: ' + peripheralsArray.length);
      });
    }
    this.setState({appState: nextAppState});
  }

  componentWillUnmount() {
    this.handlerDiscover.remove();
    this.handlerStop.remove();
    this.handlerDisconnect.remove();
    this.handlerUpdate.remove();
  }

  handleDisconnectedPeripheral(data) {
    let peripherals = this.state.peripherals;
    let peripheral = peripherals.get(data.peripheral);
    if (peripheral) {
      peripheral.connected = false;
      peripherals.set(peripheral.id, peripheral);
      this.setState({peripherals});
    }
    console.log('Disconnected from ' + data.peripheral);
  }

  handleUpdateValueForCharacteristic(data) {
    console.log('Received data from ' + data.peripheral + ' characteristic ' + data.characteristic, data.value);
  }

  handleStopScan() {
    console.log('Scan is stopped');
    this.setState({ scanning: false });
  }

  startScan() {
    if (!this.state.scanning) {
      this.setState({peripherals: new Map()});
      BleManager.scan([], 5, true).then((results) => {
        console.log('Scanning...');
        this.setState({scanning:true});
      });
    }
  }

  retrieveConnected(){
    BleManager.getConnectedPeripherals([]).then((results) => {
      if (results.length == 0) {
        console.log('No connected peripherals')
      }
      console.log(results);
      var peripherals = this.state.peripherals;
      for (var i = 0; i < results.length; i++) {
        var peripheral = results[i];
        peripheral.connected = true;
        peripherals.set(peripheral.id, peripheral);
        this.setState({ peripherals });
      }
    });
  }

  handleDiscoverPeripheral(peripheral){
    var peripherals = this.state.peripherals;
    if (!peripherals.has(peripheral.id)){
      console.log('Got ble peripheral', peripheral);
      peripherals.set(peripheral.id, peripheral);
      this.setState({ peripherals })
    }
  }

  test(peripheral) {
    if (peripheral){
      if (peripheral.connected){
        BleManager.disconnect(peripheral.id);
      }else{
        BleManager.connect(peripheral.id).then(() => {
          let peripherals = this.state.peripherals;
          let p = peripherals.get(peripheral.id);
          if (p) {
            p.connected = true;
            peripherals.set(peripheral.id, p);
            this.setState({peripherals});
          }
          console.log('Connected to ' + peripheral.id);


          setTimeout(() => {

            /* Test read current RSSI value
            BleManager.retrieveServices(peripheral.id).then((peripheralData) => {
              console.log('Retrieved peripheral services', peripheralData);

              BleManager.readRSSI(peripheral.id).then((rssi) => {
                console.log('Retrieved actual RSSI value', rssi);
              });
            });*/

            // Test using bleno's pizza example
            // https://github.com/sandeepmistry/bleno/tree/master/examples/pizza
            BleManager.retrieveServices(peripheral.id).then((peripheralInfo) => {
              console.log(peripheralInfo);
              var service = '6E400001-B5A3-F393-E0A9-E50E24DCCA9E';
              var readNotifyCharacteristic = '6E400003-B5A3-F393-E0A9-E50E24DCCA9E';
              var writeCharacteristic = '6E400002-B5A3-F393-E0A9-E50E24DCCA9E';
              var yourStringData = 'Hello :)';
              const data = stringToBytes(yourStringData);

              setTimeout(() => {
                BleManager.startNotification(peripheral.id, service, readNotifyCharacteristic).then(() => {
                  console.log('Started notification on ' + peripheral.id);
                  setTimeout(() => {
                    BleManager.write(peripheral.id, service, writeCharacteristic, data).then(() => {
                      console.log('Writed NORMAL crust');
                    })
                    .catch((error) => {
                      // Failure code
                      console.log(error);
                    });

                  }, 500);
                }).catch((error) => {
                  console.log('Notification error', error);
                });
              }, 200);
            });

          }, 900);
        }).catch((error) => {
          console.log('Connection error', error);
        });
      }
    }
  }

  async connect(peripheral) {
    var service = '6E400001-B5A3-F393-E0A9-E50E24DCCA9E';
    var writeCharacteristic = '6E400002-B5A3-F393-E0A9-E50E24DCCA9E';
    var characteristic = '6E400003-B5A3-F393-E0A9-E50E24DCCA9E';

    // Timestamp Format: HH-MM-D
    var hours = new Date().getHours(); //Current Hours
    var min = new Date().getMinutes(); //Current Minutes
    var day = new Date().getDay(); //Current Day 0 - Sunday ... 6 - Saturday

    var currTime = stringToBytes(hours + '-' + min + '-' + day);
    console.log(`Time is ${currTime}`);

    var nextTime = stringToBytes('#16-20-4-A#4-20-1-B#');

    // Connect to device
    await BleManager.connect(peripheral.id);
    // Before startNotification you need to call retrieveServices
    //await BleManager.retrieveServices(peripheral.id);
    await BleManager.retrieveServices(peripheral.id).then((peripheralInfo) => {
      console.log(peripheralInfo);
    });
    // To enable BleManagerDidUpdateValueForCharacteristic listener
    await BleManager.startNotification(peripheral.id, service, characteristic);

    // Write current timestamp
    BleManager.write(peripheral.id, service, writeCharacteristic, currTime)
    .then(() => {
      // Success code
      console.log('Write: ' + currTime);
    })
    .catch((error) => {
      // Failure code
      console.log(error);
    });

    // Write information about future times
    BleManager.write(peripheral.id, service, writeCharacteristic, nextTime)
    .then(() => {
      // Success code
      console.log('Write: ' + nextTime);
    })
    .catch((error) => {
      // Failure code
      console.log(error);
    });
    // Add event listener
    bleManagerEmitter.addListener( // note peripheral used inside the scope of this is the peripheral.id
      'BleManagerDidUpdateValueForCharacteristic',
      ({ value, peripheral, characteristic, service }) => {
          // Convert bytes array to string
          var data = bytesToString(value);
          console.log(`Recieved ${data} for characteristic ${characteristic}`);
          console.log(`Peripheral is ${peripheral}`);
          console.log(`LIKE A SOMEBOOODY ${data}`)
          console.log('Splitting data components')
          let dataComponenets = data.split('-');
          console.log(dataComponenets)
          let days = dataComponenets[3]
          let userId = firebase.auth().currentUser.uid
          let pillsRef = firebase.database().ref('PillInfo/' + userId + '/MetaInfo');
          pillsRef.limitToLast(1).on('value', (snapshot) => {
              let metaData = snapshot.val();
              let metaInfo = Object.values(metaData);
              console.log("printing out pill metaInfo")
              console.log(metaInfo[0]['daysTakenJSON'])
              let daysTakenJSON = metaInfo[0]['daysTakenJSON']
              
              for(var i = 0; i < days.length; i++) {
                let day = parseInt(days.charAt(i))
                console.log('We are looking at day ' + days.charAt(i))
                let pillsUnderDay = daysTakenJSON[day]
                console.log('Under this day, there are these pills')
                console.log(pillsUnderDay)
                for (var pillName in pillsUnderDay) {
                  let pillInfo = pillsUnderDay[pillName][0]
                  console.log('Underneath this pill, the info is ')
                  console.log(pillInfo)
                  if (pillInfo['time'].subString(0,5) == data.subString(2,8)) {
                    if (parseInt(dataComonents[0]) == 2) {
                      console.log('Pill not taken')
                      pillInfo['taken'] = 2
                    }
                    else if (parseInt(dataComonents[0]) == 1) {
                      console.log('Pill Taken')
                      pillInfo['taken'] = 1
                    }
                  }
                }
              }

          });

          
      }
    );
    // Actions triggereng BleManagerDidUpdateValueForCharacteristic event
  }

  render() {
    const list = Array.from(this.state.peripherals.values());
    const dataSource = ds.cloneWithRows(list);


    return (
      <View style={styles.container}>
        <TouchableHighlight style={{marginTop: 40,margin: 20, padding:20, backgroundColor:'#ccc'}} onPress={() => this.startScan() }>
          <Text>Scan Bluetooth ({this.state.scanning ? 'on' : 'off'})</Text>
        </TouchableHighlight>
        <TouchableHighlight style={{marginTop: 0,margin: 20, padding:20, backgroundColor:'#ccc'}} onPress={() => this.retrieveConnected() }>
          <Text>Retrieve connected peripherals</Text>
        </TouchableHighlight>
        <ScrollView style={styles.scroll}>
          {(list.length == 0) &&
            <View style={{flex:1, margin: 20}}>
              <Text style={{textAlign: 'center'}}>No peripherals</Text>
            </View>
          }
          <ListView
            enableEmptySections={true}
            dataSource={dataSource}
            renderRow={(item) => {
              const color = item.connected ? 'green' : '#fff';
              return (
                <TouchableHighlight onPress={() => this.connect(item) }>
                  <View style={[styles.row, {backgroundColor: color}]}>
                    <Text style={{fontSize: 12, textAlign: 'center', color: '#333333', padding: 10}}>{item.name}</Text>
                    <Text style={{fontSize: 8, textAlign: 'center', color: '#333333', padding: 10}}>{item.id}</Text>
                  </View>
                </TouchableHighlight>
              );
            }}
          />
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    width: window.width,
    height: window.height
  },
  scroll: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    margin: 10,
  },
  row: {
    margin: 10
  },
});


