import React from 'react';
import { StyleSheet, Text, View, Alert, TextInput, AsyncStorage, ScrollView, Picker } from 'react-native';
import { Button, ThemeProvider, Card } from 'react-native-material-ui';

export default class CreateActivationCondition extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user: {},
      home: {},
      room: {},
      device: {},
      conditionName: '',
      activationMethodName: '',
      distanceOrTimeParam: '',
      activationParam: '',
      activationMethods: [],
      roomList: [],
      deviceList: []
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

            AsyncStorage.getItem('usersStr').then((value) => {
              users = JSON.parse(value);

              AsyncStorage.getItem('activationConditionsStr').then((value) => {
                activationConditions = JSON.parse(value);

                AsyncStorage.getItem('activationMethodsStr').then((value) => {
                  activationMethods = JSON.parse(value);

                  AsyncStorage.getItem('roomStr').then((value) => {
                    room = JSON.parse(value);

                    AsyncStorage.getItem('deviceStr').then((value) => {
                      device = JSON.parse(value);

                      this.setState({
                        user: details.user,
                        home: home,
                        deviceList: devices.deviceList,
                        roomList: rooms.roomList,
                        userList: users.userList,
                        activationConditionList: activationConditions.activationConditionList,
                        activationMethods: activationMethods,
                        room: room,
                        device: device,
                        roomList: rooms.roomList,
                        deviceList: devices.deviceList
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  }

  createActivationCondition = () => {
    const userId = this.state.user['UserId'];
    const homeId = this.state.home['HomeId'];
    const device = this.state.device;
    const room = this.state.room;
    var { conditionName, activationMethodName, distanceOrTimeParam, activationParam } = this.state;

    if (conditionName == '' || activationMethodName == '' || device.DeviceId == '' || room.RoomId == '') {
      alert("Creating a condition requires a name, an activation method, a device and a room");
      return;
    }

    var deviceId = device['DeviceId'];
    var roomId = room['RoomId'];

    var request = {
      conditionName,
      userId,
      homeId,
      deviceId,
      roomId,
      activationMethodName,
      distanceOrTimeParam,
      activationParam
    }

    fetch("http://ruppinmobile.tempdomain.co.il/SITE14/ComingHomeWS.asmx/CreateActivationCondition", {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json;'
      }),
      body: JSON.stringify(request)
    })
      .then(res => res.json()) // קובע שהתשובה מהשרת תהיה בפורמט JSON
      .then((result) => { // no error in server
        const conditionId = JSON.parse(result.d);

        switch (conditionId) {
          case -3:
            {
              alert('Error! Room could not be found!');
              return;
            }
          case -2:
            {
              alert('Error! You are not registered as a member of this home.');
              return;
            }
          case 0:
            {
              alert("There is already a condition with those properties in this home. Use a different name, or change some of the properties.");
              break;
            }
          default:
            {
              var activationCondition =
              {
                ConditionId: conditionId,
                CoinditionName: conditionName,
                CreatedByUserId: userId,
                HomeId: homeId,
                DeviceId: deviceId,
                RoomId: roomId,
                ActivationMethodName: activationMethodName,
                DeviceOrTimeParam: deviceOrTimeParam,
                ActivationParam: activationParam
              }

              let activationConditionStr = JSON.stringify(activationCondition);

              AsyncStorage.setItem('activationConditionStr', activationConditionStr).then(() => {
                // console.log("roomStr");
                // AsyncStorage.getItem('roomStr').then((value) => {
                //   console.log('roomStr = ' + value);
                // });
                this.props.navigation.navigate("ActivationCondition");
              });
              break;
            }
        }
      })
      .catch((error) => {
        alert('A connection error has occurred.');
      });
  }

  pickActivationMethod = () => {
    return (
      <Picker
        style={{ width: '80%', borderColor: 'green', borderWidth: 2 }}
        selectedValue={this.state.activationMethodName}
        onValueChange={(itemValue) => this.setState({ activationMethodName: itemValue })}>
        {
          this.state.activationMethods.map((activationMethod) => {
            return (
              <Picker.Item key={activationMethod["ActivationMethodCode"]} label={activationMethod["ActivationMethodName"]} value={activationMethod["ActivationMethodName"]} />
            )
          })
        }
      </Picker>
    );
  }

  pickDevice = () => {
    if (this.state.room.RoomId == '')
    {
      return (
        <Picker
          style={{ width: '80%', borderColor: 'green', borderWidth: 2 }}
          selectedValue={this.state.device.DeviceId}
          onValueChange={(itemValue) => {
            var device = this.state.deviceList.find((device) => device.DeviceId === itemValue);
            this.setState({ device: device })
          }
          }>
          {
            this.state.deviceList.map((d) => {
              return (
                <Picker.Item key={d.DeviceId} label={d.DeviceName} value={d.DeviceId} />
              )
            })
          }
        </Picker>
      );
    }
    else
    {
      var filteredDeviceList = this.state.deviceList.filter((d) => (d.RoomId === this.state.room.RoomId));
      return (
        <Picker
          style={{ width: '80%', borderColor: 'green', borderWidth: 2 }}
          selectedValue={this.state.device.DeviceId}
          onValueChange={(itemValue) => {
            var device = this.state.deviceList.find((device) => device.DeviceId === itemValue);
            this.setState({ device: device })
          }
          }>
          {
            filteredDeviceList.map((d) => {
              return (
                <Picker.Item key={d.DeviceId} label={d.DeviceName} value={d.DeviceId} />
              )
            })
          }
        </Picker>
      )
    }
  }

  pickRoom = () => {
    return (
      <Picker
        style={{ width: '80%', borderColor: 'green', borderWidth: 2 }}
        selectedValue={this.state.room.RoomId}
        onValueChange={(itemValue) => {
          var room = this.state.roomList.find((room) => room.RoomId === itemValue);
          this.setState({ room: room })
        }
        }>
        {
          this.state.roomList.map((r) => {
            return (
              <Picker.Item key={r.RoomId} label={r.RoomName} value={r.RoomId} />
            )
          })
        }
      </Picker>
    );
  }

  render() {
    return (
      <ScrollView>
        <View style={styles.container}>
          <Text style={{ fontSize: 30 }}>Create Activation Condition</Text>
          <Text style={styles.textStyle}>Condition Name</Text>
          <TextInput style={styles.textInputStyle} value={this.state.conditionName} placeholder="Condition Name" onChangeText={(conditionName) => this.setState({ conditionName })}></TextInput>
          <Text style={styles.textStyle}> Activation Method Name</Text>
          {this.pickActivationMethod()}
          <Text style={styles.textStyle}>Device</Text>
          {this.pickDevice()}
          <Text style={styles.textStyle}>Room</Text>
          {this.pickRoom()}
          <Text style={styles.textStyle}>Distance Or Time Parameter</Text>
          <TextInput style={styles.textInputStyle} value={this.state.distanceOrTimeParam} placeHolder="10 km" onChangeText={(distanceOrTimeParam) => this.setState({ distanceOrTimeParam })}></TextInput>
          <Text style={styles.textStyle}>Activation Parameter</Text>
          <TextInput style={styles.textInputStyle} value={this.state.activationParam} placeHolder="80% Power" onChangeText={(activationParam) => this.setState({ activationParam })}></TextInput>
          <Button primary text="Create" onPress={this.createActivationCondition} />
          <Button primary text="Cancel" onPress={() => { this.props.navigation.navigate("ActivationConditions") }} />
        </View>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textStyle: {
    fontSize: 20,
    alignItems: 'center',
  },
  textInputStyle: {
    fontSize: 25,
  }
});
