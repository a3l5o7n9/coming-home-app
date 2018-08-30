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
    ActivationConditions
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
