import React from 'react';
import { StyleSheet, Text, View, AsyncStorage, ScrollView } from 'react-native';
import { Button, ThemeProvider, Card } from 'react-native-material-ui';
import ConditionDetails from './ConditionDetails';

export default class ActivationConditions extends React.Component {
  static navigationOptions = {
    title: 'Activation Conditions'
  }

  constructor(props) {
    super(props);

    this.state = {
      appUser: {},
      home: {},
      deviceList: [],
      roomList: [],
      activationConditionList: [],
      userList: [],
      homeList: [],
      allUserRoomsList: [],
      allUserDevicesList: [],
      allUserActivationConditionsList: [],
      resultMessage: ''
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

              this.setState({
                appUser: details.appUser,
                home: home,
                deviceList: devices.deviceList,
                roomList: rooms.roomList,
                activationConditionList: activationConditions.activationConditionList,
                userList: details.userList,
                homeList: details.homeList,
                allUserRoomsList: details.allUserRoomsList,
                allUserDevicesList: details.allUserDevicesList,
                allUserActivationConditionsList: details.allUserActivationConditionsList,
                resultMessage: details.resultMessage
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
          <View style={styles.textViewStyle}>
            <Text style={styles.textStyle}>Your Activation Conditions</Text>
          </View>
          {
            this.state.activationConditionList.map((activationCondition, ConditionId) => {
              let device = this.state.deviceList.find((d) => d.DeviceId === activationCondition.DeviceId);
              let room = this.state.roomList.find((r) => r.RoomId === activationCondition.RoomId);
              let { appUser } = this.state;
              let { home } = this.state;

              return (
                <View key={ConditionId} style={{borderColor:'green', borderRadius:10, borderWidth:5, backgroundColor:'lawngreen', flex: 1, alignItems: 'center' }}>
                  <ConditionDetails appUser={appUser} home={home} device={device} room={room} activationCondition={activationCondition} navigation={this.props.navigation} activationConditionList={this.state.activationConditionList} userList={this.state.userList} homeList={this.state.homeList} allUserRoomsList={this.state.allUserRoomsList} allUserDevicesList={this.state.allUserDevicesList} allUserActivationConditionsList={this.state.allUserActivationConditionsList} resultMessage={this.state.resultMessage} />
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
            <Text style={styles.textStyle}>There are no activation conditions in your home that you have access to</Text>
          }
        </View>
      );
    }
  }

  goToCreateActivationCondition = () => {
    fetch("http://orhayseriesnet.ddns.net/Coming_Home/ComingHomeWS.asmx/GetActivationMethods", {
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
          RoomId: '',
          RoomName: '',
          RoomTypeName: '',
          HasAccess: false
        }

        var device = {
          DeviceId: '',
          DeviceName: '',
          DeviceTypeName: '',
          HasPermission: false
        }

        let activationMethodsStr = JSON.stringify(activationMethods);

        AsyncStorage.setItem('activationMethodsStr', activationMethodsStr).then(() => {
          let roomStr = JSON.stringify(room);

          AsyncStorage.setItem('roomStr', roomStr).then(() => {
            let deviceStr = JSON.stringify(device);

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
          <View style={{ flex: 8 }}>
            {this.showActivationConditions()}
          </View>
          <View style={{ flex: 2 }}>
            <View style={styles.createButtonStyle}>
              <Button primary text="Add New Condition" onPress={this.goToCreateActivationCondition} />
            </View>
            <View style={styles.homeButtonStyle}>
              <Button primary text="Home" onPress={() => { this.props.navigation.navigate("Home") }} />
            </View>
          </View>
        </View>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'green',
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
  },
  textViewStyle: {
    margin:5,
  },
  createButtonStyle: {
    margin:5,
    backgroundColor:'yellow',
    borderColor:'gold',
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
});