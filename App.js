import React from 'react';
import { StyleSheet, Text, View, Alert, TextInput, ScrollView } from 'react-native';
import { Button, ThemeProvider, Card } from 'react-native-material-ui';
import { createSwitchNavigator } from 'react-navigation';
import { Notifications, Location } from 'expo';
import registerForPushNotificationsAsync from './functional-components/registerForPushNotificationsAsync';
import Session from './navigator-components/Session';
import Authentication from './navigator-components/Authentication';


export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  componentDidMount() {
    registerForPushNotificationsAsync();
    Location.watchPositionAsync({enableHighAccuracy: true, timeInterval: 60000, distanceInterval: 20} , (position) => this.getDeviceCurrentPositionAsync());

    // Handle notifications that are received or selected while the app
    // is open. If the app was closed and then opened by tapping the
    // notification (rather than just tapping the app icon to open it),
    // this function will fire on the next tick after the app starts
    // with the notification data.
    this._notificationSubscription = Notifications.addListener(this._handleNotification);
  }

  _handleNotification = (notification) => {
    this.setState({ notification: notification });
  };

  getDeviceCurrentPositionAsync() {
    debugger;
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const output= 
        'latitude=' + position.coords.latitude +
        '\nlongitude=' + position.coords.longitude +
        '\naltitude=' + position.coords.altitude +
        '\nheading=' + position.coords.heading +
        '\nspeed=' + position.coords.speed 

        alert(output);
      },
      (error) => alert(error.message),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  }

  render() {
    return (
      <AppNavigator />
    );
  }
}

const AppNavigator = createSwitchNavigator(
  {
    Authentication: Authentication,
    Session: Session
  },
  {
    backBehavior: 'initialRoute',
    initialRouteName: 'Authentication',
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

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });
