import React from 'react';
import { StyleSheet, Text, View, AsyncStorage, Switch } from 'react-native';

export default class RoomPermissionDetails extends React.Component {
  constructor(props) {
    super(props);

    this.api = "";
    this.state = {
      appUser: this.props.appUser,
      home: this.props.home,
      navigation: this.props.navigation,
      user: this.props.user,
      roomPermissionList: this.props.roomPermissionList,
      roomPermission: this.props.roomPermission
    }
  }

  updateUserRoomPermissions = () => {
    var appUserId = this.state.appUser["UserId"];
    var userToUpdateId = this.state.user["UserId"];
    var { roomPermission } = this.state;
    var homeId = this.state.home["HomeId"];
    var roomId = this.state.roomPermission["RoomId"];
    var hasAccess = false;

    if (this.state.roomPermission["HasAccess"]) {
      hasAccess = 'false';
    }
    else if (!this.state.roomPermission["HasAccess"]) {
      hasAccess = 'true';
    }

    var request = {
      appUserId,
      userToUpdateId,
      homeId,
      roomId,
      hasAccess
    }

    AsyncStorage.getItem('apiStr').then((value) => {
      let api = JSON.parse(value);

      fetch("http://" + api + "/ComingHomeWS.asmx/UpdateUserRoomPermissions", {
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
              alert("You do not have permission to change this user's permissions for this room.");
              break;
            }
          case -1:
            {
              alert("Room not found in that home.");
              break;
            }
          case 0:
            {
              alert("Action aborted, as it does not actually change the user's current permissions for this room.");
              break;
            }
          default:
            {
              roomPermission.HasAccess = !(roomPermission.HasAccess);              
              var roomPermissionList = this.state.roomPermissionList;
              var index = roomPermissionList.findIndex((r) => r.RoomId === this.state.roomPermission.RoomId);
              roomPermissionList[index].HasAccess = this.state.roomPermission.HasAccess;
              var roomPermissions = {
                roomPermissionList,
                resultMessage: 'Data'
              }
              var roomPermissionsStr = JSON.stringify(roomPermissions);

              AsyncStorage.setItem('roomPermissionsStr', roomPermissionsStr).then(() => {
                  this.setState({ roomPermission, roomPermissionList });
                  alert("Room Permission updated!");
              });
              break;
            }
        }
      })
      .catch((error) => {
        alert("A connection Error has occurred.");
      });
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start' }}>
          <Text style={{ fontSize: 20 }}>{this.state.roomPermission["RoomName"]}</Text>
          <Text style={{ fontSize: 15 }}>{this.state.roomPermission["RoomTypeName"]}</Text>
        </View>
        <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: "flex-end" }}>
          <Switch value={this.state.roomPermission["HasAccess"]} onValueChange={this.updateUserRoomPermissions} />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'powderblue',
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
