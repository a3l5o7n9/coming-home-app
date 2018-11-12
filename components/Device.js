import React from 'react';
import { StyleSheet, Text, View, AsyncStorage, ScrollView, Switch } from 'react-native';
import { Button, ThemeProvider, Card } from 'react-native-material-ui';
import ConditionDetails from './ConditionDetails';

export default class Device extends React.Component {
  static navigationOptions = {
    title: 'Device'
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
      userList: [],
      homeList: [],
      allUserRoomsList: [],
      allUserDevicesList: [],
      allUserActivationConditionsList: [],
      resultMessage: '',
      activationConditionList: [],
    }
  }

  componentDidMount = () => {
    AsyncStorage.getItem('homeStr').then((value) => {
      home = JSON.parse(value);

      AsyncStorage.getItem('detailsStr').then((value) => {
        details = JSON.parse(value);

        AsyncStorage.getItem('deviceStr').then((value) => {
          device = JSON.parse(value);

          AsyncStorage.getItem('roomStr').then((value) => {
            room = JSON.parse(value);

            AsyncStorage.getItem('activationConditionsStr').then((value) => {
              activationConditions = JSON.parse(value)

              this.setState({
                appUser: details.appUser,
                home: home,
                device: device,
                room: room,
                userList: details.userList,
                homeList: details.homeList,
                allUserRoomsList: details.allUserRoomsList,
                allUserDevicesList: details.allUserDevicesList,
                allUserActivationConditionsList: details.allUserActivationConditionsList,
                resultMessage: details.resultMessage,
                activationConditionList: activationConditions.activationConditionList
              });
            });
          });
        });
      });
    });
  }

  showActivationConditions = () => {
    if (this.state.activationConditionList != null) {
      var filteredConditionList = this.state.activationConditionList.filter((actCon) => (actCon.DeviceId === this.state.device.DeviceId && actCon.RoomId === this.state.device.RoomId));

      if (filteredConditionList != null) {
        return (
          <View style={styles.container}>
            <View style={styles.textViewStyle}>
              <Text style={styles.textStyle}>Your Activation Conditions For This Device</Text>
            </View>
            {
              filteredConditionList.map((activationCondition, ConditionId) => {
                var { device } = this.state;
                var { room } = this.state;
                var { appUser } = this.state;
                var { home } = this.state;

                return (
                  <View key={ConditionId} style={{ flex: 1, alignItems: 'center' }}>
                    <ConditionDetails appUser={appUser} home={home} device={device} room={room} activationCondition={activationCondition} navigation={this.props.navigation} activationConditionList={this.state.activationConditionList}/>
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
              <Text style={styles.textStyle}>There are no activation conditions for this device that you have access to</Text>
            }
          </View>
        );
      }
    }
    else {
      return (
        <View style={styles.textViewStyle}>
          {
            <Text style={styles.textStyle}>There are no activation conditions for this device that you have access to</Text>
          }
        </View>
      );
    }
  }

  changeDeviceStatus = () => {
    var userId = this.state.appUser["UserId"];
    var { device } = this.state;
    var deviceId = this.state.device["DeviceId"];
    var roomId = this.state.device["RoomId"];
    var turnOn;

    if (this.state.device["IsOn"]) {
      turnOn = 'false';
    }
    else if (!this.state.device["IsOn"]) {
      turnOn = 'true';
    }

    var request = {
      userId,
      deviceId,
      roomId,
      turnOn,
      activationMethodCode: '1',
      statusDetails: 'null',
      conditionId: 'null'
    }

    fetch("http://ruppinmobile.tempdomain.co.il/SITE14/ComingHomeWS.asmx/ChangeDeviceStatus", {
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
              alert("You do not have permission to change this device's status right now.");
              break;
            }
          case -1:
            {
              alert("Data Error!");
              break;
            }
          case 0:
            {
              alert("Action aborted, as it does not actually change the device's current status.");
              break;
            }
          default:
            {
              device.IsOn = !(device.IsOn);

              var deviceStr = JSON.stringify(device);

              AsyncStorage.setItem('deviceStr', deviceStr).then(() => {
                AsyncStorage.getItem('devicesStr').then((value) => {
                  devices = JSON.parse(value);
                  var deviceList = [];
                  deviceList = devices.deviceList;
                  var index = deviceList.findIndex((d) => d.DeviceId == this.state.device.DeviceId && d.RoomId == this.state.device.RoomId);
                  deviceList[index].IsOn = this.state.device.IsOn;
                  var devices = {
                    deviceList,
                    resultMessage : 'Data'
                  }
                 var devicesStr = JSON.stringify(devices);

                  AsyncStorage.setItem('devicesStr', devicesStr).then(() => {
                   var allUserDevicesList = [];
                   allUserDevicesList = this.state.allUserDevicesList;
                   var indexA = allUserDevicesList.findIndex((de) => (de.DeviceId == this.state.device.DeviceId && de.RoomId == this.state.device.RoomId));
                   allUserDevicesList[indexA].IsOn = this.state.device.IsOn;

                   var detailsNew = {
                     appUser: this.state.appUser,
                     userList: this.state.userList,
                     homeList: this.state.homeList,
                     allUserRoomsList: this.state.allUserRoomsList,
                     allUserDevicesList: allUserDevicesList,
                     allUserActivationConditionsList: this.state.allUserActivationConditionsList,
                     resultMessage: this.state.resultMessage
                   }

                   var detailsNewStr = JSON.stringify(detailsNew);

                   AsyncStorage.setItem('detailsStr', detailsNewStr).then(() => {
                    this.setState({ device, allUserDevicesList });
                    alert("Device status changed!");
                   });
                  }); 
                });
              });
              break;
            }
        }
      })
      .catch((error) => {
        alert("A connection Error has occurred.");
      });
  }

  goToCreateActivationCondition = () => {
    fetch("http://ruppinmobile.tempdomain.co.il/SITE14/ComingHomeWS.asmx/GetActivationMethods", {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json;'
      }),
      body: null
    })
      .then(res => res.json()) // קובע שהתשובה מהשרת תהיה בפורמט JSON
      .then((result) => { // no error in server
        let activationMethods = JSON.parse(result.d);
        var { room } = this.state;
        var { device } = this.state;

        var activationMethodsStr = JSON.stringify(activationMethods);
        var roomStr = JSON.stringify(room);
        var deviceStr = JSON.stringify(device);

        AsyncStorage.setItem('activationMethodsStr', activationMethodsStr).then(() => {
          AsyncStorage.setItem('roomStr', roomStr).then(() => {
            AsyncStorage.setItem('deviceStr', deviceStr).then(() => {
              this.props.navigation.navigate("CreateActivationCondition");
            })
          })
        })
      })
      .catch((error) => {
        alert("A connection Error has occurred.");
      });
  }

  goToBindDeviceToRoom = () =>
  {
    var room = {
      RoomId: '',
      RoomName: '',
      RoomTypeName: '',
    }

    var roomStr = JSON.stringify(room);

    AsyncStorage.setItem('roomStr', roomStr).then(() => {
      this.props.navigation.navigate('BindDeviceToRoom');
    });
  }

  render() {
    return (
      <ScrollView>
        <View style={styles.container}>
          <View style={{flex: 2, flexDirection:'row', justifyContent:'space-between'}}>
            <View style={{margin:5, flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start' }}>
              <Text style={{flex: 1, fontSize: 25 }}>{this.state.device["DeviceName"]}</Text>
              <Text style={{flex: 1, fontSize: 10 }}>{this.state.room["RoomName"]}</Text>
            </View>
            <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: "flex-end" }}>
              <Switch value={this.state.device["IsOn"]} onValueChange={this.changeDeviceStatus} />
            </View>
          </View>
          <View style={{ flex: 8 }}>
            {this.showActivationConditions()}
          </View>
          <View>
            <View style={styles.bindButtonStyle}>
              <Button primary text="Bind This Device To Another Room" onPress={this.goToBindDeviceToRoom}/>
            </View>
            <View style={styles.createButtonStyle}>
              <Button primary text="Add New Condition" onPress={this.goToCreateActivationCondition} />
            </View>
            <View style={styles.updateButtonStyle}>
              <Button primary text="Update Device Details" onPress={() => {this.props.navigation.navigate("UpdateDevice")}}/>
            </View>
            <View style={styles.listButtonStyle}>
              <Button primary text="Devices" onPress={() => {this.props.navigation.navigate("Devices")}}/>
            </View>
            <View style={styles.homeButtonStyle}>
              <Button primary text="Home" onPress={() => {this.props.navigation.navigate("Home")}}/>
            </View>
          </View>
        </View>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    width:'100%',
    backgroundColor: 'skyblue',
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
  },
  textViewStyle: {
    margin:5,
  },
  updateButtonStyle: {
    margin:5,
    backgroundColor:'lightgrey',
    borderColor:'silver',
    borderRadius:50,
    borderWidth:1
  },
  createButtonStyle: {
    margin:5,
    backgroundColor:'yellow',
    borderColor:'gold',
    borderRadius:50,
    borderWidth:1
  },
  bindButtonStyle: {
    margin:5,
    backgroundColor:'sandybrown',
    borderColor:'brown',
    borderRadius:50,
    borderWidth:1
  },
  homeButtonStyle: {
    margin:5,
    backgroundColor:'lightblue',
    borderColor:'blue',
    borderRadius:50,
    borderWidth:1
  },
  listButtonStyle: {
    margin:5,
    backgroundColor:'blue',
    borderColor:'skyblue',
    borderRadius:50,
    borderWidth:1
  },
});
