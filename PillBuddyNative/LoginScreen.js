import * as React from "react";
import { FlatList, TouchableWithoutFeedback, Keyboard, ImageBackground, Text, ActivityIndicator, Image, StyleSheet, View } from "react-native";
import Button from "./components/Login/Button";
import FormTextInput from "./components/Login/FormTextInput";
import colors from "./components/config/colors";
import strings from "./components/config/strings";
import firebase from "firebase"
import Icon from 'react-native-vector-icons/FontAwesome';
import { Input } from 'react-native-elements';

interface State {
  email: string;
  password: string;
}

class LoginScreen extends React.Component<{}, State> {
  constructor(props) {
    super(props);
    this.state = { email: '', password: '', error: ''};
  }

  handleEmailChange = (email: string) => {
    this.setState({ email: email });
  };

  handlePasswordChange = (password: string) => {
    this.setState({ password: password });
  };

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
  };

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
        label={strings.LOGIN}
        onPress={this.onButtonPress.bind(this)}
        />
    );
  }

  onLoginSuccess() {
    this.setState({
      email: '', password: '', error: '', loading: false
    })
  }

  onLoginFailure(errorMessage) {
    this.setState({ error: errorMessage, loading: false })
  }

  render() {
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ImageBackground style={styles.background} source={require("./assets/background.jpg")}>
      <View style={styles.container}>
        <View style={styles.form}>
          <Text style={styles.tabText}>PillBuddy</Text>
          <Input
            value={this.state.email}
            placeholder='Email'
            autoCorrect={false}
            color='black'
            secureTextEntry={false}
            autoCapitalize = 'none'
            leftIcon={{ type: 'antdesign', name: 'user' }}
            leftIconContainerStyle={{ marginRight:15 }}
            onChangeText={this.handleEmailChange}
          />
          <Input
            value={this.state.password}
            placeholder='Password'
            autoCorrect={false}
            color='black'
            autoCapitalize = 'none'
            secureTextEntry={true}
            leftIcon={{ type: 'antdesign', name: 'unlock' }}
            leftIconContainerStyle={{ marginRight:15 }}
            onChangeText={this.handlePasswordChange}
          />
          {this.renderButton()}
          <Text style={styles.errorTextStyle}>
            {this.state.error}
          </Text>
        </View>
      </View>
      </ImageBackground>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //backgroundColor: colors.WHITE,
    backgroundColor: '#ececf4',
    alignItems: "center",
    justifyContent: "center",
    flexDirection: 'column',
    //justifyContent: "space-between"
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%'
  },
  errorTextStyle: {
    fontSize: 18,
    alignSelf: 'center',
    color: 'red'
  },
  logo: {
    flex: 1,
    width: "100%",
    resizeMode: "contain",
    alignSelf: "center"
  },
  form: {
    flex: 1,
    justifyContent: "center",
    width: "80%"
  },
  tabText: {
    color: '#428AF8',
    fontFamily: 'HelveticaNeue-Thin',
    margin: 30,
    fontSize: 50,
    alignSelf: "center"
  }
});

export default LoginScreen;
