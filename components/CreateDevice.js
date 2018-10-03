import React from 'react';
import { StyleSheet, Text, View, Alert, TextInput, AsyncStorage, ScrollView, Picker, Switch } from 'react-native';
import { Button, ThemeProvider, Card } from 'react-native-material-ui';

export default class CreateDevice extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user: {},
      home: {},
      room: {
        RoomId : '',
        RoomName : '',
        RoomTypeName : ''
      },
      roomList: [],
      deviceName: '',
      deviceTypeName: '',
      isDividedIntoRooms: false,
      deviceTypes: []
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

            this.setState({
              user: details.user,
              home: home,
              deviceTypes: deviceTypes,
              roomList: rooms.roomList
            });

            console.log(this.state);
          });
        });
      });
    });
  }

  createDevice = () => {
    const userId = this.state.user['UserId'];
    const homeId = this.state.home['HomeId'];
    const roomId = this.state.room['RoomId'];
    const { deviceName, deviceTypeName, isDividedIntoRooms } = this.state;

    if (deviceName == '' || deviceTypeName == '' || roomId == '') {
      alert("Creating a device requires a device name, a device type name, and an indication if it is divided into rooms.");
      return;
    }

    var request = {
      deviceName,
      homeId,
      deviceTypeName,
      isDividedIntoRooms,
      userId,
      roomId
    }

    fetch("http://ruppinmobile.tempdomain.co.il/SITE14/ComingHomeWS.asmx/CreateDevice", {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json;'
      }),
      body: JSON.stringify(request)
    })
      .then(res => res.json()) // קובע שהתשובה מהשרת תהיה בפורמט JSON
      .then((result) => { // no error in server
        const deviceId = JSON.parse(result.d);

        switch (deviceId) {
          case -1:
            {
              alert("There is already a device with that name in this home. Use a different device name.");
              break;
            }
          default:
            {
              var device =
              {
                DeviceId: deviceId,
                DeviceName: deviceName,
                DeviceTypeName: deviceTypeName,
                HomeId: homeId,
                IsDividedIntoRooms: isDividedIntoRooms,
                RoomId: roomId
              }

              let deviceStr = JSON.stringify(device);

              AsyncStorage.setItem('deviceStr', deviceStr).then(() => {
                // console.log("deviceStr");
                // AsyncStorage.getItem('deviceStr').then((value) => {
                //   console.log('deviceStr = ' + value);
                // });
                var { room } = this.state;

                let roomStr = JSON.stringify(room);

                AsyncStorage.setItem('roomStr', roomStr).then(() => {
                  this.props.navigation.navigate("Device");
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

  pickDeviceType = () => {
    return (
      <Picker
        style={{ width: '80%', borderColor: 'green', borderWidth: 2 }}
        selectedValue={this.state.deviceTypeName}
        onValueChange={(itemValue) => this.setState({ deviceTypeName: itemValue })}>
        {
          this.state.deviceTypes.map((deviceType) => {
            return (
              <Picker.Item key={deviceType["DeviceTypeCode"]} label={deviceType["DeviceTypeName"]} value={deviceType["DeviceTypeName"]} />
            )
          })
        }
      </Picker>
    );
  }

  pickRoom = () => {
    return (
      <Picker
        style={{ width: '80%', borderColor: 'green', borderWidth: 2 }}
        selectedValue={this.state.room.RoomId}
        onValueChange={(itemValue) => 
          {
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
          <Text style={{ fontSize: 30 }}>Create Device</Text>
          <Text style={styles.textStyle}>Device Name</Text>
          <TextInput style={styles.textInputStyle} value={this.state.deviceName} placeholder="Device Name" onChangeText={(deviceName) => this.setState({ deviceName })}></TextInput>
          <Text style={styles.textStyle}>Device Type Name</Text>
          {this.pickDeviceType()}
          <View style={{flex:1, flexDirection:'row', justifyContent:'space-between'}}>
            <Text style={styles.textStyle}>Is Divided Into Rooms?(true/false)</Text>
            <Switch value={this.state.isDividedIntoRooms} onValueChange={(isDividedIntoRooms) => {this.setState({isDividedIntoRooms})}} />
          </View>
          <Text style={styles.textStyle}>Room</Text>
          {this.pickRoom()}
          <Button primary text="Create" onPress={this.createDevice} />
          <Button primary text="Cancel" onPress={() => { this.props.navigation.navigate("Devices") }} />
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
