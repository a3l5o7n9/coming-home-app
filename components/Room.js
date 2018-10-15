import React from 'react';
import { StyleSheet, Text, View, AsyncStorage, ScrollView } from 'react-native';
import { Button, ThemeProvider, Card } from 'react-native-material-ui';
import DeviceDetails from './DeviceDetails';

export default class Room extends React.Component {
  static navigationOptions = {
    title: 'Room'
  }

  constructor(props) {
    super(props);

    this.state = {
      user: {},
      home: {},
      room: {
        RoomId: '',
        RoomName: '',
        RoomTypeName: ''
      },
      deviceList: [],
      activationConditionList: []
    }
  }

  componentDidMount = () => {
    AsyncStorage.getItem('homeStr').then((value) => {
      home = JSON.parse(value);

      AsyncStorage.getItem('detailsStr').then((value) => {
        details = JSON.parse(value);

        AsyncStorage.getItem('roomStr').then((value) => {
          room = JSON.parse(value);

          AsyncStorage.getItem('devicesStr').then((value) => {
            devices = JSON.parse(value);

            AsyncStorage.getItem('activationConditionsStr').then((value) => {
              activationConditions = JSON.parse(value);

              this.setState({
                user: details.user,
                home: home,
                room: room,
                deviceList: devices.deviceList,
                activationConditionList: activationConditions.activationConditionList
              })
            })
          });
        });
      });
    });
  }

  showDevices = () => {
    if (this.state.deviceList != null) {
      var filteredDeviceList = this.state.deviceList.filter((d) => (d.RoomId === this.state.room.RoomId));

      if (filteredDeviceList != null) {
        return (
          <View style={styles.container}>
            <Text style={styles.textStyle}>Your Devices In This Room</Text>
            {
              filteredDeviceList.map((device, DeviceId) => {
                var { room } = this.state;
                var { user } = this.state;
                var { home } = this.state;

                return (
                  <View key={DeviceId} style={{ flex: 1, alignItems: 'center' }}>
                    <DeviceDetails user={user} home={home} device={device} room={room} navigation={this.props.navigation} deviceList={this.state.deviceList}/>
                  </View>
                )
              })
            }
          </View>
        );
      }
      else {
        return (
          <View>
            {
              <Text style={styles.textStyle}>There are no devices in this room that you have access to</Text>
            }
          </View>
        );
      }
    }
    else {
      return (
        <View>
          {
            <Text style={styles.textStyle}>There are no devices in this room that you have access to</Text>
          }
        </View>
      );
    }
  }

  goToCreateDevice = () =>
  {
    fetch("http://ruppinmobile.tempdomain.co.il/SITE14/ComingHomeWS.asmx/GetDeviceTypes", {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json;'
      }),
      body: null
    })
      .then(res => res.json()) // קובע שהתשובה מהשרת תהיה בפורמט JSON
      .then((result) => { // no error in server
        let deviceTypes = JSON.parse(result.d);
        var {room} = this.state;

        let deviceTypesStr = JSON.stringify(deviceTypes);

        AsyncStorage.setItem('deviceTypesStr', deviceTypesStr).then(() => {

          var roomStr = JSON.stringify(room);

          AsyncStorage.setItem('roomStr', roomStr).then(() => {
            this.props.navigation.navigate("CreateDevice")
          })
        })
      })
      .catch((error) => {
        alert("A connection Error has occurred.");
      });
  }

  goToBindDeviceToRoom = () =>
  {
    var device = {
      DeviceId: '',
      DeviceName: '',
      DeviceTypeName: '',
    }

    var deviceStr = JSON.stringify(device);

    AsyncStorage.setItem('deviceStr', deviceStr).then(() => {
      this.props.navigation.navigate("BindDeviceToRoom");
    })
  }

  goToCreateActivationCondition = () =>
  {
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
        var {room} = this.state;
        var device = {
          DeviceId : '',
          DeviceName : '',
          DeviceTypeName : ''
        }

        let activationMethodsStr = JSON.stringify(activationMethods);

        AsyncStorage.setItem('activationMethodsStr', activationMethodsStr).then(() => {

          var roomStr = JSON.stringify(room);

          AsyncStorage.setItem('roomStr', roomStr).then(() => {

            var deviceStr = JSON.stringify(device);

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


  render() {
    return (
      <ScrollView>
        <View style={styles.container}>
          <Text style={{flex: 1, fontSize: 25 }}>{this.state.room["RoomName"]}</Text>
          <View style={{ flex: 8 }}>
            {this.showDevices()}
          </View>
          <View style={{ flex: 4 }}>
            <Button primary text="Add New Device" onPress={this.goToCreateDevice}/>
            <Button primary text="Add Existing Device" onPress={this.goToBindDeviceToRoom}/>
            <Button primary text="Add New Condition" onPress={this.goToCreateActivationCondition} />
            <Button primary text="Update Room Details" onPress={() => {this.props.navigation.navigate('UpdateRoom')}}/>
            <Button primary text="Home" onPress={() => {this.props.navigation.navigate("Home")}}/>
          </View>
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
