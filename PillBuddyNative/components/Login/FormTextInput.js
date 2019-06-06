import * as React from "react";
import { StyleSheet, TextInput, TextInputProps } from "react-native";
import colors from "../config/colors";

// We support all the TextInput props
type Props = TextInputProps;

class FormTextInput extends React.Component<Props> {
  render() {
    // We define our own custom style for the TextInput, but
    // we still want to allow the developer to supply its
    // own additional style if needed.
    // To do so, we extract the "style" prop from all the
    // other props to prevent it to override our own custom
    // style.
    const { style, ...otherProps } = this.props;
    return (
      <TextInput
        selectionColor={colors.DODGER_BLUE}
        autoCorrect={false}
        autoCapitalize = 'none'
        style={[styles.textInput, style]}
        {...otherProps}
      />
    );
  }
}

const styles = StyleSheet.create({
  textInput: {
    height: 40,
    borderColor: 'white',
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginBottom: 20,
    color: 'white'
  }
});

export default FormTextInput;
