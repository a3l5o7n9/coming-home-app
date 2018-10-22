import React from 'react';
import { StyleSheet, Text, View, ScrollView, AsyncStorage } from 'react-native';
import { Button, ThemeProvider, Card } from 'react-native-material-ui';
import { createStackNavigator } from 'react-navigation';
import { Notifications, Location } from 'expo';
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
    Location.watchPositionAsync({ enableHighAccuracy: true, timeInterval: 60000, distanceInterval: 20 }, (position) => this.getDeviceCurrentPositionAsync());

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
        var currentLatitude = position.coords.latitude;
        var currentLongitude = position.coords.longitude;
        var currentAltitude = position.coords.altitude;
        var currentHeading = position.coords.heading;
        var currentSpeed = position.coords.speed;
        const output =
          'latitude=' + position.coords.latitude +
          '\nlongitude=' + position.coords.longitude +
          '\naltitude=' + position.coords.altitude +
          '\nheading=' + position.coords.heading +
          '\nspeed=' + position.coords.speed

        console.log(output);

        AsyncStorage.getItem('detailsStr').then((value) => {
          details = JSON.parse(value);

          var homeList = new Array();

          homeList = details.homeList;

          AsyncStorage.getItem('userActivationConditionListStr').then((value) => {
            userActivationConditionList = JSON.parse(value);

            var activationConditionList = new Array();

            activationConditionList = userActivationConditionList;

            activationConditionList.filter((ac) => (ac.ActivationMethodName === 'לפי מרחק/מיקום'));

            activationConditionList.forEach((ac) => {
              var home = homeList.find((h) => (h.HomeId === ac.HomeId));
              var aGCLatitude = home.Latitude;
              var aGCLongitude = home.Longitude;
              var aGCAltitude = home.Altitude;
              var aGCAccuracy = home.Accuracy;

              if (currentLatitude > aGCLatitude)
              //The device is currently north of the address
              {
                if (((currentHeading >= 0 && currentHeading < 90) || (currentHeading > 270 && currentHeading <= 360)) && currentSpeed > 20000/3600)
                //The device is also moving north
                {
                  return;
                }
              }

              if (currentLatitude < aGCLatitude)
              //The device is currently south of the address
              {
                if (currentHeading > 90 && currentHeading < 270 && currentSpeed > 20000/3600)
                //The device is also moving south
                {
                  return;
                }
              }

              if (currentLongitude > aGCLongitude)
              //The device is currently east of the address
              {
                if (currentHeading > 0 && currentHeading < 180 && currentSpeed > 20000/3600)
                //The device is also moving east
                {
                  return;
                }
              }

              if (currentLongitude < aGCLongitude)
              //The device is currently west of the address
              {
                if (currentHeading > 180 && currentHeading < 360 && currentSpeed > 20000/3600)
                //The device is also moving west
                {
                  return;
                }
              }
            });
          });
        });
      },
      (error) => alert(error.message),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  }

  render() {
    return (
      <SessionNavigator navigation={this.props.navigation} />
    );
  }
}