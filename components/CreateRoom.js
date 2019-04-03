import React from 'react';
import { StyleSheet, Text, View, TextInput, AsyncStorage, ScrollView, Picker, Switch } from 'react-native';
import { Button, ThemeProvider, Card } from 'react-native-material-ui';

export default class CreateRoom extends React.Component {
  static navigationOptions = {
    title: 'New Room'
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
      roomName: '',
      roomTypeName: '',
      isShared: false,
      roomTypes: []
    }
  }

  componentDidMount = () => {
    AsyncStorage.getItem('homeStr').then((value) => {
      home = JSON.parse(value);

      AsyncStorage.getItem('detailsStr').then((value) => {
        details = JSON.parse(value);

        AsyncStorage.getItem('roomTypesStr').then((value) => {
          roomTypes = JSON.parse(value);
          this.setState({
            appUser: details.appUser,
            userList: details.userList,
            homeList: details.homeList,
            allUserRoomsList: details.allUserRoomsList,
            allUserDevicesList: details.allUserDevicesList,
            allUserActivationConditionsList: details.allUserActivationConditionsList,
            resultMessage: details.resultMessage,
            home: home,
            roomTypes: roomTypes
          });
        });
      });
    });
  }

  createRoom = () => {
    const userId = this.state.appUser['UserId'];
    const homeId = this.state.home['HomeId'];
    const { roomName, roomTypeName, isShared } = this.state;

    if (roomName == '' || roomTypeName == '') {
      alert("Both a name and a room type are required to create a room, and the words 'true' or 'false' to determine if it is shared between users.");
      return;
    }

    var request = {
      roomName,
      homeId,
      roomTypeName,
      isShared,
      userId
    }

    fetch("http://orhayseriesnet.ddns.net/Coming_Home/ComingHomeWS.asmx/CreateRoom", {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json;'
      }),
      body: JSON.stringify(request)
    })
      .then(res => res.json()) // קובע שהתשובה מהשרת תהיה בפורמט JSON
      .then((result) => { // no error in server
        const roomId = JSON.parse(result.d);

        switch (roomId) {
          case -1:
            {
              alert("There is already a room with that name in this home. Use a different room name.");
              return;
            }
          default:
            {
              var room =
              {
                RoomId: roomId,
                RoomName: roomName,
                RoomTypeName: roomTypeName,
                HomeId: homeId,
                IsShared: isShared,
                HasAccess: true
              }

              AsyncStorage.getItem('roomsStr').then((value) => {
                rooms = JSON.parse(value);
                var roomList = [];
                var resultMessage = rooms.resultMessage;

                if (rooms.roomList != null) {
                  roomList = rooms.roomList;
                  resultMessage = rooms.resultMessage;
                }
                else {
                  resultMessage = 'Data';
                }

                roomList.push(room);

                var roomsNew = {
                  roomList,
                  resultMessage,
                }

                var allUserRoomsList = [];

                if (this.state.allUserRoomsList != null) {
                  allUserRoomsList = this.state.allUserRoomsList;
                }

                allUserRoomsList.push(room);

                var detailsNew = {
                  appUser: this.state.appUser,
                  userList: this.state.userList,
                  homeList: this.state.homeList,
                  allUserRoomsList: allUserRoomsList,
                  allUserDevicesList: this.state.allUserDevicesList,
                  allUserActivationConditionsList: this.state.allUserActivationConditionsList,
                  resultMessage: this.state.resultMessage
                }

                let roomStr = JSON.stringify(room);
                let roomsStr = JSON.stringify(roomsNew);
                let detailsNewStr = JSON.stringify(detailsNew);

                AsyncStorage.setItem('roomStr', roomStr).then(() => {
                  AsyncStorage.setItem('roomsStr', roomsStr).then(() => {
                    AsyncStorage.setItem('detailsStr', detailsNewStr).then(() => {
                      this.props.navigation.navigate("Room");
                    });
                  });
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

  pickRoomType = () => {
    return (
      <Picker
        style={styles.pickerStyle}
        selectedValue={this.state.roomTypeName}
        onValueChange={(itemValue) => this.setState({ roomTypeName: itemValue })}>
        {
          this.state.roomTypes.map((roomType) => {
            return (
              <Picker.Item key={roomType["RoomTypeCode"]} label={roomType["RoomTypeName"]} value={roomType["RoomTypeName"]} />
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
            <Text style={styles.textStyle}>Room Name</Text>
          </View>
          <View style={styles.textInputViewStyle}>
            <TextInput style={styles.textInputStyle} value={this.state.roomName} placeholder="Room Name" onChangeText={(roomName) => this.setState({ roomName })}></TextInput>
          </View>
          <View style={styles.textViewStyle}>
            <Text style={styles.textStyle}>Room Type Name</Text>
          </View>
          {this.pickRoomType()}
          <View style={styles.switchViewStyle}>
            <Text style={styles.textStyle}>Is Shared?(true/false)</Text>
            <Switch value={this.state.isShared} onValueChange={(isShared) => { this.setState({ isShared }) }} />
          </View>
          <View style={styles.submitButtonViewStyle}>
            <Button primary text="Create" onPress={this.createRoom} />
          </View>
          <View style={styles.cancelButtonViewStyle}>
            <Button primary text="Cancel" onPress={() => { this.props.navigation.navigate("Rooms") }} />
          </View>
        </View>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'peachpuff',
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
    backgroundColor:'yellow',
    borderColor:'gold',
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
