import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { Button, ThemeProvider, Card } from 'react-native-material-ui';
import { createStackNavigator } from 'react-navigation';
import Login from '../components/Login';
import Register from '../components/Register';

const AuthenticationNavigator = createStackNavigator(
  {
    Login,
    Register,
  },
  {
    backBehavior: 'initialRoute',
    initialRouteName: 'Login',
    navigationOptions: {
      headerStyle: {
        backgroundColor: 'white',
      },
      headerTintColor: 'black',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    },
  }
);


export default class Authentication extends React.Component {
  static router = AuthenticationNavigator.router;

  constructor(props) {
    super(props);
    this.state = {}
  }

  render() {
    return (
      <AuthenticationNavigator navigation={this.props.navigation}/>
    );
  }
}