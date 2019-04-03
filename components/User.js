import React from 'react';
import { StyleSheet, Text, View, AsyncStorage, ScrollView } from 'react-native';
import { Button, ThemeProvider, Card } from 'react-native-material-ui';

export default class User extends React.Component {
  static navigationOptions = {
    title: 'User'
  }

  constructor(props) {
    super(props);

    this.state = {
      appUser: {},
      home: {},
      user: {},
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

        AsyncStorage.getItem('userStr').then((value) => {
          user = JSON.parse(value);

          this.setState({
            appUser: details.appUser,
            userList: details.userList,
            homeList: details.homeList,
            allUserRoomsList: details.allUserRoomsList,
            allUserDevicesList: details.allUserDevicesList,
            allUserActivationConditionsList: details.allUserActivationConditionsList,
            resultMessage: details.resultMessage,
            home: home,
            user: user
          });
        });
      });
    });
  }

  getUserHomeDetails = () => {
    var userId = this.state.user["UserId"];
    var homeId = this.state.home["HomeId"];

    var request = {
      userId,
      homeId
    }
    fetch("http://orhayseriesnet.ddns.net/Coming_Home/ComingHomeWS.asmx/GetUserHomeDetails", {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json;'
      }),
      body: JSON.stringify(request)
    })
      .then(res => res.json()) // קובע שהתשובה מהשרת תהיה בפורמט JSON
      .then((result) => { // no error in server
        let jsonData = JSON.parse(result.d);
        let roomPermissions = {
          roomPermissionList: jsonData.LR,
          resultMessage: jsonData.ResultMessage
        }

        let devicePermissions = {
          devicePermissionList: jsonData.LD,
          resultMessage: jsonData.ResultMessage
        }

        let roomPermissionsStr = JSON.stringify(roomPermissions);

        AsyncStorage.setItem('roomPermissionsStr', roomPermissionsStr).then(() => {
          let devicePermissionsStr = JSON.stringify(devicePermissions);

          AsyncStorage.setItem('devicePermissionsStr', devicePermissionsStr).then(() => {
          });
        });
      })
      .catch((error) => {
        alert("A connection Error has occurred.");
      });
  }

  goToRoomPermissions = () => {
    this.getUserHomeDetails();
    this.props.navigation.navigate('RoomPermissions');
  }

  goToDevicePermissions = () => {
    this.getUserHomeDetails();
    this.props.navigation.navigate('DevicePermissions');
  }

  expelUser = () => {
    var userId = this.state.user.UserId;
    var homeId = this.state.home.HomeId;

    var request = {
      userId,
      homeId
    }

    fetch("http://orhayseriesnet.ddns.net/Coming_Home/ComingHomeWS.asmx/LeaveHome", {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json;'
      }),
      body: JSON.stringify(request)
    })
      .then(res => res.json()) // קובע שהתשובה מהשרת תהיה בפורמט JSON
      .then((result) => { // no error in server
        var res = JSON.parse(result.d);

        if (res <= 0)
        {
          alert("Error! User not found or already left home.");
          return;
        }
        else
        {
          var home = {
            HomeId: this.state.home.HomeId,
            HomeName: this.state.home.HomeName,
            Address: this.state.home.Address,
            NumOfUsers: this.state.home.NumOfUsers - 1
          }

          var userList = [];
          var homeList = [];

          if (this.state.userList != null) {
            userList = this.state.userList;
          }

          if (this.state.homeList != null) {
            homeList = this.state.homeList;
          }

          var homeIndex = homeList.findIndex((h) => h.HomeId = home.HomeId);

          homeList[homeIndex].NumOfUsers = home.NumOfUsers;

          let homeStr = JSON.stringify(home);

          let detailsNew = {
            appUser: this.state.appUser,
            userList: userList,
            homeList: homeList,
            allUserRoomsList: this.state.allUserRoomsList,
            allUserDevicesList: this.state.allUserDevicesList,
            allUserActivationConditionsList: this.state.allUserActivationConditionsList,
            resultMessage: this.state.resultMessage
          }

          let detailsNewStr = JSON.stringify(detailsNew);

          AsyncStorage.setItem('homeStr', homeStr).then(() => {
            AsyncStorage.setItem('detailsStr', detailsNewStr).then(() => {
              this.props.navigation.navigate("Users");
            });
          });
        }
      })
      .catch((error) => {
        alert('A connection error has occurred.');
      });
  }

  render() {
    return (
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.textViewStyle}>
            <Text style={{ fontSize: 20 }}>{this.state.user["UserName"]}</Text>
            <Text style={{fontSize: 15}}>{this.state.user["UserTypeName"]}</Text>
          </View>
          <View style={styles.roomPermissionsButtonStyle}>
            <Button primary text="Room Permissions" onPress={() => {this.goToRoomPermissions()}}/>
          </View>
          <View style={styles.devicePermissionButtonStyle}>
            <Button primary text="Device Permissions" onPress={() => {this.goToDevicePermissions()}}/>
          </View>
          <View style={styles.updateTypeButtonStyle}>
            <Button primary text="Update User Type" onPress={() => {this.props.navigation.navigate("UpdateUserType")}}/>
          </View>
          <View style={styles.expelButtonStyle}>
            <Button primary text="Expel User" onPress={() => {this.expelUser()}}/>
          </View>
          <View style={styles.listButtonStyle}>
            <Button primary text="Users" onPress={() => { this.props.navigation.navigate("Users") }} />
          </View>
          <View style={styles.homeButtonStyle}>
            <Button primary text="Home" onPress={() => {this.props.navigation.navigate("Home")}}/>
          </View>
        </View>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
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
  textViewStyle: {
    margin:5,
  },
  updateTypeButtonStyle: {
    margin:5,
    backgroundColor:'lightgrey',
    borderColor:'silver',
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
  listButtonStyle: {
    margin:5,
    backgroundColor:'lawngreen',
    borderColor:'green',
    borderRadius:50,
    borderWidth:1
  },
  roomPermissionsButtonStyle: {
    margin:5,
    backgroundColor: 'crimson',
    borderColor:'red',
    borderRadius:50,
    borderWidth:1
  },
  devicePermissionButtonStyle: {
    margin:5,
    backgroundColor:'navy',
    borderColor:'blue',
    borderRadius:50,
    borderWidth:1
  },
  expelButtonStyle: {
    margin:5,
    backgroundColor:'red',
    borderColor:'crimson',
    borderRadius:50,
    borderWidth:1
  }
});
