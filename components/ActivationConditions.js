import React from 'react';
import { StyleSheet, Text, View, Alert, TextInput, AsyncStorage, ScrollView } from 'react-native';
import { Button, ThemeProvider, Card } from 'react-native-material-ui';
import ConditionDetails from './ConditionDetails';

export default class ActivationConditions extends React.Component {
  static navigationOptions = {
    title: 'Activation Conditions'
  }

  constructor(props) {
    super(props);

    this.state = {
      user: {},
      home: {},
      deviceList: [],
      roomList: [],
      activationConditionList: []
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

                this.setState({
                  user: details.user,
                  home: home,
                  deviceList: devices.deviceList,
                  roomList: rooms.roomList,
                  userList: users.userList,
                  activationConditionList: activationConditions.activationConditionList
                });
              });
            });
          });
        });
      });
    });
  }

  showActivationConditions = () => {
    if (this.state.activationConditionList != null) {
      return (
        <View style={styles.container}>
          <Text style={styles.textStyle}>Your Activation Conditions</Text>
          {
            this.state.activationConditionList.map((activationCondition, ConditionId) => {
              let device = this.state.deviceList.find((d) => d.DeviceId === activationCondition.DeviceId);
              let room = this.state.roomList.find((r) => r.RoomId === activationCondition.RoomId);
              let { user } = this.state;
              let { home } = this.state;

              return (
                <View key={ConditionId} style={{ flex: 1, alignItems: 'center' }}>
                  <ConditionDetails user={user} home={home} device={device} room={room} activationCondition={activationCondition} navigation={this.props.navigation} activationConditionList={this.state.activationConditionList} backName={'ActivationConditions'}/>
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
            <Text style={styles.textStyle}>There are no activation conditions in your home that you have access to</Text>
          }
        </View>
      );
    }
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
        
        var room = {
          RoomId : '',
          RoomName : '',
          RoomTypeName : ''
        }

        var device = {
          DeviceId : '',
          DeviceName : '',
          DeviceTypeName : ''
        }

        let activationMethodsStr = JSON.stringify(activationMethods);

        AsyncStorage.setItem('activationMethodsStr', activationMethodsStr).then(() => {
          let roomStr = JSON.stringify(room);

          AsyncStorage.setItem('roomStr', roomStr).then(() => {
            let deviceStr = JSON.stringify(device);

            AsyncStorage.setItem('deviceStr', deviceStr).then(() => {
              this.props.navigation.navigate("CreateActivationCondition", back={name:'ActivationConditions'});
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
          <View style={{ flex: 8 }}>
            {this.showActivationConditions()}
          </View>
          <View style={{ flex: 2 }}>
            <Button primary text="Add New Condition" onPress={this.goToCreateActivationCondition} />
            <Button primary text="Home" onPress={() => { this.props.navigation.navigate("Home") }} />
          </View>
        </View>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    justifyContent: 'space-between',
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