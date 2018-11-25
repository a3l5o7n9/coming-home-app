import React from 'react';
import { StyleSheet, Text, View, TextInput, AsyncStorage, ScrollView, Picker, Switch } from 'react-native';
import { Button, ThemeProvider, Card } from 'react-native-material-ui';

export default class UpdateRoom extends React.Component {
  static navigationOptions = {
    title: 'Update Room'
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
      newRoomName: '',
      newRoomTypeCode: '',
      newRoomTypeName: '',
      newShareStatus: false,
      roomTypes: [],
      room: {},
    }
  }

  componentDidMount = () => {
    AsyncStorage.getItem('homeStr').then((value) => {
      home = JSON.parse(value);

      AsyncStorage.getItem('detailsStr').then((value) => {
        details = JSON.parse(value);

        AsyncStorage.getItem('roomTypesStr').then((value) => {
          roomTypes = JSON.parse(value);

          AsyncStorage.getItem('roomStr').then((value) => {
            room = JSON.parse(value);

            this.setState(
              {
                appUser: details.appUser,
                userList: details.userList,
                homeList: details.homeList,
                allUserRoomsList: details.allUserRoomsList,
                allUserDevicesList: details.allUserDevicesList,
                allUserActivationConditionsList: details.allUserActivationConditionsList,
                resultMessage: details.resultMessage,
                home: home,
                roomTypes: roomTypes,
                room: room
              });
          });
        });
      });
    });
  }

  updateRoomDetails = () => {
    const appUserId = this.state.appUser['UserId'];
    const homeId = this.state.home['HomeId'];
    const roomId = this.state.room['RoomId'];
    var { newRoomName, newRoomTypeCode, newRoomTypeName, newShareStatus } = this.state;

    if (newRoomName == '' || newRoomName == null) {
      newRoomName = 'null';
    }

    if (newRoomTypeCode == '' || newRoomTypeCode == null) {
      newRoomTypeCode = 'null';
      newRoomTypeName = this.state.room.RoomTypeName;
    }
    else {
      var typeIndex = this.state.roomTypes.findIndex((rt) => rt.RoomTypeCode == newRoomTypeCode);
      newRoomTypeName = this.state.roomTypes[typeIndex].RoomTypeName;
    }

    if (newShareStatus == '' || newShareStatus == null) {
      newShareStatus = 'null';
    }

    var request = {
      appUserId,
      homeId,
      roomId,
      newRoomName,
      newRoomTypeCode,
      newShareStatus
    }

    fetch("http://ruppinmobile.tempdomain.co.il/SITE14/ComingHomeWS.asmx/UpdateRoomDetails", {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json;'
      }),
      body: JSON.stringify(request)
    })
      .then(res => res.json()) // קובע שהתשובה מהשרת תהיה בפורמט JSON
      .then((result) => { // no error in server
        const resultMessage = JSON.parse(result.d);

        switch (resultMessage) {
          case 'Update Completed':
            {
              var newRoom =
              {
                RoomId: roomId,
                RoomName: newRoomName == 'null' ? this.state.room.RoomName : newRoomName,
                RoomTypeName: newRoomTypeName,
                HomeId: homeId,
                IsShared: newShareStatus == 'null' ? this.state.room.IsShared : newShareStatus,
                HasAccess: this.state.room.HasAccess
              }

              AsyncStorage.getItem('roomsStr').then((value) => {
                rooms = JSON.parse(value);
                var roomList = [];
                var allUserRoomsList = [];
                var roomsResultMessage = rooms.resultMessage;

                if (rooms.roomList != null) {
                  roomList = rooms.roomList;
                  roomsResultMessage = rooms.resultMessage;
                }
                else {
                  roomsResultMessage = 'Data';
                }

                if (this.state.allUserRoomsList != null) {
                  allUserRoomsList = this.state.allUserRoomsList;
                }

                var index = roomList.findIndex((r) => r.RoomId == this.state.room.RoomId);
                var indexA = allUserRoomsList.findIndex((ro) => ro.RoomId === this.state.room.RoomId);
                roomList[index].RoomName = newRoom.RoomName;
                allUserRoomsList[indexA].RoomName = newRoom.RoomName;
                roomList[index].RoomTypeName = newRoom.RoomTypeName;
                allUserRoomsList[indexA].RoomTypeName = newRoom.RoomTypeName;
                roomList[index].HomeId = newRoom.HomeId;
                allUserRoomsList[indexA].HomeId = newRoom.HomeId;
                roomList[index].IsShared = newRoom.IsShared;
                allUserRoomsList[indexA].IsShared = newRoom.IsShared;

                var roomsNew = {
                  roomList,
                  resultMessage: roomsResultMessage,
                }

                var detailsNew = {
                  appUser: this.state.appUser,
                  userList: this.state.userList,
                  homeList: this.state.homeList,
                  allUserRoomsList: allUserRoomsList,
                  allUserDevicesList: this.state.allUserDevicesList,
                  allUserActivationConditionsList: this.state.allUserActivationConditionsList,
                  resultMessage: this.state.resultMessage
                }

                let roomStr = JSON.stringify(newRoom);
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
          default:
            {
              alert(resultMessage);
              return;
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
        selectedValue={this.state.newRoomTypeCode}
        onValueChange={(itemValue) => this.setState({ newRoomTypeCode: itemValue })}>
        {
          this.state.roomTypes.map((roomType) => {
            return (
              <Picker.Item key={roomType["RoomTypeCode"]} label={roomType["RoomTypeName"]} value={roomType["RoomTypeCode"]} />
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
            <TextInput style={styles.textInputStyle} value={this.state.newRoomName} placeholder={this.state.room.RoomName} onChangeText={(newRoomName) => this.setState({ newRoomName })}></TextInput>
          </View>
          <View style={styles.textViewStyle}>
            <Text style={styles.textStyle}>Room Type</Text>
          </View>
          {this.pickRoomType()}
          <View style={styles.switchViewStyle}>
            <Text style={styles.textStyle}>Is Shared?(true/false)</Text>
            <Switch value={this.state.newShareStatus} onValueChange={(newShareStatus) => { this.setState({ newShareStatus }) }} />
          </View>
          <View style={styles.submitButtonViewStyle}>
            <Button primary text="Update" onPress={this.updateRoomDetails} />
          </View>
          <View style={styles.cancelButtonViewStyle}>
            <Button primary text="Cancel" onPress={() => { this.props.navigation.goBack() }} />
          </View>
        </View>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'salmon',
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
    backgroundColor:'lightgrey',
    borderColor:'silver',
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
