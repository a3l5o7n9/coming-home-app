import React from 'react';
import { StyleSheet, Text, View, Alert, TextInput, AsyncStorage, ScrollView } from 'react-native';
import { Button, ThemeProvider, Card } from 'react-native-material-ui';

export default class Rooms extends React.Component {
  static navigationOptions = {
    title: 'Rooms'
  }

  constructor(props) {
    super(props);

    this.state = {
      user: {},
      home: {},
      roomList: [],
      deviceList: []
    }
  }

  componentDidMount = () => {
    AsyncStorage.getItem('homeStr').then((value) => {
      home = JSON.parse(value);

      AsyncStorage.getItem('detailsStr').then((value) => {
        details = JSON.parse(value);

        AsyncStorage.getItem('roomsStr').then((value) => {
          rooms = JSON.parse(value);

          AsyncStorage.getItem('devicesStr').then((value) => {
            devices = JSON.parse(value);

            AsyncStorage.getItem('usersStr').then((value) => {
              users = JSON.parse(value);

              this.setState({
                user: details.user,
                home: home,
                roomList: rooms.roomList,
                deviceList: devices.deviceList,
                userList: users.userList
              });
            });
          });
        });
      });
    });
  }

  showRooms = () => {
    if (this.state.roomList != null) {
      return (
        <View style={styles.container}>
          <Text style={styles.textStyle}>Your Rooms</Text>
          {
            this.state.roomList.map((room, RoomId) => (
              <Button primary key={RoomId} text={room["RoomName"] + "\n" + room["RoomTypeName"]} onPress={() => {
                let roomStr = JSON.stringify(room);
                AsyncStorage.setItem('roomStr', roomStr).then(() => {
                  this.props.navigation.navigate("Room");
                });
              }} />
            ))
          }
        </View>
      );
    }
    else {
      return (
        <View>
          {
            <Text style={styles.textStyle}>There are no rooms in your home that you have access to</Text>
          }
        </View>
      );
    }
  }

  goToCreateRoom = () =>
  {
    fetch("http://ruppinmobile.tempdomain.co.il/SITE14/ComingHomeWS.asmx/GetRoomTypes", {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json;'
      }),
      body: null
    })
      .then(res => res.json()) // קובע שהתשובה מהשרת תהיה בפורמט JSON
      .then((result) => { // no error in server
        let roomTypes = JSON.parse(result.d);

        let roomTypesStr = JSON.stringify(roomTypes);

        AsyncStorage.setItem('roomTypesStr', roomTypesStr).then(() => {
          this.props.navigation.navigate("CreateRoom");
        });
      })
      .catch((error) => {
        alert("A connection Error has occurred.");
      });
  }

  render() {
    return (
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.container}>
            {this.showRooms()}
          </View>
          <Button primary text="Add New Room" onPress={ this.goToCreateRoom } />
          <Button primary text="Home" onPress={() => { this.props.navigation.navigate("Home") }} />
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
