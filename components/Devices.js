import React from 'react';
import { StyleSheet, Text, View, AsyncStorage, ScrollView } from 'react-native';
import { Button } from 'react-native-material-ui';
import DeviceDetails from './DeviceDetails';

export default class Devices extends React.Component {
  static navigationOptions = {
    title: 'Devices'
  }

  constructor(props) {
    super(props);

    this.api = "";
    this.state = {
      appUser: {},
      home: {},
      deviceList: [],
      roomList: [],
      userList: [],
      homeList: [],
      allUserRoomsList: [],
      allUserDevicesList: [],
      allUserActivationConditionsList: [],
      resultMessage: ''
    }
  }

  componentDidMount = () => {
    AsyncStorage.getItem('homeStr').then((value) => {
      home = JSON.parse(value);

      AsyncStorage.getItem('detailsStr').then((value) => {
        details = JSON.parse(value);

        AsyncStorage.getItem('devicesStr').then((value) => {
          devices = JSON.parse(value);

          AsyncStorage.getItem('roomsStr').then((value) => {
            rooms = JSON.parse(value);

            AsyncStorage.getItem('apiStr').then((value) => {
              this.api = JSON.parse(value);

              this.setState({
                appUser: details.appUser,
                home: home,
                deviceList: devices.deviceList,
                roomList: rooms.roomList,
                userList: details.userList,
                homeList: details.homeList,
                allUserRoomsList: details.allUserRoomsList,
                allUserDevicesList: details.allUserDevicesList,
                allUserActivationConditionsList: details.allUserActivationConditionsList,
                resultMessage: details.resultMessage
              });
            });
          });
        });
      });
    });
  }

  showDevices = () => {
    if (this.state.deviceList != null) {
      var deviceList = new Array();
      deviceList = this.state.deviceList;
      var accessibleDeviceList = deviceList.filter((de) => de.HasPermission === true)

      if (accessibleDeviceList != null) {
        return (
          <View style={styles.container}>
            <View style={styles.textViewStyle}>
              <Text style={styles.textStyle}>Your Devices</Text>
            </View>
            {
              accessibleDeviceList.map((device, DeviceId) => {
                let room = this.state.roomList.find((r) => r.RoomId === device.RoomId);
                let { appUser } = this.state;
                let { home } = this.state;

                return (
                  <View key={DeviceId} style={{ borderColor: 'blue', borderRadius: 10, borderWidth: 5, backgroundColor: 'skyblue', flex: 1, alignItems: 'center' }}>
                    <DeviceDetails appUser={appUser} home={home} device={device} room={room} navigation={this.props.navigation} deviceList={this.state.deviceList} userList={this.state.userList} homeList={this.state.homeList} allUserRoomsList={this.state.allUserRoomsList} allUserDevicesList={this.state.allUserDevicesList} allUserActivationConditionsList={this.state.allUserActivationConditionsList} resultMessage={this.state.resultMessage} />
                  </View>
                )
              })
            }
          </View>
        );
      }
      else {
        return (
          <View style={styles.textViewStyle}>
            {
              <Text style={styles.textStyle}>There are no devices in your home that you have access to</Text>
            }
          </View>
        );
      }
    }
    else {
      return (
        <View style={styles.textViewStyle}>
          {
            <Text style={styles.textStyle}>There are no devices in your home that you have access to</Text>
          }
        </View>
      );
    }
  }

  goToCreateDevice = () => {
    fetch("http://" + this.api + "/ComingHomeWS.asmx/GetDeviceTypes", {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json;'
      }),
      body: null
    })
      .then(res => res.json()) // קובע שהתשובה מהשרת תהיה בפורמט JSON
      .then((result) => { // no error in server
        let deviceTypes = JSON.parse(result.d);

        var room = {
          RoomId: '',
          RoomName: '',
          RoomTypeName: '',
          HasAccess: false
        }

        let deviceTypesStr = JSON.stringify(deviceTypes);

        AsyncStorage.setItem('deviceTypesStr', deviceTypesStr).then(() => {

          let roomStr = JSON.stringify(room);

          AsyncStorage.setItem('roomStr', roomStr).then(() => {
            this.props.navigation.navigate("CreateDevice")
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
          <View style={{ flex: 8 }}>
            {this.showDevices()}
          </View>
          <View style={{ flex: 2 }}>
            <View style={styles.createButtonStyle}>
              <Button primary text="Add New Device" onPress={this.goToCreateDevice} />
            </View>
            <View style={styles.homeButtonStyle}>
              <Button primary text="Home" onPress={() => { this.props.navigation.navigate("Home") }} />
            </View>
          </View>
        </View>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'blue',
    justifyContent: 'space-between',
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
    margin: 5,
  },
  createButtonStyle: {
    margin: 5,
    backgroundColor: 'yellow',
    borderColor: 'gold',
    borderRadius: 50,
    borderWidth: 1
  },
  homeButtonStyle: {
    margin: 5,
    backgroundColor: 'lightblue',
    borderColor: 'blue',
    borderRadius: 50,
    borderWidth: 1
  },
});
