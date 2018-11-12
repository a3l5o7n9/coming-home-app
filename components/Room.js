import React from 'react';
import { StyleSheet, Text, View, AsyncStorage, ScrollView } from 'react-native';
import { Button, ThemeProvider, Card } from 'react-native-material-ui';
import DeviceDetails from './DeviceDetails';

export default class Room extends React.Component {
  static navigationOptions = {
    title: 'Room'
  }

  constructor(props) {
    super(props);

    this.state = {
      appUser: {},
      home: {},
      room: {
        RoomId: '',
        RoomName: '',
        RoomTypeName: ''
      },
      deviceList: [],
      userList: [],
      homeList: [],
      allUserRoomsList: [],
      allUserDevicesList: [],
      allUserActivationConditionsList: [],
      resultMessage: '',
      activationConditionList: []
    }
  }

  componentDidMount = () => {
    AsyncStorage.getItem('homeStr').then((value) => {
      home = JSON.parse(value);

      AsyncStorage.getItem('detailsStr').then((value) => {
        details = JSON.parse(value);

        AsyncStorage.getItem('roomStr').then((value) => {
          room = JSON.parse(value);

          AsyncStorage.getItem('devicesStr').then((value) => {
            devices = JSON.parse(value);

            AsyncStorage.getItem('activationConditionsStr').then((value) => {
              activationConditions = JSON.parse(value);

              this.setState({
                appUser: details.appUser,
                home: home,
                room: room,
                deviceList: devices.deviceList,
                userList: details.userList,
                homeList: details.homeList,
                allUserRoomsList: details.allUserRoomsList,
                allUserDevicesList: details.allUserDevicesList,
                allUserActivationConditionsList: details.allUserActivationConditionsList,
                resultMessage: details.resultMessage,
                activationConditionList: activationConditions.activationConditionList
              })
            })
          });
        });
      });
    });
  }

  showDevices = () => {
    if (this.state.deviceList != null) {
      var filteredDeviceList = this.state.deviceList.filter((d) => (d.RoomId === this.state.room.RoomId));

      if (filteredDeviceList != null) {
        return (
          <View style={styles.container}>
            <Text style={styles.textStyle}>Your Devices In This Room</Text>
            {
              filteredDeviceList.map((device, DeviceId) => {
                var { room } = this.state;
                var { appUser } = this.state;
                var { home } = this.state;

                return (
                  <View key={DeviceId} style={{borderColor:'blue', borderRadius:10, borderWidth:5, backgroundColor:'skyblue', flex: 1, alignItems: 'center' }}>
                    <DeviceDetails appUser={appUser} home={home} device={device} room={room} navigation={this.props.navigation} deviceList={this.state.deviceList} userList={this.state.userList} homeList={this.state.homeList} allUserRoomsList={this.state.allUserRoomsList} allUserDevicesList={this.state.allUserDevicesList} allUserActivationConditionsList={this.state.allUserActivationConditionsList} resultMessage={this.state.resultMessage}/>
                  </View>
                )
              })
            }
          </View>
        );
      }
      else {
        return (
          <View>
            {
              <Text style={styles.textStyle}>There are no devices in this room that you have access to</Text>
            }
          </View>
        );
      }
    }
    else {
      return (
        <View>
          {
            <Text style={styles.textStyle}>There are no devices in this room that you have access to</Text>
          }
        </View>
      );
    }
  }

  goToCreateDevice = () =>
  {
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
        var {room} = this.state;

        let deviceTypesStr = JSON.stringify(deviceTypes);

        AsyncStorage.setItem('deviceTypesStr', deviceTypesStr).then(() => {

          var roomStr = JSON.stringify(room);

          AsyncStorage.setItem('roomStr', roomStr).then(() => {
            this.props.navigation.navigate("CreateDevice")
          })
        })
      })
      .catch((error) => {
        alert("A connection Error has occurred.");
      });
  }

  goToBindDeviceToRoom = () =>
  {
    var device = {
      DeviceId: '',
      DeviceName: '',
      DeviceTypeName: '',
    }

    var deviceStr = JSON.stringify(device);

    AsyncStorage.setItem('deviceStr', deviceStr).then(() => {
      this.props.navigation.navigate("BindDeviceToRoom");
    })
  }

  goToCreateActivationCondition = () =>
  {
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
        var {room} = this.state;
        var device = {
          DeviceId : '',
          DeviceName : '',
          DeviceTypeName : ''
        }

        let activationMethodsStr = JSON.stringify(activationMethods);

        AsyncStorage.setItem('activationMethodsStr', activationMethodsStr).then(() => {

          var roomStr = JSON.stringify(room);

          AsyncStorage.setItem('roomStr', roomStr).then(() => {

            var deviceStr = JSON.stringify(device);

            AsyncStorage.setItem('deviceStr', deviceStr).then(() => {
              this.props.navigation.navigate("CreateActivationCondition");
            })
          })
        })
      })
      .catch((error) => {
        alert("A connection Error has occurred.");
      });
  }


  render() {
    return (
      <ScrollView>
        <View style={styles.container}>
          <Text style={{flex: 1, fontSize: 25 }}>{this.state.room["RoomName"]}</Text>
          <View style={{ flex: 8 }}>
            {this.showDevices()}
          </View>
          <View>
            <View style={styles.createButtonStyle}>
              <Button primary text="Add New Device" onPress={this.goToCreateDevice}/>
            </View>
            <View style={styles.bindButtonStyle}>
              <Button primary text="Add Existing Device" onPress={this.goToBindDeviceToRoom}/>
            </View>
            <View style={styles.createButtonStyle}>
              <Button primary text="Add New Condition" onPress={this.goToCreateActivationCondition} />
            </View>
            <View style={styles.updateButtonStyle}>
              <Button primary text="Update Room Details" onPress={() => {this.props.navigation.navigate('UpdateRoom')}}/>
            </View>
            <View style={styles.listButtonStyle}>
              <Button primary text="Rooms" onPress={() => {this.props.navigation.navigate("Rooms")}}/>
            </View>
            <View style={styles.homeButtonStyle}>
              <Button primary text="Home" onPress={() => {this.props.navigation.navigate("Home")}}/>
            </View>
          </View>
        </View>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'powderblue',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  textStyle: {
    fontSize: 20,
    alignItems: 'center',
  },
  textInputStyle: {
    fontSize: 25,
  },
  textViewStyle: {
    margin:5,
  },
  updateButtonStyle: {
    margin:5,
    backgroundColor:'lightgrey',
    borderColor:'silver',
    borderRadius:50,
    borderWidth:1
  },
  createButtonStyle: {
    margin:5,
    backgroundColor:'yellow',
    borderColor:'gold',
    borderRadius:50,
    borderWidth:1
  },
  bindButtonStyle: {
    margin:5,
    backgroundColor:'sandybrown',
    borderColor:'brown',
    borderRadius:50,
    borderWidth:1
  },
  homeButtonStyle: {
    margin:5,
    backgroundColor:'lightblue',
    borderColor:'blue',
    borderRadius:50,
    borderWidth:1
  },
  listButtonStyle: {
    margin:5,
    backgroundColor:'blue',
    borderColor:'powderblue',
    borderRadius:50,
    borderWidth:1
  },
});
