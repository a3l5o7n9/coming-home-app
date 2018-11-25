import React from 'react';
import { StyleSheet, Text, View, ScrollView, AsyncStorage } from 'react-native';
import { Button, ThemeProvider, Card } from 'react-native-material-ui';
import { createStackNavigator } from 'react-navigation';
import { Notifications, Location } from 'expo';
import geolib from 'geolib';
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
import RoomPermissions from '../components/RoomPermissions';
import DevicePermissions from '../components/DevicePermissions';
import InviteUser from '../components/InviteUser';
import UpdateUserType from '../components/UpdateUserType';

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
    RoomPermissions,
    DevicePermissions,
    InviteUser,
    UpdateUserType
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
      appUser: {},
      userList: null,
      homeList: null,
      allUserRoomsList: null,
      allUserDevicesList: null,
      allUserActivationConditionsList: null,
      resultMessage: '',
      userTypes: null,
      roomTypes: null,
      deviceTypes: null,
      activationMethods: null
    };
  }

  componentDidMount() {
    registerForPushNotificationsAsync();
    Location.watchPositionAsync({ enableHighAccuracy: true, timeInterval: 60000, distanceInterval: 100 }, (position) => this.getDeviceCurrentPositionAsync());

    // Handle notifications that are received or selected while the app
    // is open. If the app was closed and then opened by tapping the
    // notification (rather than just tapping the app icon to open it),
    // this function will fire on the next tick after the app starts
    // with the notification data.
    this._notificationSubscription = Notifications.addListener(this._handleNotification);
  }

  async componentDidMount() {
    try {
      AsyncStorage.getItem('userTypesStr').then((value) => {
        userTypes = JSON.parse(value);

        AsyncStorage.getItem('roomTypesStr').then((value) => {
          roomTypes = JSON.parse(value);

          AsyncStorage.getItem('deviceTypesStr').then((value) => {
            deviceTypes = JSON.parse(value);

            AsyncStorage.getItem('activationMethodsStr').then((value) => {
              activationMethods = JSON.parse(value);

              this.setState({
                userTypes,
                roomTypes,
                deviceTypes,
                activationMethods
              });
            });
          });
        });
      });
    }
    catch(error) {
      error(error);
    }
  }

  // async componentDidMount() {
  //   try {
  //     const userTypesDataStr = await AsyncStorage.getItem('userTypesStr');

  //     if (userTypesDataStr !== null)
  //     {
  //       const userTypesData = JSON.parse(userTypesDataStr);
  //       console.log('userTypes = ' + JSON.stringify(userTypesData));

  //       this.setState({userTypes : userTypesData});
  //     }
  //   }
  //   catch(error) {
  //     console.log(error);
  //   }
  // }

  // async componentDidMount() {
  //   try {
  //     const roomTypesDataStr = await AsyncStorage.getItem('roomTypesStr');

  //     if (roomTypesDataStr !== null)
  //     {
  //       const roomTypesData = JSON.parse(roomTypesDataStr);
  //       console.log('roomTypes = ' + JSON.stringify(roomTypesData));

  //       this.setState({roomTypes : roomTypesData});
  //     }
  //   }
  //   catch(error) {
  //     console.log("Error fetching roomTypes ",error);
  //   }
  // }

  // async componentDidMount() {
  //   try {
  //     const deviceTypesDataStr = await AsyncStorage.getItem('deviceTypesStr');

  //     if (deviceTypesDataStr !== null)
  //     {
  //       const deviceTypesData = JSON.parse(deviceTypesDataStr);
  //       console.log('deviceTypes = ' + JSON.stringify(deviceTypesData));

  //       this.setState({deviceTypes : deviceTypesData});
  //     }
  //   }
  //   catch(error) {
  //     console.log("Error fetching deviceTypes ",error);
  //   }
  // }

  // async componentDidMount() {
  //   try {
  //     const activationMethodsDataStr = await AsyncStorage.getItem('activationMethodsStr');

  //     if (activationMethodsDataStr !== null)
  //     {
  //       const activationMethodsData = JSON.parse(activationMethodsDataStr);
  //       console.log('activationMethods = ' + JSON.stringify(activationMethodsData));

  //       this.setState({activationMethods : activationMethodsData});
  //     }
  //   }
  //   catch(error) {
  //     console.log("Error fetching activationMethods ",error);
  //   }
  // }

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

          var userList = new Array();
          var homeList = new Array();
          var allUserRoomsList = new Array();
          var allUserDevicesList = new Array();
          var allUserActivationConditionsList = new Array();
          var appUser = details.appUser;
          var resultMessage = details.resultMessage;

          userList = details.userList;
          homeList = details.homeList;
          allUserRoomsList = details.allUserRoomsList;
          allUserDevicesList = details.allUserDevicesList;
          allUserActivationConditionsList = details.allUserActivationConditionsList;

          if (allUserActivationConditionsList != null)
          {
            allUserActivationConditionsList.filter((ac) => (ac.ActivationMethodName === 'לפי מרחק/מיקום' && ac.IsActive === true));

            allUserActivationConditionsList.forEach((ac) => {
              var home = homeList.find((h) => (h.HomeId === ac.HomeId));
              var room = allUserRoomsList.find((r) => (r.RoomId === ac.RoomId));
              var device = allUserDevicesList.find((d) => (d.DeviceId === ac.DeviceId && d.RoomId === ac.RoomId));
              var aGCLatitude = home.Latitude;
              var aGCLongitude = home.Longitude;
              var aGCAltitude = home.Altitude;
              var aGCAccuracy = home.Accuracy;
              var distanceParam = '';
              distanceParam = ac.DistanceOrTimeParam;
              var distanceParamArray = new Array();
              var distanceParamNumber = 0;
  
              if (distanceParam.toLowerCase().includes('km') || distanceParam.toLowerCase().includes('kilometers')) {
                distanceParamArray = distanceParam.toLowerCase().split('k');
                distanceParamNumber = distanceParamArray[0] * 1000;
                console.log("distanceParamNumber = " + distanceParamNumber);
              }
  
              if (currentLatitude > aGCLatitude)
              //The device is currently north of the address
              {
                if (((currentHeading >= 0 && currentHeading < 90) || (currentHeading > 270 && currentHeading <= 360)) && currentSpeed > 5000 / 3600)
                //The device is also moving north
                {
                  return;
                }
              }
  
              if (currentLatitude < aGCLatitude)
              //The device is currently south of the address
              {
                if (currentHeading > 90 && currentHeading < 270 && currentSpeed > 5000 / 3600)
                //The device is also moving south
                {
                  return;
                }
              }
  
              if (currentLongitude > aGCLongitude)
              //The device is currently east of the address
              {
                if (currentHeading > 0 && currentHeading < 180 && currentSpeed > 5000 / 3600)
                //The device is also moving east
                {
                  return;
                }
              }
  
              if (currentLongitude < aGCLongitude)
              //The device is currently west of the address
              {
                if (currentHeading > 180 && currentHeading < 360 && currentSpeed > 5000 / 3600)
                //The device is also moving west
                {
                  return;
                }
              }
  
              var currentDistance = geolib.getDistance({ latitude: aGCLatitude, longitude: aGCLongitude }, { latitude: currentLatitude, longitude: currentLongitude });
              console.log("currentDistance = " + currentDistance);
  
              if (currentDistance <= distanceParamNumber && currentDistance > 5 && currentSpeed > 0) {
                var userId = appUser.UserId;
                var deviceId = ac.DeviceId;
                var roomId = ac.RoomId;
                var turnOn = ac.TurnOn;
                var statusDetails = '';
                var conditionId = ac.ConditionId;
  
                if (ac.ActivationParam == '' || ac.ActivationParam == null) {
                  statusDetails = 'null';
                }
                else {
                  statusDetails = ac.ActivationParam;
                }
  
                var request = {
                  userId,
                  deviceId,
                  roomId,
                  turnOn,
                  activationMethodCode: '3',
                  statusDetails,
                  conditionId
                }
  
                fetch("http://ruppinmobile.tempdomain.co.il/SITE14/ComingHomeWS.asmx/ChangeDeviceStatus", {
                  method: 'POST',
                  headers: new Headers({
                    'Content-Type': 'application/json;'
                  }),
                  body: JSON.stringify(request)
                })
                  .then(res => res.json()) // קובע שהתשובה מהשרת תהיה בפורמט JSON
                  .then((result) => { // no error in server
                    let changeData = JSON.parse(result.d);
  
                    switch (changeData) {
                      case -2:
                        {
                          console.log("You do not have permission to change this device's status right now.");
                          break;
                        }
                      case -1:
                        {
                          console.log("Data Error!");
                          break;
                        }
                      case 0:
                        {
                          console.log("Action aborted, as it does not actually change the device's current status.");
                          break;
                        }
                      default:
                        {
                          var index = allUserDevicesList.findIndex((d) => (d.DeviceId === deviceId && d.RoomId === roomId));
                          allUserDevicesList[index].IsOn = turnOn;
                          var detailsNew = {
                            appUser: appUser,
                            userList: userList,
                            homeList: homeList,
                            allUserRoomsList: allUserRoomsList,
                            allUserDevicesList: allUserDevicesList,
                            allUserActivationConditionsList: allUserActivationConditionsList,
                            resultMessage: resultMessage
                          }
  
                          var detailsNewStr = JSON.stringify(detailsNew);
  
                          AsyncStorage.setItem('detailsStr', detailsNewStr).then(() => {
                            alert(device.DeviceName + "'s status in " + room.RoomName + " in " + home.HomeName + " has changed.");
                          });
  
                          break;
                        }
                    }
                  })
                  .catch((error) => {
                    console.log("A connection Error has occurred.");
                  });
              }
            });
          }
        });
      },
      (error) => console.log(error.message),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  }

  fetchUserTypes = () => {
    fetch("http://ruppinmobile.tempdomain.co.il/SITE14/ComingHomeWS.asmx/GetUserTypes", {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json;'
      }),
      body: null
    })
      .then(res => res.json()) // קובע שהתשובה מהשרת תהיה בפורמט JSON
      .then((result) => { // no error in server
        let userTypes = JSON.parse(result.d);

        let userTypesStr = JSON.stringify(userTypes);

        AsyncStorage.setItem('userTypesStr', userTypesStr).then(() => {
          console.log('userTypes = ' + userTypesStr);
          this.setState({userTypes : userTypes});
        });
      })
      .catch((error) => {
        alert("A connection Error has occurred during fetchUserTypes().");
      });
  }

  fetchRoomTypes = () => {
    fetch("http://ruppinmobile.tempdomain.co.il/SITE14/ComingHomeWS.asmx/GetRoomTypes", {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json;'
      }),
      body: null
    })
      .then(res => res.json()) // קובע שהתשובה מהשרת תהיה בפורמט JSON
      .then((result) => { // no error in server
        let roomTypes = JSON.parse(result.d);

        let roomTypesStr = JSON.stringify(roomTypes);

        AsyncStorage.setItem('roomTypesStr', roomTypesStr).then(() => {
          console.log('roomTypes = ' + roomTypesStr);
          this.setState({roomTypes : roomTypes});
        });
      })
      .catch((error) => {
        alert("A connection Error has occurred during fetchRoomTypes().");
      });
  }

  fetchDeviceTypes = () => {
    fetch("http://ruppinmobile.tempdomain.co.il/SITE14/ComingHomeWS.asmx/GetDeviceTypes", {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json;'
      }),
      body: null
    })
      .then(res => res.json()) // קובע שהתשובה מהשרת תהיה בפורמט JSON
      .then((result) => { // no error in server
        let deviceTypes = JSON.parse(result.d);

        let deviceTypesStr = JSON.stringify(deviceTypes);

        AsyncStorage.setItem('deviceTypesStr', deviceTypesStr).then(() => {
          console.log('deviceTypes = ' + deviceTypesStr);
          this.setState({deviceTypes : deviceTypes});
        });
      })
      .catch((error) => {
        alert("A connection Error has occurred during fetchDeviceTypes().");
      });
  }

  fetchActivationMethods = () => {
    fetch("http://ruppinmobile.tempdomain.co.il/SITE14/ComingHomeWS.asmx/GetActivationMethods", {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json;'
      }),
      body: null
    })
      .then(res => res.json()) // קובע שהתשובה מהשרת תהיה בפורמט JSON
      .then((result) => { // no error in server
        let activationMethods = JSON.parse(result.d);

        let activationMethodsStr = JSON.stringify(activationMethods);

        AsyncStorage.setItem('activationMethodsStr', activationMethodsStr).then(() => {
          console.log('activationMethods = ' + activationMethodsStr);
          this.setState({activationMethods : activationMethods});
        });
      })
      .catch((error) => {
        alert("A connection Error has occurred during fetchActivationMethods().");
      });
  }

  render() {
    if (this.state.userTypes == null)
    {
      this.fetchUserTypes();
    }

    return (
      <SessionNavigator navigation={this.props.navigation} />
    );
  }
}