import React from "react"
import { StyleSheet, Text, View, Image, Button, ActivityIndicator } from "react-native"
import firebase from "firebase"
import Input from './Input';

export default class LoginForm extends React.Component {
  constructor(props) {
      super(props);
      this.state = { email: '', password: '', error: ''};
  }

  onButtonPress() {
    this.setState({ error: '', loading: true })
    const { email, password } = this.state;
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(this.onLoginSuccess.bind(this))
      .catch(() => {
        firebase.auth().createUserWithEmailAndPassword(email, password)
          .then(this.onLoginSuccess.bind(this))
          .catch((error) => {
            let errorCode = error.code
            let errorMessage = error.message;
            if (errorCode == 'auth/weak-password') {
              this.onLoginFailure.bind(this)('Weak password!')
            } else {
              this.onLoginFailure.bind(this)(errorMessage)
            }
          });
      });
  }
  onLoginSuccess() {
    this.setState({
      email: '', password: '', error: '', loading: false
    })
  }

  onLoginFailure(errorMessage) {
    this.setState({ error: errorMessage, loading: false })
  }

  renderButton() {
    if (this.state.loading) {
      return(
          <View style={styles.spinnerStyle}>
             <ActivityIndicator size={"small"} />
          </View>
      );
    }
    return (
      <Button
        title="Sign in"
        onPress={this.onButtonPress.bind(this)}
        />
    );
  }

  render() {
    return (
      <View>
        <Text style = {styles.viewStyles}>
          PillBuddy
        </Text>
        <Input label="Email"
          placeholder="user@mail.com"
          value={this.state.email}
          secureTextEntry={false}
          onChangeText={email => this.setState({ email })}
          />
        <Input label="Password"
          placeholder="password"
          value={this.state.password}
          secureTextEntry={true}
          onChangeText={password => this.setState({ password })}
          />
        {this.renderButton()}

        <Text style={styles.errorTextStyle}>
          {this.state.error}
        </Text>
      </View>
    );
  }
}

const styles = {
  errorTextStyle: {
    fontSize: 18,
    alignSelf: 'center',
    color: 'red'
  },
  viewStyles: {
    margin: 9,
    padding: 9,
    fontSize: 32,
    shadowColor: '#ddd',
    backgroundColor: '#f8f8f8',
    height: 60,
    paddingTop: 25,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    borderColor: '#fff',
    borderBottomWidth: 4,
  }
}
