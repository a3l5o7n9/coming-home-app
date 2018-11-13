import React from 'react';
import { StyleSheet, Text, View, TextInput, AsyncStorage, ScrollView } from 'react-native';
import { Button, ThemeProvider, Card } from 'react-native-material-ui';
import {Location} from 'expo';

export default class CreateHome extends React.Component {
  static navigationOptions = {
    title: 'New Home'
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
      homeName: '',
      address: ''
    }
  }

  componentDidMount = () => {
    AsyncStorage.getItem('detailsStr').then((value) => {
      details = JSON.parse(value);

      this.setState({
        appUser: details.appUser,
        userList: details.userList,
        homeList: details.homeList,
        allUserRoomsList: details.allUserRoomsList,
        allUserDevicesList: details.allUserDevicesList,
        allUserActivationConditionsList: details.allUserActivationConditionsList,
        resultMessage: details.resultMessage
      });
    });
  }

  createHome = () => {
    const userId = this.state.appUser['UserId'];
    const { homeName, address } = this.state;

    if (homeName == '' || address == '') {
      alert("Both a name and an address are required to create a home.");
      return;
    }

    Location.geocodeAsync(address).then((addressGC) => {
      console.log('addressGC = ' + JSON.stringify(addressGC));
      var request = {
        userId,
        homeName,
        address,
        latitude: addressGC[0].latitude,
        longitude: addressGC[0].longitude,
        altitude: addressGC[0].altitude,
        accuracy: addressGC[0].accuracy
      }  

      fetch("http://ruppinmobile.tempdomain.co.il/SITE14/ComingHomeWS.asmx/CreateHome", {
        method: 'POST',
        headers: new Headers({
          'Content-Type': 'application/json;'
        }),
        body: JSON.stringify(request)
      })
        .then(res => res.json()) // קובע שהתשובה מהשרת תהיה בפורמט JSON
        .then((result) => { // no error in server
          const homeId = JSON.parse(result.d);

          switch (homeId) {
            case -1:
              {
                alert("There is already a home with that name and address. Use a different home name or address.");
                break;
              }
            default:
              {
                let home = {
                  HomeId: homeId,
                  HomeName: homeName,
                  Address: address,
                  NumOfUsers: 1
                }

                var newUser = {
                  UserId: this.state.appUser.UserId,
                  UserName: this.state.appUser.UserName,
                  UserPassword: this.state.appUser.UserPassword,
                  FirstName: this.state.appUser.FirstName,
                  LastName: this.state.appUser.LastName,
                  HomeId: homeId,
                  UserTypeName: 'דייר אחראי',
                  Token: this.state.appUser.Token
                }

                var userList = [];
                var homeList = [];

                if (this.state.userList != null)
                {
                  userList = this.state.userList;
                }

                userList.push(newUser);

                if (this.state.homeList != null)
                {
                  homeList = this.state.homeList;
                }

                homeList.push(home);

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
                    this.props.navigation.navigate("Home");
                  });
                });
                break;
              }
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
            <Text style={styles.textStyle}>Home Name</Text>
          </View>
          <View style={styles.textInputViewStyle}>
            <TextInput style={styles.textInputStyle} value={this.state.homeName} placeholder="Home Name" onChangeText={(homeName) => this.setState({ homeName })}></TextInput>
          </View>
          <View style={styles.textViewStyle}>
            <Text style={styles.textStyle}>Address</Text>
          </View>
          <View style={styles.textInputViewStyle}>
            <TextInput style={styles.textInputStyle} value={this.state.address} placeholder="Address" onChangeText={(address) => this.setState({ address })}></TextInput>
          </View>
          <View style={styles.submitButtonViewStyle}>
            <Button primary text="Create" onPress={this.createHome} />          
          </View>
          <View style={styles.cancelButtonViewStyle}>
            <Button primary text="Cancel" onPress={() => { this.props.navigation.navigate("MainPage") }} />
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
});
