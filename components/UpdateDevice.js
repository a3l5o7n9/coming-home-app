import React from 'react';
import { StyleSheet, Text, View, TextInput, AsyncStorage, ScrollView, Picker, Switch } from 'react-native';
import { Button, ThemeProvider, Card } from 'react-native-material-ui';

export default class UpdateDevice extends React.Component {
  static navigationOptions = {
    title: 'Update Device'
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
      room: {
        RoomId: '',
        RoomName: '',
        RoomTypeName: '',
        HasAccess: false
      },
      device: {},
      roomList: [],
      newDeviceName: '',
      newDeviceTypeName: '',
      newDeviceTypeCode: '',
      newDivideStatus: false,
      deviceTypes: [],
    }
  }

  componentDidMount = () => {
    AsyncStorage.getItem('homeStr').then((value) => {
      home = JSON.parse(value);

      AsyncStorage.getItem('detailsStr').then((value) => {
        details = JSON.parse(value);

        AsyncStorage.getItem('deviceTypesStr').then((value) => {
          deviceTypes = JSON.parse(value);

          AsyncStorage.getItem('roomsStr').then((value) => {
            rooms = JSON.parse(value);

            AsyncStorage.getItem('roomStr').then((value) => {
              room = JSON.parse(value);

              AsyncStorage.getItem('deviceStr').then((value) => {
                device = JSON.parse(value);

                this.setState(
                {
                  appUser: details.appUser,
                  userList: details.userList,
                  homeList: details.homeList,
                  allUserRoomsList: details.allUserRoomsList,
                  allUserDevicesList: details.allUserDevicesList,
                  allUserActivationConditionsList: details.allUserActivationConditionsList,
                  resultMessage: details.resultMessage,
                  home: home,
                  deviceTypes: deviceTypes,
                  roomList: rooms.roomList,
                  room: room,
                  device: device
                });
              })
            });
          });
        });
      });
    });
  }

  updateDeviceDetails = () => {
    const appUserId = this.state.appUser['UserId'];
    const homeId = this.state.home['HomeId'];
    const deviceId = this.state.device['DeviceId'];
    var { newDeviceName, newDeviceTypeCode, newDeviceTypeName, newDivideStatus } = this.state;

    if (newDeviceName == '' || newDeviceName == null) 
    {
      newDeviceName = 'null';
    }

    if (newDeviceTypeCode == '' || newDeviceTypeCode == null)
    {
      newDeviceTypeCode = 'null';
      newDeviceTypeName = this.state.device.DeviceTypeName;
    }
    else
    {
      var typeIndex = this.state.deviceTypes.findIndex((dt) => dt.DeviceTypeCode == newDeviceTypeCode);
      newDeviceTypeName = this.state.deviceTypes[typeIndex].DeviceTypeName;
    }

    if (newDivideStatus == '' || newDivideStatus == null)
    {
      newDivideStatus = 'null';
    }

    var request = {
      appUserId,
      homeId,
      deviceId,
      newDeviceName,
      newDeviceTypeCode,
      newDivideStatus
    }

    fetch("http://orhayseriesnet.ddns.net/Coming_Home/ComingHomeWS.asmx/UpdateDeviceDetails", {
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
              var newDevice =
              {
                DeviceId: deviceId,
                DeviceName: newDeviceName == 'null' ? this.state.device.DeviceName : newDeviceName,
                DeviceTypeName: newDeviceTypeName,
                HomeId: homeId,
                IsDividedIntoRooms: newDivideStatus == 'null' ? this.state.device.IsDividedIntoRooms : newDivideStatus,
                RoomId: this.state.room.RoomId,
                IsOn: this.state.device.IsOn,
                HasPermission: this.state.device.HasPermission
              }

              AsyncStorage.getItem('devicesStr').then((value) => {
                devices = JSON.parse(value);
                var deviceList = new Array();
                var allUserDevicesList = new Array();
                var devicesResultMessage = devices.resultMessage;

                if (devices.deviceList != null) {
                  deviceList = devices.deviceList;
                  devicesResultMessage = devices.resultMessage;
                }
                else {
                  devicesResultMessage = 'Data';
                }

                if (this.state.allUserDevicesList != null)
                {
                  allUserDevicesList = this.state.allUserDevicesList;
                }

                var filteredDeviceList = deviceList.filter((d) => (d.DeviceId === deviceId));
                var numOfOccurrences = filteredDeviceList.length;

                var deviceFirstIndex = deviceList.findIndex((d) => (d.DeviceId === deviceId));
                var deviceFirstIndexA = allUserDevicesList.findIndex((de) => (de.DeviceId === deviceId));

                for (var i = deviceFirstIndex; i <= deviceFirstIndex + numOfOccurrences - 1; i++)
                {
                  deviceList[i].DeviceName = newDevice.DeviceName;
                  deviceList[i].DeviceTypeName = newDevice.DeviceTypeName;
                  deviceList[i].IsDividedIntoRooms = newDevice.IsDividedIntoRooms;
                }

                for (var j = deviceFirstIndexA; j <= deviceFirstIndexA + numOfOccurrences - 1; j++)
                {
                  allUserDevicesList[j].DeviceName = newDevice.DeviceName;
                  allUserDevicesList[j].DeviceTypeName = newDevice.DeviceTypeName;
                  allUserDevicesList[j].IsDividedIntoRooms = newDevice.IsDividedIntoRooms;
                }

                var devicesNew = {
                  deviceList,
                  resultMessage: devicesResultMessage,
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

                let deviceStr = JSON.stringify(newDevice);
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

  pickDeviceType = () => {
    return (
      <Picker
        style={styles.pickerStyle}
        selectedValue={this.state.newDeviceTypeCode}
        onValueChange={(itemValue) => this.setState({ newDeviceTypeCode: itemValue })}>
        {
          this.state.deviceTypes.map((deviceType) => {
            return (
              <Picker.Item key={deviceType["DeviceTypeCode"]} label={deviceType["DeviceTypeName"]} value={deviceType["DeviceTypeCode"]} />
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
          <View style={styles.textViewStyle}>
            <Text style={styles.textStyle}>Device Name</Text>
          </View>
          <View style={styles.textInputViewStyle}>
            <TextInput style={styles.textInputStyle} value={this.state.newDeviceName} placeholder={this.state.device.DeviceName} onChangeText={(newDeviceName) => this.setState({ newDeviceName: newDeviceName })}></TextInput>
          </View>
          <View style={styles.textViewStyle}>
            <Text style={styles.textStyle}>Device Type</Text>
          </View>
          {this.pickDeviceType()}
          <View style={styles.switchViewStyle}>
            <Text style={styles.textStyle}>Is Divided Into Rooms?(true/false)</Text>
            <Switch value={this.state.newDivideStatus} onValueChange={(newDivideStatus) => { this.setState({ newDivideStatus }) }} />
          </View>
          <View style={styles.submitButtonViewStyle}>
            <Button primary text="Update" onPress={this.updateDeviceDetails} />
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
