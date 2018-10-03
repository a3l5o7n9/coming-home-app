import React from 'react';
import { StyleSheet, Text, View, Alert, TextInput, AsyncStorage, ScrollView } from 'react-native';
import { Button, ThemeProvider, Card } from 'react-native-material-ui';

export default class Room extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user: {},
      home: {},
      room: {
        RoomId: '',
        RoomName: '',
        RoomTypeName: ''
      }
    }
  }

  componentDidMount = () => {
    AsyncStorage.getItem('homeStr').then((value) => {
      home = JSON.parse(value);

      AsyncStorage.getItem('detailsStr').then((value) => {
        details = JSON.parse(value);

        AsyncStorage.getItem('roomStr').then((value) => {
          room = JSON.parse(value);

          this.setState({
            appUser: details.user,
            home: home,
            room: room
          });
        });
      });
    });
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
        var {device} = {
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
          <Text style={{ fontSize: 30 }}>Room</Text>
          <Text style={{ fontSize: 25 }}>{this.state.room["RoomName"]}</Text>
          <Button primary text="Add New Device" onPress={this.goToCreateDevice}/>
          <Button primary text="Add New Condition" onPress={this.goToCreateActivationCondition} />
          <Button primary text="Back to Room List" onPress={() => { this.props.navigation.navigate("Rooms") }} />
          <Button primary text="Add New Room" onPress={() => { this.props.navigation.navigate("CreateRoom") }} />
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
