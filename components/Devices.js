import React from 'react';
import { StyleSheet, Text, View, Alert, TextInput, AsyncStorage, ScrollView } from 'react-native';
import { Button, ThemeProvider, Card } from 'react-native-material-ui';
import DeviceDetails from './DeviceDetails';

export default class Devices extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user: {},
      home: {},
      deviceList: [],
      roomList: []
    }

    // this.showDevices = this.showDevices.bind(this);
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

            AsyncStorage.getItem('usersStr').then((value) => {
              users = JSON.parse(value);

              this.setState({
                user: details.user,
                home: home,
                deviceList: devices.deviceList,
                roomList: rooms.roomList,
                userList: users.userList
              });
            });
          });
        });
      });
    });
  }

  showDevices = () => {
    if (this.state.deviceList != null) {
      return (
        <View style={styles.container}>
          <Text style={styles.textStyle}>Your Devices</Text>
          {
            this.state.deviceList.map((device, DeviceId) => {
              let room = this.state.roomList.find((r) => r.RoomId === device.RoomId);
              let { user } = this.state;
              let { home } = this.state;

              return (
                <View key={DeviceId} style={{ flex: 1, alignItems: 'center' }}>
                  <DeviceDetails user={user} home={home} device={device} room={room} navigation={this.props.navigation} deviceList={this.state.deviceList}/>
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
            <Text style={styles.textStyle}>There are no devices in your home that you have access to</Text>
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

        var room = {
          RoomId : '',
          RoomName : '',
          RoomTypeName : ''
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
          <Text style={{ flex: 1, fontSize: 30 }}>Devices</Text>
          <View style={{ flex: 8 }}>
            {this.showDevices()}
          </View>
          <View style={{ flex: 2 }}>
            <Button primary text="Add New Device" onPress={this.goToCreateDevice}/>
            <Button primary text="Home" onPress={() => { this.props.navigation.navigate("Home") }} />
          </View>
        </View>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    marginTop: 20,
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  textStyle: {
    fontSize: 20,
    alignItems: 'center',
  },
  textInputStyle: {
    fontSize: 25,
  }
});
