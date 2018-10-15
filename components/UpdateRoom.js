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
      user: {},
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
              user: details.user,
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
    const appUserId = this.state.user['UserId'];
    const homeId = this.state.home['HomeId'];
    const roomId = this.state.room['RoomId'];
    const { newRoomName, newRoomTypeCode, newRoomTypeName, newShareStatus } = this.state;

    if (newRoomName == '' || newRoomName == null) 
    {
      newRoomName = 'null';
    }

    if (newRoomTypeCode == '' || newRoomTypeCode == null)
    {
      newRoomTypeCode = 'null';
      newRoomTypeName = this.state.room.RoomTypeName;
    }
    else
    {
      var typeIndex = this.state.roomTypes.findIndex((rt) => rt.RoomTypeCode == newRoomTypeCode);
      newRoomTypeName = this.state.roomTypes[typeIndex].RoomTypeName;
    }

    if (newShareStatus == '' || newShareStatus == null)
    {
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
              }

              AsyncStorage.getItem('roomsStr').then((value) => {
                rooms = JSON.parse(value);
                var roomList = [];

                if (rooms.roomList != null) {
                  roomList = rooms.roomList;
                  resultMessage = rooms.resultMessage;
                }
                else {
                  resultMessage = 'Data';
                }

                var index = roomList.findIndex((r) => r.RoomId == this.state.room.RoomId);
                roomList[index].RoomName = newRoom.RoomName;
                roomList[index].RoomTypeName = newRoom.RoomTypeName;
                roomList[index].HomeId = newRoom.HomeId;
                roomList[index].IsShared = newRoom.IsShared;

                var roomsNew = {
                  roomList,
                  resultMessage,
                }

                let roomStr = JSON.stringify(newRoom);
                let roomsStr = JSON.stringify(roomsNew);

                AsyncStorage.setItem('roomStr', roomStr).then(() => {
                  AsyncStorage.setItem('roomsStr', roomsStr).then(() => {
                    this.props.navigation.navigate("Room");
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
        style={{ width: '80%', borderColor: 'green', borderWidth: 2 }}
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
          <Text style={styles.textStyle}>Room Name</Text>
          <TextInput style={styles.textInputStyle} value={this.state.newRoomName} placeholder={this.state.room.RoomName} onChangeText={(newRoomName) => this.setState({ newRoomName })}></TextInput>
          <Text style={styles.textStyle}>Room Type</Text>
          {this.pickRoomType()}
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={styles.textStyle}>Is Shared?(true/false)</Text>
            <Switch value={this.state.newShareStatus} onValueChange={(newShareStatus) => { this.setState({ newShareStatus }) }} />
          </View>
          <Button primary text="Update" onPress={this.updateRoomDetails} />
          <Button primary text="Cancel" onPress={() => { this.props.navigation.goBack() }} />
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
