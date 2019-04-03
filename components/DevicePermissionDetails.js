import React from 'react';
import { StyleSheet, Text, View, AsyncStorage, Switch } from 'react-native';
import { Button, ThemeProvider, Card } from 'react-native-material-ui';

export default class DevicePermissionDetails extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      appUser: this.props.appUser,
      home: this.props.home,
      room: this.props.room,
      navigation: this.props.navigation,
      user: this.props.user,
      devicePermissionList: this.props.devicePermissionList,
      devicePermission: this.props.devicePermission
    }
  }

  updateUserDevicePermissions = () => {
    var appUserId = this.state.appUser["UserId"];
    var userToUpdateId = this.state.user["UserId"];
    var { devicePermission } = this.state;
    var homeId = this.state.home["HomeId"];
    var deviceId = this.state.devicePermission["DeviceId"];
    var roomId = this.state.devicePermission["RoomId"];
    var hasPermission = false;

    if (this.state.devicePermission["HasPermission"]) {
      hasPermission = 'false';
    }
    else if (!this.state.devicePermission["HasPermission"]) {
      hasPermission = 'true';
    }

    var request = {
      appUserId,
      userToUpdateId,
      homeId,
      deviceId,
      roomId,
      hasPermission
    }

    fetch("http://orhayseriesnet.ddns.net/Coming_Home/ComingHomeWS.asmx/UpdateUserDevicePermissions", {
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
              alert("You do not have permission to change this user's permissions for this device.");
              break;
            }
          case -1:
            {
              alert("Device not found in that room.");
              break;
            }
          case 0:
            {
              alert("Action aborted, as it does not actually change the user's current permissions for this device.");
              break;
            }
          default:
            {
              devicePermission.HasPermission = !(devicePermission.HasPermission);              
              var devicePermissionList = this.state.devicePermissionList;
              var index = devicePermissionList.findIndex((d) => d.DeviceId === this.state.devicePermission.DeviceId && d.RoomId === this.state.devicePermission.RoomId);
              devicePermissionList[index].HasPermission = this.state.devicePermission.HasPermission;
              var devicePermissions = {
                devicePermissionList,
                resultMessage: 'Data'
              }
              var devicePermissionsStr = JSON.stringify(devicePermissions);

              AsyncStorage.setItem('devicePermissionsStr', devicePermissionsStr).then(() => {
                  this.setState({ devicePermission, devicePermissionList });
                  alert("Device Permission updated!");
              });
              break;
            }
        }
      })
      .catch((error) => {
        alert("A connection Error has occurred.");
      });
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start' }}>
          <Text style={{ fontSize: 20 }}>{this.state.devicePermission["DeviceName"]}</Text>
          <Text style={{ fontSize: 15 }}>{this.state.devicePermission["DeviceTypeName"]}</Text>
          <Text style={{ fontSize: 10 }}>{this.state.room["RoomName"]}</Text>
        </View>
        <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: "flex-end" }}>
          <Switch value={this.state.devicePermission["HasPermission"]} onValueChange={this.updateUserDevicePermissions} />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'skyblue',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '70%',
  },
  textStyle: {
    fontSize: 20,
    alignItems: 'center',
  },
  textInputStyle: {
    fontSize: 25,
  }
});
