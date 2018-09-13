import React from 'react';
import { StyleSheet, Text, View, Alert, TextInput } from 'react-native';
import { Button, ThemeProvider, Card } from 'react-native-material-ui';
import { createSwitchNavigator } from 'react-navigation';
import Login from './components/Login';
import Register from './components/Register';
import MainPage from './components/MainPage';
import Home from './components/Home';
import Rooms from './components/Rooms';
import Devices from './components/Devices';
import Users from './components/Users';
import ActivationConditions from './components/ActivationConditions';
import ActivationCondition from './components/ActivationCondition';
import CreateActivationCondition from './components/CreateActivationCondition';
import CreateDevice from './components/CreateDevice';
import CreateHome from './components/CreateHome';
import CreateRoom from './components/CreateRoom';
import Device from './components/Device';
import JoinHome from './components/JoinHome';
import Room from './components/Room';


export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  render() {
    return (
      <View>
        <AppNavigator />
      </View>
    );
  }
}

const AppNavigator = createSwitchNavigator(
  {
    Login,
    Register,
    MainPage,
    Home,
    Rooms,
    Devices,
    Users,
    ActivationConditions,
    ActivationCondition,
    CreateActivationCondition,
    CreateDevice,
    CreateHome,
    CreateRoom,
    Device,
    JoinHome,
    Room
  },
  {
    backBehavior: 'initialRoute',
    initialRouteName: 'Login'
  }
);

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });
