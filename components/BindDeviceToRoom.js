import React from 'react';
import { StyleSheet, Text, View, AsyncStorage, ScrollView, Picker } from 'react-native';
import { Button, ThemeProvider, Card } from 'react-native-material-ui';

export default class BindDeviceToRoom extends React.Component {
  static navigationOptions = {
    title: 'BindDeviceToRoom'
  }

  constructor(props) {
    super(props);

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

                this.setState({
                  appUser: details.appUser,
                  home: home,
                  roomList: rooms.roomList,
                  deviceList: devices.deviceList,
                  room: room,
                  device: device,
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

    fetch("http://ruppinmobile.tempdomain.co.il/SITE14/ComingHomeWS.asmx/BindDeviceToRoom", {
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

              deviceList.push(deviceNew);

              var devicesNew = {
                deviceList,
                resultMessage: 'Data',
              }

              let deviceStr = JSON.stringify(deviceNew);
              let devicesStr = JSON.stringify(devicesNew);

              AsyncStorage.setItem('deviceStr', deviceStr).then(() => {
                AsyncStorage.setItem('devicesStr', devicesStr).then(() => {
                  var { room } = this.state;

                  let roomStr = JSON.stringify(room);

                  AsyncStorage.setItem('roomStr', roomStr).then(() => {
                    this.props.navigation.navigate("Device");
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
        return (
          <Picker
            style={{ width: '80%', borderColor: 'green', borderWidth: 2 }}
            selectedValue={this.state.room.RoomId}
            onValueChange={(itemValue) => {
              var room = this.state.roomList.find((room) => room.RoomId === itemValue);
              this.setState({ room: room })
            }}
          >
            {
              this.state.roomList.map((r) => {
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
            style={{ width: '80%', borderColor: 'green', borderWidth: 2 }}
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
          style={{ width: '80%', borderColor: 'green', borderWidth: 2 }}
          selectedValue={this.state.room.RoomId}
          onValueChange={(itemValue) => {
            var { room } = this.state
            this.setState({ room: room })
          }}
        >
          <Picker.Item key={room.RoomId} label={room.RoomName} value={room.RoomId} />
        </Picker>
      )
    }
  }

  pickDevice = () => {
    var { device } = this.state;

    if (this.state.deviceList != null) 
    {
      return (
        <Picker
          style={{ width: '80%', borderColor: 'green', borderWidth: 2 }}
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
    else 
    {
      return (
        <Picker
          style={{ width: '80%', borderColor: 'green', borderWidth: 2 }}
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
          <Text style={styles.textStyle}>Room</Text>
          {this.pickRoom()}
          <Text style={styles.textStyle}>Device</Text>
          {this.pickDevice()}
          <Button primary text="Bind" onPress={this.bindDeviceToRoom} />
          <Button primary text="Cancel" onPress={() => { this.props.navigation.goBack() }} />
        </View>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 10,
  },
  textStyle: {
    fontSize: 20,
    alignItems: 'center',
  },
  textInputStyle: {
    fontSize: 25,
  }
});

