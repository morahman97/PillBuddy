import React, { Component } from 'react';
import { View, Text, StyleSheet} from 'react-native';
import PillComponent from '../PillComponent/PillComponent';
import firebase from 'firebase'


const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
    }
  })

export default class ViewPills extends Component {

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
                {
                    this.state.pills.length > 0
                    ? <PillComponent pills={this.state.pills} />
                    : <Text>No pills!</Text>
                }
            </View>
        )
    }
}
