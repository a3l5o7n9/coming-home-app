import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { Button, ThemeProvider, Card } from 'react-native-material-ui';
import { createStackNavigator } from 'react-navigation';
import { Notifications } from 'expo';
import registerForPushNotificationsAsync from '../functional-components/registerForPushNotificationsAsync';
import MainPage from '../components/MainPage';
import Home from '../components/Home';
import Rooms from '../components/Rooms';
import Devices from '../components/Devices';
import Users from '../components/Users';
import ActivationConditions from '../components/ActivationConditions';
import ActivationCondition from '../components/ActivationCondition';
import CreateActivationCondition from '../components/CreateActivationCondition';
import CreateDevice from '../components/CreateDevice';
import CreateHome from '../components/CreateHome';
import CreateRoom from '../components/CreateRoom';
import Device from '../components/Device';
import JoinHome from '../components/JoinHome';
import Room from '../components/Room';
import User from '../components/User';
import BindDeviceToRoom from '../components/BindDeviceToRoom';
import UpdateHome from '../components/UpdateHome';
import UpdateUser from '../components/UpdateUser';
import UpdateRoom from '../components/UpdateRoom';
import UpdateDevice from '../components/UpdateDevice';
import UpdateActivationCondition from '../components/UpdateActivationCondition';

const SessionNavigator = createStackNavigator(
  {
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
    Room,
    User,
    BindDeviceToRoom,
    UpdateHome,
    UpdateUser,
    UpdateRoom,
    UpdateDevice,
    UpdateActivationCondition,
  },
  {
    backBehavior: 'initialRoute',
    initialRouteName: 'MainPage',
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

export default class Session extends React.Component {
  static router = SessionNavigator.router;

  constructor(props) {
    super(props);
    this.state = {
      notification: {},
    };
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
      <SessionNavigator navigation={this.props.navigation}/>
    );
  }
}