import React from 'react';
import { StyleSheet, Text, View, TextInput, AsyncStorage, ScrollView } from 'react-native';
import { Button, ThemeProvider, Card } from 'react-native-material-ui';
import {Location} from 'expo';

export default class UpdateHome extends React.Component {
  static navigationOptions = {
    title: 'Update Home'
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
      home: {
        HomeName: '',
        Address: ''
      },
      newHomeName: '',
      newAddress: '',
    }
  }

  componentDidMount = () => {
    AsyncStorage.getItem('homeStr').then((value) => {
      home = JSON.parse(value);

      AsyncStorage.getItem('detailsStr').then((value) => {
        details = JSON.parse(value);

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

  updateHomeDetails = () => {
    const appUserId = this.state.appUser['UserId'];
    const homeId = this.state.home['HomeId'];
    var { newHomeName, newAddress } = this.state;
    var newLatitude, newLongitude, newAltitude, newAccuracy;
    var request;

    if (newHomeName == '' || newHomeName == null) 
    {
      newHomeName = 'null';
    }

    if (newAddress == '' || newAddress == null)
    {
      newAddress = 'null';
      newLatitude = 'null';
      newLongitude = 'null';
      newAltitude = 'null';
      newAccuracy = 'null';

      request = {
        appUserId,
        homeId,
        newHomeName,
        newAddress,
        newLatitude,
        newLongitude,
        newAltitude,
        newAccuracy
      }
    }
    else
    {
      Location.geocodeAsync(newAddress).then((newAddressGC) => {
        request = {
          appUserId,
          homeId,
          newHomeName,
          newAddress,
          newLatitude: newAddressGC[0].latitude,
          newLongitude: newAddressGC[0].longitude,
          newAltitude: newAddressGC[0].altitude,
          newAccuracy: newAddressGC[0].accuracy
        }
      })
    }


    fetch("http://ruppinmobile.tempdomain.co.il/SITE14/ComingHomeWS.asmx/UpdateHomeDetails", {
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
              var home = {
                HomeId: homeId,
                HomeName: newHomeName == 'null' ? this.state.home.HomeName : newHomeName,
                Address: newAddress == 'null' ? this.state.home.Address : newAddress,
                Latitude: newLatitude == 'null' ? this.state.home.Latitude : newLatitude,
                Longitude: newLongitude == 'null' ? this.state.home.Longitude : newLongitude,
                Altitude: newAltitude == 'null' ? this.state.home.Altitude : newAltitude,
                Accuracy: newAccuracy == 'null' ? this.state.home.Accuracy : newAccuracy,
                NumOfUsers: this.state.home.NumOfUsers
              }

              var homeList = new Array();

              if (this.state.homeList != null)
              {
                homeList = this.state.homeList;
              }

              var index = homeList.findIndex((h) => (h.HomeId === homeId));

              homeList[index].HomeName = home.HomeName;
              homeList[index].Address = home.Address;
              homeList[index].Latitude = home.Latitude;
              homeList[index].Longitude = home.Longitude;
              homeList[index].Altitude = home.Altitude;
              homeList[index].Accuracy = home.Accuracy;
              homeList[index].NumOfUsers = home.NumOfUsers;

              var detailsNew = {
                appUser: this.state.appUser,
                userList: this.state.userList,
                homeList: homeList,
                allUserRoomsList: this.state.allUserRoomsList,
                allUserDevicesList: this.state.allUserDevicesList,
                allUserActivationConditionsList: this.state.allUserActivationConditionsList,
                resultMessage: this.state.resultMessage
              }

              let homeStr = JSON.stringify(home);
              let detailsNewStr = JSON.stringify(detailsNew);

              AsyncStorage.setItem('homeStr', homeStr).then(() => {
               AsyncStorage.setItem('detailsStr', detailsNewStr).then(() => {
                this.props.navigation.navigate("Home");
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

  render() {
    return (
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.textViewStyle}>
            <Text style={styles.textStyle}>Home Name</Text>
          </View>
          <View style={styles.textInputViewStyle}>
            <TextInput style={styles.textInputStyle} value={this.state.newHomeName} placeholder={this.state.home.HomeName} onChangeText={(newHomeName) => this.setState({ newHomeName })}></TextInput>
          </View>
          <View style={styles.textViewStyle}>
            <Text style={styles.textStyle}>Address</Text>
          </View>
          <View style={styles.textInputViewStyle}>
            <TextInput style={styles.textInputStyle} value={this.state.newAddress} placeholder={this.state.home.Address} onChangeText={(newAddress) => this.setState({ newAddress })}></TextInput>
          </View>
          <View style={styles.submitButtonViewStyle}>
            <Button primary text="Update" onPress={this.updateHomeDetails} />
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
});
