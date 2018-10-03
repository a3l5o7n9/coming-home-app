import React from 'react';
import { StyleSheet, Text, View, Alert, TextInput, AsyncStorage, ScrollView, Picker, Switch } from 'react-native';
import { Button, ThemeProvider, Card } from 'react-native-material-ui';

export default class CreateRoom extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user: {},
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
            user: details.user,
            home: home,
            roomTypes: roomTypes
          });
        });
      });
    });
  }

  createRoom = () => {
    const userId = this.state.user['UserId'];
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

    fetch("http://ruppinmobile.tempdomain.co.il/SITE14/ComingHomeWS.asmx/CreateRoom", {
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
                IsShared: isShared
              }

              let roomStr = JSON.stringify(room);

              AsyncStorage.setItem('roomStr', roomStr).then(() => {
                // console.log("roomStr");
                // AsyncStorage.getItem('roomStr').then((value) => {
                //   console.log('roomStr = ' + value);
                // });
                this.props.navigation.navigate("Room");
              });
              break;
            }
        }
      })
      .catch((error) => {
        alert('A connection error has occurred.');
      });
  }

  pickRoomType = () => 
  {
    return(
      <Picker  
        style={{  width: '80%', borderColor:'green', borderWidth: 2 }} 
        selectedValue={this.state.roomTypeName} 
        onValueChange={(itemValue) => this.setState({roomTypeName : itemValue})}>
        {
          this.state.roomTypes.map((roomType) => {
            return(
              <Picker.Item key={roomType["RoomTypeCode"]} label={roomType["RoomTypeName"]} value={roomType["RoomTypeName"]}/>
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
          <Text style={{ fontSize: 30 }}>Create Room</Text>
          <Text style={styles.textStyle}>Room Name</Text>
          <TextInput style={styles.textInputStyle} value={this.state.roomName} placeholder="Room Name" onChangeText={(roomName) => this.setState({ roomName })}></TextInput>
          <Text style={styles.textStyle}>Room Type Name</Text>
          {this.pickRoomType()}
          <View style={{flex:1, flexDirection:'row', justifyContent:'space-between'}}>
            <Text style={styles.textStyle}>Is Shared?(true/false)</Text>
            <Switch value={this.state.isShared} onValueChange={(isShared) => {this.setState({isShared})}} />
          </View>
          <Button primary text="Create" onPress={this.createRoom} />
          <Button primary text="Cancel" onPress={() => { this.props.navigation.navigate("Rooms") }} />
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
