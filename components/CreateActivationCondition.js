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
      userList: [],
      homeList: [],
      allUserRoomsList: [],
      allUserDevicesList: [],
      allUserActivationConditionsList: [],
      resultMessage: [],
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
                      userList: details.userList,
                      homeList: details.homeList,
                      allUserRoomsList: details.allUserRoomsList,
                      allUserDevicesList: details.allUserDevicesList,
                      allUserActivationConditionsList: details.allUserActivationConditionsList,
                      resultMessage: details.resultMessage,
                      home: home,
                      deviceList: devices.deviceList,
                      roomList: rooms.roomList,
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
  }

  createActivationCondition = () => {
    const userId = this.state.appUser['UserId'];
    const homeId = this.state.home['HomeId'];
    var device = this.state.device;
    var room = this.state.room;
    var { conditionName, turnOn, activationMethodName, distanceOrTimeParam, activationParam } = this.state;

    if (conditionName == '' || activationMethodName == '' || device.DeviceId == '' || room.RoomId == '') {
      alert("Creating a condition requires a name, an activation method, a device and a room");
      return;
    }

    if (distanceOrTimeParam == '' || distanceOrTimeParam == null) {
      distanceOrTimeParam = 'null';
    }

    if (activationParam == '' || activationParam == null) {
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

    fetch("http://orhayseriesnet.ddns.net/Coming_Home/ComingHomeWS.asmx/CreateActivationCondition", {
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

              if (this.state.activationConditionList != null) {
                activationConditionList = this.state.activationConditionList;
              }

              var allUserActivationConditionsList = [];

              if (this.state.allUserActivationConditionsList != null)
              {
                allUserActivationConditionsList = this.state.allUserActivationConditionsList;
              }

              activationConditionList.push(activationCondition);
              allUserActivationConditionsList.push(activationCondition);

              var activationConditionsNew = {
                activationConditionList,
                resultMessage: 'Data',
              }

              var detailsNew = {
                appUser: this.state.appUser,
                userList: this.state.userList,
                homeList: this.state.homeList,
                allUserRoomsList: this.state.allUserRoomsList,
                allUserDevicesList: this.state.allUserDevicesList,
                allUserActivationConditionsList: allUserActivationConditionsList,
                resultMessage: this.state.resultMessage
              }

              let activationConditionStr = JSON.stringify(activationCondition);
              let activationConditionsStr = JSON.stringify(activationConditionsNew);
              let detailsNewStr = JSON.stringify(detailsNew);

              AsyncStorage.setItem('activationConditionStr', activationConditionStr).then(() => {
                AsyncStorage.setItem('activationConditionsStr', activationConditionsStr).then(() => {
                 AsyncStorage.setItem('detailsStr', detailsNewStr).then(() => {
                  let deviceStr = JSON.stringify(device);
                  let roomStr = JSON.stringify(room);

                  AsyncStorage.setItem('deviceStr', deviceStr).then(() => {
                    AsyncStorage.setItem('roomStr', roomStr).then(() => {
                      this.props.navigation.navigate("ActivationCondition");
                    });
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
        style={styles.pickerStyle}
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
    if (this.state.deviceList != null) {
      var filteredDeviceList = this.state.deviceList.filter((d) => (d.HasPermission === true));
      if (filteredDeviceList != null) {
        if  (this.state.room.RoomId == ''){
          if (filteredDeviceList.length > 1)
          {
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
                  filteredDeviceList.map((d) => {
                    return (
                      <Picker.Item key={d.DeviceId} label={d.DeviceName} value={d.DeviceId} />
                    )
                  })
                }
              </Picker>
            );
          }
          else if(filteredDeviceList.length == 1)
          {
            var defaultDevice = filteredDeviceList[0];
            return (
              <Picker
                style={styles.pickerStyle}
                selectedValue={this.state.device.DeviceId}
                onValueChange={(itemValue) => {
                  var { device } = defaultDevice
                  this.setState({ device: device })
                }}
              >
                <Picker.Item key={device.DeviceId} label={device.DeviceName} value={device.DeviceId} />
              </Picker>
            );
          }
        }
        else {
          var filteredDeviceListInRoom = this.state.deviceList.filter((d) => (d.RoomId === this.state.room.RoomId && d.HasPermission === true));
          if (filteredDeviceListInRoom != null) {
            if (filteredDeviceListInRoom.length > 1)
            {
              return (
                <Picker
                  style={styles.pickerStyle}
                  selectedValue={this.state.device.DeviceId}
                  onValueChange={(itemValue) => {
                    var device = this.state.deviceList.find((device) => device.DeviceId === itemValue && device.RoomId === this.state.room.RoomId);
                    this.setState({ device: device })
                  }}
                >
                  {
                    filteredDeviceListInRoom.map((d) => {
                      return (
                        <Picker.Item key={d.DeviceId} label={d.DeviceName} value={d.DeviceId} />
                      )
                    })
                  }
                </Picker>
              );
            }
            else if (filteredDeviceListInRoom.length == 1)
            {
              var defaultDevice = filteredDeviceListInRoom[0];
              return (
                <Picker
                  style={styles.pickerStyle}
                  selectedValue={this.state.device.DeviceId}
                  onValueChange={(itemValue) => {
                    var { device } = defaultDevice
                    this.setState({ device: device })
                  }}
                >
                  <Picker.Item key={defaultDevice.DeviceId} label={defaultDevice.DeviceName} value={defaultDevice.DeviceId} />
                </Picker>
              );
            }
          }
          else {
            return (
              <Text style={styles.textStyle}>There are no devices in this room that you have permission to</Text>
            );
          }
        }
      }
      else
      {
        return (
          <Text style={styles.textStyle}>You must gain permissions to devices in this home first!</Text>
        );
      }
    }
    else {
      return (
        <Text style={styles.textStyle}>You must create a room and a device first!</Text>
      );
    }
  }

  pickRoom = () => {
    if (this.state.roomList != null) {
      if (this.state.roomList.length > 1)
      {
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
              this.state.roomList.map((r) => {
                return (
                  <Picker.Item key={r.RoomId} label={r.RoomName} value={r.RoomId} />
                );
              })
            }
          </Picker>
        );
      }
      else if (this.state.roomList.length == 1)
      {
        var defaultRoom = this.state.roomList[0];
        return (
          <Picker
            style={styles.pickerStyle}
            selectedValue={this.state.room.RoomId}
            onValueChange={(itemValue) => {
              var { room } = defaultRoom
              this.setState({ room: room })
            }}
          >
            <Picker.Item key={defaultRoom.RoomId} label={defaultRoom.RoomName} value={defaultRoom.RoomId} />
          </Picker>
        );
      }
    }
    else {
      return(
        <Text style={styles.textStyle}>You must create a room and a device first!</Text>
      )
    }
  }

  render() {
    return (
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.textViewStyle}>
            <Text style={styles.textStyle}>Condition Name</Text>
          </View>
          <View style={styles.textInputViewStyle}>
            <TextInput style={styles.textInputStyle} value={this.state.conditionName} placeholder="Condition Name" onChangeText={(conditionName) => this.setState({ conditionName })}></TextInput>
          </View>
          <View style={styles.switchViewStyle}>
            <Text style={styles.textStyle}>Turn Device On?</Text>
            <Switch value={this.state.turnOn} onValueChange={(turnOn) => { this.setState({ turnOn }) }} />
          </View>
          <View style={styles.textViewStyle}>
            <Text style={styles.textStyle}>Room</Text>
          </View>
          {this.pickRoom()}
          <View style={styles.textViewStyle}>
            <Text style={styles.textStyle}>Device</Text>
          </View>
          {this.pickDevice()}
          <View style={styles.textViewStyle}>
            <Text style={styles.textStyle}> Activation Method Name</Text>
          </View>
          {this.pickActivationMethod()}
          <View style={styles.textViewStyle}>
            <Text style={styles.textStyle}>Distance Or Time Parameter</Text>
          </View>
          <View style={styles.textInputViewStyle}>
            <TextInput style={styles.textInputStyle} value={this.state.distanceOrTimeParam} placeHolder="10 km" onChangeText={(distanceOrTimeParam) => this.setState({ distanceOrTimeParam })}></TextInput>
          </View>
          <View style={styles.textViewStyle}>
            <Text style={styles.textStyle}>Activation Parameter</Text>
          </View>
          <View style={styles.textInputViewStyle}>
            <TextInput style={styles.textInputStyle} value={this.state.activationParam} placeHolder="80% Power" onChangeText={(activationParam) => this.setState({ activationParam })}></TextInput>
          </View>
          <View style={styles.submitButtonViewStyle}>
            <Button primary text="Create" onPress={this.createActivationCondition} />
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
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  textStyle: {
    fontSize: 20,
    alignItems: 'center',
    color:'green',
  },
  textInputStyle: {
    fontSize: 25,
  },
  textViewStyle: {
    margin:5,
  },
  textInputViewStyle: {
    margin:5,
    borderColor:'black',
    borderRadius:5,
    borderWidth:1
  },
  switchViewStyle: {
    margin:5,
    borderColor:'black',
    borderRadius:5,
    borderWidth:1,
    flex: 1, 
    flexDirection: 'row', 
    justifyContent: 'space-between'
  },
  submitButtonViewStyle: {
    margin:5,
    backgroundColor:'yellow',
    borderColor:'gold',
    borderRadius:50,
    borderWidth:1
  },
  cancelButtonViewStyle: {
    margin:5,
    backgroundColor:'grey',
    borderColor:'lightgrey',
    borderRadius:50,
    borderWidth:1
  },
  pickerStyle: { 
    width: '80%', 
    borderColor: 'black', 
    borderRadius:5, 
    borderWidth: 2 
  },
});
