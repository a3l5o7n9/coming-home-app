import React from 'react';
import { StyleSheet, Text, View, TextInput, AsyncStorage, ScrollView, Picker, Switch } from 'react-native';
import { Button, ThemeProvider, Card } from 'react-native-material-ui';

export default class UpdateActivationCondition extends React.Component {
  static navigationOptions = {
    title: 'Update Activation Condition'
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
      resultMessage: '',
      home: {},
      room: {},
      device: {},
      activationCondition: {},
      newConditionName: '',
      newStatus: false,
      newActivationMethodName: '',
      newActivationMethodCode: '',
      newDistanceOrTimeParam: '',
      newActivationParam: '',
      activationMethods: [],
      roomList: [],
      deviceList: [],
      activationConditionList: [],
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

                    AsyncStorage.getItem('activationConditionStr').then((value) => {
                      activationCondition = JSON.parse(value);

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
                        activationCondition: activationCondition,
                        roomList: rooms.roomList,
                        deviceList: devices.deviceList,
                        newActivationMethodCode: activationMethods.find((activationMethod) => activationMethod.ActivationMethodName === activationCondition.ActivationMethodName).ActivationMethodCode,
                        newDistanceOrTimeParam: activationCondition.DistanceOrTimeParam,
                        newActivationParam: activationCondition.ActivationParam
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

  updateActivationConditionDetails = () => {
    const appUserId = this.state.appUser['UserId'];
    const homeId = this.state.home['HomeId'];
    const conditionId = this.state.activationCondition['ConditionId'];
    var newDevice = this.state.device;
    var newRoom = this.state.room;
    var newDeviceId = newDevice['DeviceId'];
    var newRoomId = newRoom['RoomId'];
    var { newConditionName, newStatus, newActivationMethodCode, newActivationMethodName, newDistanceOrTimeParam, newActivationParam } = this.state;

    if (newConditionName == '' || newConditionName == null) {
      newConditionName = 'null';
    }

    if (newStatus == '' || newStatus == null) {
      newStatus = 'null';
    }

    if (newActivationMethodCode == '' || newActivationMethodCode == null) {
      newActivationMethodCode = 'null';
      newActivationMethodName = this.state.activationCondition.ActivationMethodName;
    }
    else {
      var typeIndex = this.state.activationMethods.findIndex((am) => am.ActivationMethodCode == newActivationMethodCode);

      newActivationMethodName = this.state.activationMethods[typeIndex].ActivationMethodName;
    }

    if (newDistanceOrTimeParam == '' || newDistanceOrTimeParam == null) {
      newDistanceOrTimeParam = 'null';
    }

    if (newActivationParam == '' || newActivationParam == null) {
      newActivationParam = 'null';
    }

    if (newDeviceId == '' || newDeviceId == null) {
      newDeviceId = 'null';
    }

    if (newRoomId == '' || newRoomId == null) {
      newRoomId = 'null';
    }

    var request = {
      appUserId,
      homeId,
      conditionId,
      newDeviceId,
      newRoomId,
      newConditionName,
      newStatus,
      newActivationMethodCode,
      newDistanceOrTimeParam,
      newActivationParam
    }

    fetch("http://orhayseriesnet.ddns.net/Coming_Home/ComingHomeWS.asmx/UpdateActivationConditionDetails", {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json;'
      }),
      body: JSON.stringify(request)
    })
      .then(res => res.json()) // קובע שהתשובה מהשרת תהיה בפורמט JSON
      .then((result) => { // no error in server
        const resultMessage = JSON.parse(result.d);

        switch (resultMessage) {
          case 'Update Completed':
            {
              var newActivationCondition =
              {
                ConditionId: conditionId,
                ConditionName: newConditionName == 'null' ? this.state.activationCondition.ConditionName : newConditionName,
                TurnOn: newStatus == 'null' ? this.state.activationCondition.TurnOn : newStatus,
                CreatedByUserId: appUserId,
                HomeId: homeId,
                DeviceId: newDeviceId == 'null' ? this.state.activationCondition.DeviceId : newDeviceId,
                RoomId: newRoomId == 'null' ? this.state.activationCondition.RoomId : newRoomId,
                ActivationMethodName: newActivationMethodName,
                DistanceOrTimeParam: newDistanceOrTimeParam == 'null' ? this.state.activationCondition.DistanceOrTimeParam : newDistanceOrTimeParam,
                ActivationParam: newActivationParam == 'null' ? this.state.activationCondition.ActivationParam : newActivationParam,
                IsActive: this.state.activationCondition.IsActive
              }

              var newActivationConditionList = new Array();
              var allUserActivationConditionsList = new Array();

              if (this.state.activationConditionList != null) {
                newActivationConditionList = this.state.activationConditionList;
              }

              if (this.state.allUserActivationConditionsList != null)
              {
                allUserActivationConditionsList = this.state.allUserActivationConditionsList;
              }

              var index = newActivationConditionList.findIndex((ac) => (ac.ConditionId === conditionId));
              var indexA = allUserActivationConditionsList.findIndex((acCo) => (acCo.ConditionId === conditionId));

              newActivationConditionList[index].ConditionName = newActivationCondition.ConditionName;
              allUserActivationConditionsList[indexA].ConditionName = newActivationCondition.ConditionName;
              newActivationConditionList[index].TurnOn = newActivationCondition.TurnOn;
              allUserActivationConditionsList[indexA].TurnOn = newActivationCondition.TurnOn;
              newActivationConditionList[index].DeviceId = newActivationCondition.DeviceId;
              allUserActivationConditionsList[indexA].DeviceId = newActivationCondition.DeviceId;
              newActivationConditionList[index].RoomId = newActivationCondition.RoomId;
              allUserActivationConditionsList[indexA].RoomId = newActivationCondition.RoomId;
              newActivationConditionList[index].ActivationMethodName = newActivationCondition.ActivationMethodName;
              allUserActivationConditionsList[indexA].ActivationMethodName = newActivationCondition.ActivationMethodName;
              newActivationConditionList[index].DistanceOrTimeParam = newActivationCondition.DistanceOrTimeParam;
              allUserActivationConditionsList[indexA].DistanceOrTimeParam = newActivationCondition.DistanceOrTimeParam;
              newActivationConditionList[index].ActivationParam = newActivationCondition.ActivationParam;
              allUserActivationConditionsList[indexA].ActivationParam = newActivationCondition.ActivationParam;

              var activationConditionsNew = {
                activationConditionList: newActivationConditionList,
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

              let activationConditionStr = JSON.stringify(newActivationCondition);
              let activationConditionsStr = JSON.stringify(activationConditionsNew);
              let detailsNewStr = JSON.stringify(detailsNew);

              AsyncStorage.setItem('activationConditionStr', activationConditionStr).then(() => {
                AsyncStorage.setItem('activationConditionsStr', activationConditionsStr).then(() => {
                 AsyncStorage.setItem('detailsStr', detailsNewStr).then(() => {
                  let deviceStr = JSON.stringify(newDevice);
                  let roomStr = JSON.stringify(newRoom);

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
          default:
            {
              alert(resultMessage);
              return;
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
        selectedValue={this.state.newActivationMethodCode}
        onValueChange={(itemValue) => this.setState({ newActivationMethodCode: itemValue })}>
        {
          this.state.activationMethods.map((activationMethod) => {
            return (
              <Picker.Item key={activationMethod["ActivationMethodCode"]} label={activationMethod["ActivationMethodName"]} value={activationMethod["ActivationMethodCode"]} />
            )
          })
        }
      </Picker>
    );
  }

  pickDevice = () => {
    if (this.state.room.RoomId == '') {
      if (this.state.deviceList != null) {
        return (
          <Picker
            style={styles.pickerStyle}
            selectedValue={this.state.device.DeviceId}
            onValueChange={(itemValue) => {
              var newDevice = this.state.deviceList.find((device) => device.DeviceId === itemValue);
              this.setState({ device: newDevice })
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
    }
    else {
      if (this.state.deviceList != null) {
        var filteredDeviceList = this.state.deviceList.filter((d) => (d.RoomId === this.state.room.RoomId));
        return (
          <Picker
            style={styles.pickerStyle}
            selectedValue={this.state.device.DeviceId}
            onValueChange={(itemValue) => {
              var newDevice = this.state.deviceList.find((device) => device.DeviceId === itemValue && device.RoomId === this.state.room.RoomId);
              this.setState({ device: newDevice })
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
            <Picker.Item key={newDevice.DeviceId} label={newDevice.DeviceName} value={newDevice.DeviceId} />
          </Picker>
        );
      }
    }
  }

  pickRoom = () => {
    if (this.state.roomList != null) {
      return (
        <Picker
          style={styles.pickerStyle}
          selectedValue={this.state.room.RoomId}
          onValueChange={(itemValue) => {
            var newRoom = this.state.roomList.find((room) => room.RoomId === itemValue);
            this.setState({ room: newRoom })
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

  render() {
    return (
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.textViewStyle}>
            <Text style={styles.textStyle}>Condition Name</Text>
          </View>
          <View style={styles.textInputViewStyle}>
            <TextInput style={styles.textInputStyle} value={this.state.newConditionName} placeholder={this.state.activationCondition.ConditionName} onChangeText={(newConditionName) => this.setState({ newConditionName })}></TextInput>
          </View>
          <View style={styles.switchViewStyle}>
            <Text style={styles.textStyle}>Turn Device On?</Text>
            <Switch value={this.state.newStatus} onValueChange={(newStatus) => { this.setState({ newStatus }) }} />
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
            <Text style={styles.textStyle}> Activation Method</Text>
          </View>
          {this.pickActivationMethod()}
          <View style={styles.textViewStyle}>
            <Text style={styles.textStyle}>Distance Or Time Parameter</Text>
          </View>
          <View style={styles.textInputViewStyle}>
            <TextInput style={styles.textInputStyle} value={this.state.newDistanceOrTimeParam} placeHolder={this.state.activationCondition.DistanceOrTimeParam} onChangeText={(newDistanceOrTimeParam) => this.setState({ newDistanceOrTimeParam })}></TextInput>
          </View>
          <View style={styles.textViewStyle}>
            <Text style={styles.textStyle}>Activation Parameter</Text>
          </View>
          <View style={styles.textInputViewStyle}>
            <TextInput style={styles.textInputStyle} value={this.state.newActivationParam} placeHolder={this.state.activationCondition.ActivationParam} onChangeText={(newActivationParam) => this.setState({ newActivationParam })}></TextInput>
          </View>
          <View style={styles.submitButtonViewStyle}>
            <Button primary text="Update" onPress={this.updateActivationConditionDetails} />
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
    backgroundColor: 'salmon',
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
    backgroundColor:'lightgrey',
    borderColor:'silver',
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
