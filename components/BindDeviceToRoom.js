import React from 'react';
import { StyleSheet, Text, View, AsyncStorage, ScrollView, Picker } from 'react-native';
import { Button } from 'react-native-material-ui';

export default class BindDeviceToRoom extends React.Component {
  static navigationOptions = {
    title: 'BindDeviceToRoom'
  }

  constructor(props) {
    super(props);

    this.api = "";
    this.state = {
      appUser: {},
      home: {},
      device: {
        DeviceId: '',
        DeviceName: '',
        DeviceTypeName: ''
      },
      room: {
        RoomId: '',
        RoomName: ''
      },
      roomList: [],
      deviceList: [],
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

        AsyncStorage.getItem('roomsStr').then((value) => {
          rooms = JSON.parse(value);

          AsyncStorage.getItem('devicesStr').then((value) => {
            devices = JSON.parse(value);

            AsyncStorage.getItem('roomStr').then((value) => {
              room = JSON.parse(value);

              AsyncStorage.getItem('deviceStr').then((value) => {
                device = JSON.parse(value);

                AsyncStorage.getItem('apiStr').then((value) => {
                  this.api = JSON.parse(value);

                  this.setState({
                    appUser: details.appUser,
                    home: home,
                    roomList: rooms.roomList,
                    deviceList: devices.deviceList,
                    room: room,
                    device: device,
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
      });
    });
  }

  bindDeviceToRoom = () => {
    var { room, device, appUser } = this.state;
    const roomId = room.RoomId;
    const deviceId = device.DeviceId;
    const userId = appUser.UserId;

    var request = {
      roomId,
      deviceId,
      userId
    }

    fetch("http://" + this.api + "/ComingHomeWS.asmx/BindDeviceToRoom", {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json;'
      }),
      body: JSON.stringify(request)
    })
      .then(res => res.json()) // קובע שהתשובה מהשרת תהיה בפורמט JSON
      .then((result) => { // no error in server
        const resultId = JSON.parse(result.d);

        switch (resultId) {
          case -1:
            {
              alert("You do not have the necessary permissions to perform this action.");
              break;
            }
          case 0:
            {
              alert("This Device is already bound to that Room.");
              break;
            }
          default:
            {
              var deviceNew =
              {
                DeviceId: deviceId,
                DeviceName: device.DeviceName,
                DeviceTypeName: device.DeviceTypeName,
                HomeId: device.homeId,
                IsDividedIntoRooms: true,
                RoomId: roomId
              }

              var deviceList = [];

              if (this.state.deviceList != null) {
                deviceList = this.state.deviceList;
              }

              var allUserDevicesList = [];

              if (this.state.allUserDevicesList != null) {
                allUserDevicesList = this.state.allUserDevicesList;
              }

              deviceList.push(deviceNew);
              allUserDevicesList.push(deviceNew);

              var devicesNew = {
                deviceList,
                resultMessage: 'Data',
              }

              var detailsNew = {
                appUser: this.state.appUser,
                userList: this.state.userList,
                homeList: this.state.homeList,
                allUserRoomsList: this.state.allUserRoomsList,
                allUserDevicesList: allUserDevicesList,
                allUserActivationConditionsList: this.state.allUserActivationConditionsList,
                resultMessage: this.state.resultMessage
              }

              let deviceStr = JSON.stringify(deviceNew);
              let devicesStr = JSON.stringify(devicesNew);
              let detailsNewStr = JSON.stringify(detailsNew);

              AsyncStorage.setItem('deviceStr', deviceStr).then(() => {
                AsyncStorage.setItem('devicesStr', devicesStr).then(() => {
                  AsyncStorage.setItem('detailsStr', detailsNewStr).then(() => {
                    var { room } = this.state;

                    let roomStr = JSON.stringify(room);

                    AsyncStorage.setItem('roomStr', roomStr).then(() => {
                      this.props.navigation.navigate("Device");
                    });
                  });
                });
              });

              break;
            }
        }
      })
      .catch((error) => {
        alert('A connection error has occurred.');
      });
  }

  pickRoom = () => {
    var { room } = this.state;
    if (room.RoomId == '') {
      if (this.state.roomList != null) {
        var roomList = new Array();
        roomList = this.state.roomList;
        var accessibleRoomList = roomList.filter((ro) => ro.HasAccess === true);

        if (accessibleRoomList != null) {
          return (
            <Picker
              style={styles.pickerStyle}
              selectedValue={this.state.room.RoomId}
              onValueChange={(itemValue) => {
                var room = this.state.roomList.find((room) => room.RoomId === itemValue);
                this.setState({ room: room })
              }}
            >
              {
                accessibleRoomList.map((r) => {
                  return (
                    <Picker.Item key={r.RoomId} label={r.RoomName} value={r.RoomId} />
                  );
                })
              }
            </Picker>
          );
        }
        else {
          return (
            <Picker
              style={styles.pickerStyle}
              selectedValue={this.state.room.RoomId}
              onValueChange={(itemValue) => {
                var { room } = this.state
                this.setState({ room: room })
              }}
            >
              <Picker.Item key={room.RoomId} label={room.RoomName} value={room.RoomId} />
            </Picker>
          );
        }
      }
      else {
        return (
          <Picker
            style={styles.pickerStyle}
            selectedValue={this.state.room.RoomId}
            onValueChange={(itemValue) => {
              var { room } = this.state
              this.setState({ room: room })
            }}
          >
            <Picker.Item key={room.RoomId} label={room.RoomName} value={room.RoomId} />
          </Picker>
        );
      }
    }
  }

  pickDevice = () => {
    var { device } = this.state;

    if (this.state.deviceList != null) {
      return (
        <Picker
          style={styles.pickerStyle}
          selectedValue={this.state.device.DeviceId}
          onValueChange={(itemValue) => {
            var device = this.state.deviceList.find((device) => device.DeviceId === itemValue);
            this.setState({ device: device })
          }}
        >
          {
            this.state.deviceList.map((d) => {
              return (
                <Picker.Item key={d.DeviceId} label={d.DeviceName} value={d.DeviceId} />
              );
            })
          }
        </Picker>
      );
    }
    else {
      return (
        <Picker
          style={styles.pickerStyle}
          selectedValue={this.state.device.DeviceId}
          onValueChange={(itemValue) => {
            var { device } = this.state;
            this.setState({ device: device })
          }}
        >
          <Picker.Item key={device.DeviceId} label={device.DeviceName} value={device.DeviceId} />
        </Picker>
      );
    }
  }

  render() {
    return (
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.textViewStyle}>
            <Text style={styles.textStyle}>Room</Text>
          </View>
          {this.pickRoom()}
          <View style={styles.textViewStyle}>
            <Text style={styles.textStyle}>Device</Text>
          </View>
          {this.pickDevice()}
          <View style={styles.submitButtonViewStyle}>
            <Button primary text="Bind" onPress={this.bindDeviceToRoom} />
          </View>
          <View style={styles.cancelButtonViewStyle}>
            <Button primary text="Cancel" onPress={() => { this.props.navigation.goBack() }} />
          </View>
        </View>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'peachpuff',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 10,
  },
  textStyle: {
    fontSize: 20,
    alignItems: 'center',
    color: 'green',
  },
  textInputStyle: {
    fontSize: 25,
  },
  textViewStyle: {
    margin: 5,
  },
  textInputViewStyle: {
    margin: 5,
    borderColor: 'black',
    borderRadius: 5,
    borderWidth: 1
  },
  submitButtonViewStyle: {
    margin: 5,
    backgroundColor: 'lightgrey',
    borderColor: 'silver',
    borderRadius: 50,
    borderWidth: 1
  },
  cancelButtonViewStyle: {
    margin: 5,
    backgroundColor: 'grey',
    borderColor: 'lightgrey',
    borderRadius: 50,
    borderWidth: 1
  },
  pickerStyle: {
    width: '80%',
    borderColor: 'black',
    borderRadius: 5,
    borderWidth: 2
  },
});

