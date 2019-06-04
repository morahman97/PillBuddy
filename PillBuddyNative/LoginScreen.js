import * as React from "react";
import { ImageBackground, Text, ActivityIndicator, Image, StyleSheet, View } from "react-native";
import Button from "./components/Login/Button";
import FormTextInput from "./components/Login/FormTextInput";
import colors from "./components/config/colors";
import strings from "./components/config/strings";
import firebase from "firebase"

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
      <View style={styles.container}>
        <View style={styles.form}>
          <Text style={styles.tabText}>PillBuddy</Text>
          <FormTextInput
            value={this.state.email}
            secureTextEntry={false}
            onChangeText={this.handleEmailChange}
            placeholder={strings.EMAIL_PLACEHOLDER}
          />
          <FormTextInput
            value={this.state.password}
            secureTextEntry={true}
            onChangeText={this.handlePasswordChange}
            placeholder={strings.PASSWORD_PLACEHOLDER}
          />
          {this.renderButton()}
          <Text style={styles.errorTextStyle}>
            {this.state.error}
          </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.WHITE,
    alignItems: "center",
    justifyContent: "center",
    justifyContent: "space-between"
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
    margin: 50,
    fontSize: 40
  }
});

export default LoginScreen;