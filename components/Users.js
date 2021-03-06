import React from 'react';
import { StyleSheet, Text, View, AsyncStorage, ScrollView } from 'react-native';
import { Button } from 'react-native-material-ui';

export default class Users extends React.Component {
  static navigationOptions = {
    title: 'Users',
  }

  constructor(props) {
    super(props);

    this.state = {
      appUser: {},
      home: {},
      userList: []
    }
  }

  componentDidMount = () => {
    AsyncStorage.getItem('homeStr').then((value) => {
      home = JSON.parse(value);

      AsyncStorage.getItem('detailsStr').then((value) => {
        details = JSON.parse(value);

        AsyncStorage.getItem('usersStr').then((value) => {
          users = JSON.parse(value);

          AsyncStorage.getItem('roomsStr').then((value) => {
            rooms = JSON.parse(value);

            AsyncStorage.getItem('devicesStr').then((value) => {
              devices = JSON.parse(value);

              this.setState({
                appUser: details.appUser,
                home: home,
                userList: users.userList,
                roomList: rooms.roomList,
                deviceList: devices.deviceList
              });
            });
          });
        });
      });
    });
  }

  showUsers = () => {
    if (this.state.userList != null) {
      return (
        <View style={styles.container}>
          <Text style={styles.textStyle}>Your Home Members</Text>
          {
            this.state.userList.map((user, UserId) => (
              <View key={UserId} style={{ borderColor: 'cyan', borderRadius: 10, borderWidth: 5, backgroundColor: 'lightcyan', flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                <Button primary text={user["UserName"] + "\n" + user["FirstName"] + " " + user["LastName"]} onPress={() => {
                  let userStr = JSON.stringify(user);
                  AsyncStorage.setItem('userStr', userStr).then(() => {
                    this.props.navigation.navigate("User");
                  });
                }} />
              </View>
            ))
          }
        </View>
      );
    }
    else {
      return (
        <View>
          {
            <Text style={styles.textStyle}>There are no other users in your home</Text>
          }
        </View>
      );
    }
  }

  render() {
    return (
      <ScrollView>
        <View style={styles.container}>
          <View>
            {this.showUsers()}
          </View>
          <View style={styles.inviteButtonStyle}>
            <Button primary text="Invite New User" onPress={() => { this.props.navigation.navigate("InviteUser") }} />
          </View>
          <View style={styles.homeButtonStyle}>
            <Button primary text="Home" onPress={() => { this.props.navigation.navigate("Home") }} />
          </View>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: 'cyan',
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
  homeButtonStyle: {
    margin: 5,
    backgroundColor: 'lightblue',
    borderColor: 'blue',
    borderRadius: 50,
    borderWidth: 1
  },
  inviteButtonStyle: {
    margin: 5,
    backgroundColor: 'orange',
    borderColor: 'orange',
    borderRadius: 50,
    borderWidth: 1
  }
});
