import React from 'react';
import { StyleSheet, Text, View, AsyncStorage, ScrollView } from 'react-native';
import { Button, ThemeProvider, Card } from 'react-native-material-ui';

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
              <Button primary key={UserId} text={user["UserName"] + "\n" + user["FirstName"] + " " + user["LastName"]} onPress={() => {
                let userStr = JSON.stringify(user);
                AsyncStorage.setItem('userStr', userStr).then(() => {
                  this.props.navigation.navigate("User");
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
          <View style={styles.container}>
            {this.showUsers()}
          </View>
          <Button primary text="Home" onPress={() => { this.props.navigation.navigate("Home") }} />
        </View>
      </ScrollView>
    );
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
