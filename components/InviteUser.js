import React from 'react';
import { StyleSheet, Text, View, TextInput, AsyncStorage, ScrollView } from 'react-native';
import { Button, ThemeProvider, Card } from 'react-native-material-ui';
import { Location } from 'expo';

export default class InviteUser extends React.Component {
  static navigationOptions = {
    title: 'Invite User'
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
      inviteUserName: ''
    }
  }

  componentDidMount = () => {
    AsyncStorage.getItem('detailsStr').then((value) => {
      details = JSON.parse(value);

      AsyncStorage.getItem('homeStr').then((value) => {
        home = JSON.parse(value);

        this.setState({
          appUser: details.appUser,
          userList: details.userList,
          homeList: details.homeList,
          allUserRoomsList: details.allUserRoomsList,
          allUserDevicesList: details.allUserDevicesList,
          allUserActivationConditionsList: details.allUserActivationConditionsList,
          resultMessage: details.resultMessage,
          home: home
        });
      });
    });
  }

  inviteUser = () => {
    var userName = this.state.inviteUserName;
    const homeName = this.state.home.HomeName;
    const address = this.state.home.Address;

    Location.geocodeAsync(address).then((addressGC) => {
      console.log('addressGC = ' + JSON.stringify(addressGC));
      var request = {
        userName,
        homeName,
        address,
        latitude: addressGC[0].latitude,
        longitude: addressGC[0].longitude,
        altitude: addressGC[0].altitude,
        accuracy: addressGC[0].accuracy
      }

      fetch("http://ruppinmobile.tempdomain.co.il/SITE14/ComingHomeWS.asmx/InviteUserToHome", {
        method: 'POST',
        headers: new Headers({
          'Content-Type': 'application/json;'
        }),
        body: JSON.stringify(request)
      })
        .then(res => res.json()) // קובע שהתשובה מהשרת תהיה בפורמט JSON
        .then((result) => { // no error in server
          const newUser = JSON.parse(result.d);
          
          console.log(newUser);
          if (newUser == null)
          {
            alert("Error! User not found or already registered in home.");
            return;
          }
          else
          {
            var home = {
              HomeId: this.state.home.HomeId,
              HomeName: homeName,
              Address: address,
              NumOfUsers: (this.state.home.NumOfUsers + 1)*1
            }

            var userList = [];
            var homeList = [];

            if (this.state.userList != null) {
              userList = this.state.userList;
            }

            userList.push(newUser);

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
            let newUserStr = JSON.stringify(newUser);

            AsyncStorage.setItem('homeStr', homeStr).then(() => {
              AsyncStorage.setItem('detailsStr', detailsNewStr).then(() => {
                AsyncStorage.setItem('userStr', newUserStr).then(() => {
                  this.props.navigation.navigate("User");
                });
              });
            });
          }
        })
        .catch((error) => {
          alert('A connection error has occurred.');
        });
    });
  }

  render() {
    return (
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.textViewStyle}>
            <Text style={styles.textStyle}>User Name</Text>
          </View>
          <View style={styles.textInputViewStyle}>
            <TextInput style={styles.textInputStyle} value={this.state.inviteUserName} placeholder="User Name" onChangeText={(inviteUserName) => this.setState({ inviteUserName })}></TextInput>
          </View>
          <View style={styles.InviteButtonViewStyle}>
            <Button primary text="Invite" onPress={this.inviteUser} />
          </View>
          <View style={styles.cancelButtonViewStyle}>
            <Button primary text="Cancel" onPress={() => { this.props.navigation.navigate("Users") }} />
          </View>
        </View>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'orange',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  textStyle: {
    fontSize: 20,
    alignItems: 'center',
    color: 'green',
  },
  textInputStyle: {
    fontSize: 25,
  },
  textViewStyle: {
    margin: 5,
  },
  textInputViewStyle: {
    margin: 5,
    borderColor: 'black',
    borderRadius: 5,
    borderWidth: 1
  },
  InviteButtonViewStyle: {
    margin: 5,
    backgroundColor: 'yellow',
    borderColor: 'gold',
    borderRadius: 50,
    borderWidth: 1
  },
  cancelButtonViewStyle: {
    margin: 5,
    backgroundColor: 'grey',
    borderColor: 'lightgrey',
    borderRadius: 50,
    borderWidth: 1
  },
});
