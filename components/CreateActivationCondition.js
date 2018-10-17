import React from 'react';
import { StyleSheet, Text, View, TextInput, AsyncStorage, ScrollView, Picker, Switch } from 'react-native';
import { Button, ThemeProvider, Card } from 'react-native-material-ui';

export default class CreateActivationCondition extends React.Component {
  static navigationOptions = {
    title: 'New Activation Condition'
  }

  constructor(props) {
    super(props);

    this.state = {
      appUser: {},
      home: {},
      room: {},
      device: {},
      conditionName: '',
      turnOn: false,
      activationMethodName: '',
      distanceOrTimeParam: '07:00',
      activationParam: '25 `C',
      activationMethods: [],
      roomList: [],
      deviceList: [],
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
                        appUser: details.appUser,
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
    const userId = this.state.appUser['UserId'];
    const homeId = this.state.home['HomeId'];
    const device = this.state.device;
    const room = this.state.room;
    var { conditionName, turnOn, activationMethodName, distanceOrTimeParam, activationParam } = this.state;

    if (conditionName == '' || activationMethodName == '' || device.DeviceId == '' || room.RoomId == '') {
      alert("Creating a condition requires a name, an activation method, a device and a room");
      return;
    }

    if (distanceOrTimeParam == '' || distanceOrTimeParam == null)
    {
      distanceOrTimeParam = 'null';
    }

    if (activationParam == '' || activationParam == null)
    {
      activationParam = 'null';
    }

    var deviceId = device['DeviceId'];
    var roomId = room['RoomId'];

    var request = {
      conditionName,
      turnOn,
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
                ConditionName: conditionName,
                TurnOn: turnOn,
                CreatedByUserId: userId,
                HomeId: homeId,
                DeviceId: deviceId,
                RoomId: roomId,
                ActivationMethodName: activationMethodName,
                DistanceOrTimeParam: distanceOrTimeParam,
                ActivationParam: activationParam,
                IsActive: true
              }
              
              var activationConditionList = [];

              if(this.state.activationConditionList != null)
              {
                activationConditionList = this.state.activationConditionList;
              }

              activationConditionList.push(activationCondition);

              var activationConditionsNew = {
                activationConditionList,
                resultMessage: 'Data',
              }

              let activationConditionStr = JSON.stringify(activationCondition);
              let activationConditionsStr = JSON.stringify(activationConditionsNew);

              AsyncStorage.setItem('activationConditionStr', activationConditionStr).then(() => {
                AsyncStorage.setItem('activationConditionsStr', activationConditionsStr).then(() => {
                  let deviceStr = JSON.stringify(device);
                  let roomStr = JSON.stringify(room);

                  AsyncStorage.setItem('deviceStr', deviceStr).then(() => {
                    AsyncStorage.setItem('roomStr', roomStr).then(() => {
                      this.props.navigation.navigate("ActivationCondition");
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
                )
              })
            }
          </Picker>
        );
      }
      else
      {
        return (
          <Text style={styles.textStyle}>You must create a room and a device first!</Text>
        );
      }
    }
    else
    {
      if (this.state.deviceList != null)
      {
        var filteredDeviceList = this.state.deviceList.filter((d) => (d.RoomId === this.state.room.RoomId));
        return (
          <Picker
            style={{ width: '80%', borderColor: 'green', borderWidth: 2 }}
            selectedValue={this.state.device.DeviceId}
            onValueChange={(itemValue) => {
              var device = this.state.deviceList.find((device) => device.DeviceId === itemValue && device.RoomId === this.state.room.RoomId);
              this.setState({ device: device })
            }}
          >
            {
              filteredDeviceList.map((d) => {
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
        return(
          <Picker
            style={{ width: '80%', borderColor: 'green', borderWidth: 2 }}
            selectedValue={this.state.device.DeviceId}
            onValueChange={(itemValue) => {
              var {device} = this.state;
              this.setState({ device: device })
            }}
          >
            <Picker.Item key={device.DeviceId} label={device.DeviceName} value={device.DeviceId} />
          </Picker>
        );
      }
    }
  }

  pickRoom = () => {
    if (this.state.roomList != null) 
    {
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
    else
    {
      return(
        <Picker
          style={{ width: '80%', borderColor: 'green', borderWidth: 2 }}
          selectedValue={this.state.room.RoomId}
          onValueChange={(itemValue) => {
            var {room} = this.state
            this.setState({ room: room })
            }}
        > 
            <Picker.Item key={room.RoomId} label={room.RoomName} value={room.RoomId} />
        </Picker>
      );
    }
  }

  render() {
    return (
      <ScrollView>
        <View style={styles.container}>
          <Text style={styles.textStyle}>Condition Name</Text>
          <TextInput style={styles.textInputStyle} value={this.state.conditionName} placeholder="Condition Name" onChangeText={(conditionName) => this.setState({ conditionName })}></TextInput>
          <View style={{flex:1, flexDirection:'row', justifyContent:'space-between'}}>
            <Text style={styles.textStyle}>Turn Device On?</Text>
            <Switch value={this.state.turnOn} onValueChange={(turnOn) => {this.setState({turnOn})}}/>
          </View>
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
          <Button primary text="Cancel" onPress={() => { this.props.navigation.goBack() }} />
        </View>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
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
  }
});
