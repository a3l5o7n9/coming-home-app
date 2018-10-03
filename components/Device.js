import React from 'react';
import { StyleSheet, Text, View, Alert, TextInput, AsyncStorage, ScrollView } from 'react-native';
import { Button, ThemeProvider, Card } from 'react-native-material-ui';

export default class Device extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user: {},
      home: {},
      device: {
        DeviceId: '',
        DeviceName: '',
        DeviceTypeName: ''
      },
      room: {
        RoomId: '',
        RoomName: ''
      }
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

            this.setState({
              user: details.user,
              home: home,
              device: device,
              room: room
            });
          });
        });
      });
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
        var {device} = this.state;

        this.props.navigation.navigate("CreateActivationCondition", activationMethods={activationMethods}, room={room}, device={device});
      })
      .catch((error) => {
        alert("A connection Error has occurred.");
      });
  }

  render() {
    return (
      <ScrollView>
        <View style={styles.container}>
          <Text style={{ fontSize: 30 }}>Device</Text>
          <Text style={{ fontSize: 20 }}>{this.state.device["DeviceName"]}</Text>
          <Text style={{ fontSize: 10 }}>{this.state.room["RoomName"]}</Text>
          <Button primary text="Add New Condition" onPress={this.goToCreateActivationCondition} />
          <Button primary text="Back To Device List" onPress={() => { this.props.navigation.navigate("Devices") }} />
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
