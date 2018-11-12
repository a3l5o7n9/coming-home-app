import React from 'react';
import { StyleSheet, Text, View, TextInput, AsyncStorage, ScrollView } from 'react-native';
import { Button, ThemeProvider, Card } from 'react-native-material-ui';
import {Location} from 'expo';

export default class JoinHome extends React.Component {
  static navigationOptions = {
    title: 'Join a Home'
  }

  constructor(props) {
    super(props);

    this.state = {
      appUser: {
        UserId: '',
        UserName: '',
        UserPassword: '',
        FirstName: '',
        LastName: '',
        UserTypeName: '',
        Token: ''
      },
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

  joinHome = () => {
    const userId = this.state.appUser['UserId'];
    const { homeName, address } = this.state;

    if (homeName == '' || address == '') {
      alert("Both a name and an address are required in order to join an existing home.");
      return;
    }

    Location.geocodeAsync(address).then((addressGC) => {
      var request = {
        userId,
        homeName,
        address,
        latitude: addressGC[0].latitude,
        longitude: addressGC[0].longitude,
        altitude: addressGC[0].altitude,
        accuracy: addressGC[0].accuracy
      }

      fetch("http://ruppinmobile.tempdomain.co.il/SITE14/ComingHomeWS.asmx/JoinHome", {
        method: 'POST',
        headers: new Headers({
          'Content-Type': 'application/json;'
        }),
        body: JSON.stringify(request)
      })
        .then(res => res.json()) // קובע שהתשובה מהשרת תהיה בפורמט JSON
        .then((result) => { // no error in server
          var jsonData = JSON.parse(result.d);
          var homeDetails = {
            home: jsonData.H,
            resultMessage: jsonData.ResultMessage
          }

          if (homeDetails.resultMessage == 'Home Not Found' || homeDetails.resultMessage == 'User is already registered as a member of this home') {
            alert(homeDetails.resultMessage);
            return;
          }

          let home = homeDetails.home;

          var newUser = {
            UserId: this.state.appUser.UserId,
            UserName: this.state.appUser.UserName,
            UserPassword: this.state.appUser.UserPassword,
            FirstName: this.state.appUser.FirstName,
            LastName: this.state.appUser.LastName,
            HomeId: home.HomeId,
            UserTypeName: 'דייר',
            Token: this.state.appUser.Token
          }

          var userList = [];

          if (this.state.userList != null)
          {
            userList = this.state.userList;
          }

          userList.push(newUser);

          var homeList = [];

          if (this.state.homeList != null)
          {
            homeList = this.state.homeList;
          }

          homeList.push(home);

          var detailsNew = {
            appUser: this.state.appUser,
            userList: userList,
            homeList: homeList,
            allUserRoomsList: this.state.allUserRoomsList,
            allUserDevicesList: this.state.allUserDevicesList,
            allUserActivationConditionsList: this.state.allUserActivationConditionsList,
            resultMessage: this.state.resultMessage
          }

          let homeStr = JSON.stringify(home);
          let detailsNewStr = JSON.stringify(detailsNew);

          AsyncStorage.setItem('homeStr', homeStr).then(() => {
            AsyncStorage.setItem('detailsStr',setailsNewStr).then(() => {
              this.props.navigation.navigate("Home");
            });
          });
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
            <Button primary text="Create" onPress={this.joinHome} />
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
    backgroundColor: 'sandybrown',
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
