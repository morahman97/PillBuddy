import { createStackNavigator } from 'react-navigation';
import { createAppContainer } from 'react-navigation'
import ButtonPage  from './buttonpage';
import InputPillForm from './components/InputPillForm/InputPillForm';
import HomePage from './components/HomePage/HomePage';

const AppNavigator = createAppContainer(createStackNavigator({
  ButtonPage: ButtonPage,
  HomePage:  HomePage ,
}, {
    initialRouteName: 'ButtonPage'
}));

export default AppNavigator;