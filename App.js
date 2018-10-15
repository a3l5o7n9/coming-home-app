import React from 'react';
import { StyleSheet, Text, View, Alert, TextInput, ScrollView } from 'react-native';
import { Button, ThemeProvider, Card } from 'react-native-material-ui';
import { createSwitchNavigator, createStackNavigator } from 'react-navigation';
import { Notifications } from 'expo';
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
