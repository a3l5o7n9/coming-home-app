import React from 'react';
import { StyleSheet, Text, View, AsyncStorage, Switch } from 'react-native';
import { Button, ThemeProvider, Card } from 'react-native-material-ui';

export default class DeviceDetails extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user: this.props.user,
      home: this.props.home,
      device: this.props.device,
      room: this.props.room,
      navigation: this.props.navigation,
      deviceList: this.props.deviceList,
    }
  }

  changeDeviceStatus = () => {
    var userId = this.state.user["UserId"];
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
                var deviceList = this.state.deviceList;
                var index = deviceList.findIndex((d) => d.DeviceId == this.state.device.DeviceId);
                deviceList[index].IsOn = this.state.device.IsOn;
                var devices = {
                  deviceList,
                  resultMessage : 'Data'
                }
                var devicesStr = JSON.stringify(devices);

                AsyncStorage.setItem('devicesStr', devicesStr).then(() => {
                  this.setState({ device, deviceList });
                  alert("Device status changed!");
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

  render() {
    return (
      <View style={styles.container}>
        <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start' }}>
          <Button primary text={this.state.device["DeviceName"] + "\n" + this.state.device["DeviceTypeName"]} onPress={() => {
            var deviceStr = JSON.stringify(this.state.device);
            AsyncStorage.setItem('deviceStr', deviceStr).then(() => {
              var roomStr = JSON.stringify(this.state.room);
              AsyncStorage.setItem('roomStr', roomStr).then(() => {
                this.state.navigation.navigate("Device");
              });
            });
          }} />
          <Text style={{ fontSize: 10 }}>{this.state.room["RoomName"]}</Text>
        </View>
        <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: "flex-end" }}>
          <Switch value={this.state.device["IsOn"]} onValueChange={this.changeDeviceStatus} />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '60%',
  },
  textStyle: {
    fontSize: 20,
    alignItems: 'center',
  },
  textInputStyle: {
    fontSize: 25,
  }
});
