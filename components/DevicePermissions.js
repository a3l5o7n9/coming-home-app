import React from 'react';
import { StyleSheet, Text, View, AsyncStorage, ScrollView } from 'react-native';
import { Button } from 'react-native-material-ui';
import DevicePermissionDetails from './DevicePermissionDetails';

export default class DevicePermissions extends React.Component {
  static navigationOptions = {
    title: 'DevicePermissions'
  }

  constructor(props) {
    super(props);

    this.state = {
      appUser: {},
      home: {},
      deviceList: [],
      roomList: [],
      user: {},
      devicePermissionList: []
    }
  }

  componentDidMount = () => {
    AsyncStorage.getItem('homeStr').then((value) => {
      home = JSON.parse(value);

      AsyncStorage.getItem('detailsStr').then((value) => {
        details = JSON.parse(value);

        AsyncStorage.getItem('userStr').then((value) => {
          user = JSON.parse(value);

          AsyncStorage.getItem('devicePermissionsStr').then((value) => {
            devicePermissions = JSON.parse(value);

            AsyncStorage.getItem('devicesStr').then((value) => {
              devices = JSON.parse(value);

              AsyncStorage.getItem('roomsStr').then((value) => {
                rooms = JSON.parse(value);

                this.setState({
                  appUser: details.appUser,
                  home: home,
                  deviceList: devices.deviceList,
                  roomList: rooms.roomList,
                  user: user,
                  devicePermissionList: devicePermissions.devicePermissionList
                });
              });
            });
          });
        });
      });
    });
  }

  showDevicePermissions = () => {
    if (this.state.deviceList != null) {
      var deviceList = new Array();
      deviceList = this.state.deviceList;
      var accessibleDeviceList = deviceList.filter((de) => de.HasPermission === true)

      if (accessibleDeviceList != null) {
        return (
          <View style={styles.container}>
            <View style={styles.textViewStyle}>
              <Text style={styles.textStyle}>User Device Permissions</Text>
            </View>
            {
              accessibleDeviceList.map((device, DeviceId) => {
                let room = this.state.roomList.find((r) => r.RoomId === device.RoomId);
                let { appUser } = this.state;
                let { user } = this.state;
                let { home } = this.state;
                let { devicePermissionList } = this.state;
                let devicePermission = devicePermissionList.find((dePe) => dePe.DeviceId === device.DeviceId && dePe.RoomId === device.RoomId);

                return (
                  <View key={DeviceId} style={{ borderColor: 'blue', borderRadius: 10, borderWidth: 5, backgroundColor: 'skyblue', flex: 1, alignItems: 'center' }}>
                    <DevicePermissionDetails appUser={appUser} home={home} room={room} navigation={this.props.navigation} user={user} devicePermissionList={devicePermissionList} devicePermission={devicePermission} />
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

  render() {
    return (
      <ScrollView>
        <View style={styles.container}>
          <View style={{ flex: 8 }}>
            {this.showDevicePermissions()}
          </View>
          <View style={{ flex: 2 }}>
            <View style={styles.userButtonStyle}>
              <Button primary text="User" onPress={() => {this.props.navigation.navigate("User")}} />
            </View>
            <View style={styles.homeButtonStyle}>
              <Button primary text="Home" onPress={() => { this.props.navigation.navigate("Home") }} />
            </View>
          </View>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'navy',
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
    margin: 5,
  },
  userButtonStyle: {
    margin: 5,
    backgroundColor: 'cyan',
    borderColor: 'blue',
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