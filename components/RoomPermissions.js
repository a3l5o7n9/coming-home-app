import React from 'react';
import { StyleSheet, Text, View, AsyncStorage, ScrollView } from 'react-native';
import { Button } from 'react-native-material-ui';
import RoomPermissionDetails from './RoomPermissionDetails';

export default class RoomPermissions extends React.Component {
  static navigationOptions = {
    title: 'RoomPermissions'
  }

  constructor(props) {
    super(props);

    this.state = {
      appUser: {},
      home: {},
      roomList: [],
      user: {},
      roomPermissionList: []
    }
  }

  componentDidMount = () => {
    AsyncStorage.getItem('homeStr').then((value) => {
      home = JSON.parse(value);

      AsyncStorage.getItem('detailsStr').then((value) => {
        details = JSON.parse(value);

        AsyncStorage.getItem('userStr').then((value) => {
          user = JSON.parse(value);

          AsyncStorage.getItem('roomPermissionsStr').then((value) => {
            roomPermissions = JSON.parse(value);
            
            AsyncStorage.getItem('roomsStr').then((value) => {
              rooms = JSON.parse(value);

              this.setState({
                appUser: details.appUser,
                home: home,
                roomList: rooms.roomList,
                user: user,
                roomPermissionList: roomPermissions.roomPermissionList
              });
            });
          });
        });
      });
    });
  }

  showRoomPermissions = () => {
    if (this.state.roomList != null) {
      var roomList = new Array();
      roomList = this.state.roomList;
      var accessibleRoomList = roomList.filter((ro) => ro.HasAccess === true)

      if (accessibleRoomList != null) {
        return (
          <View style={styles.container}>
            <View style={styles.textViewStyle}>
              <Text style={styles.textStyle}>User Room Permissions</Text>
            </View>
            {
              accessibleRoomList.map((room, RoomId) => {
                let { appUser } = this.state;
                let { user } = this.state;
                let { home } = this.state;
                let { roomPermissionList } = this.state;
                let roomPermission = roomPermissionList.find((roPe) => roPe.RoomId === room.RoomId);

                return (
                  <View key={RoomId} style={{ borderColor: 'red', borderRadius: 10, borderWidth: 5, backgroundColor: 'powderblue', flex: 1, alignItems: 'center' }}>
                    <RoomPermissionDetails appUser={appUser} home={home} navigation={this.props.navigation} user={user} roomPermissionList={roomPermissionList} roomPermission={roomPermission} />
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
              <Text style={styles.textStyle}>There are no rooms in your home that you have access to</Text>
            }
          </View>
        );
      }
    }
    else {
      return (
        <View style={styles.textViewStyle}>
          {
            <Text style={styles.textStyle}>There are no rooms in your home that you have access to</Text>
          }
        </View>
      );
    }
  }

  render() {
    return (
      <ScrollView>
        <View style={styles.container}>
          <View style={{ flex: 8 }}>
            {this.showRoomPermissions()}
          </View>
          <View style={{ flex: 2 }}>
            <View style={styles.userButtonStyle}>
              <Button primary text="User" onPress={() => {this.props.navigation.navigate("User")}} />
            </View>
            <View style={styles.homeButtonStyle}>
              <Button primary text="Home" onPress={() => { this.props.navigation.navigate("Home") }} />
            </View>
          </View>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'crimson',
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
  },
  textViewStyle: {
    margin: 5,
  },
  userButtonStyle: {
    margin: 5,
    backgroundColor: 'cyan',
    borderColor: 'blue',
    borderRadius: 50,
    borderWidth: 1
  },
  homeButtonStyle: {
    margin: 5,
    backgroundColor: 'lightblue',
    borderColor: 'blue',
    borderRadius: 50,
    borderWidth: 1
  },
});