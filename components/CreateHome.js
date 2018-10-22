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
      homeName: '',
      address: ''
    }
  }

  componentDidMount = () => {
    AsyncStorage.getItem('detailsStr').then((value) => {
      details = JSON.parse(value);

      this.setState({
        appUser: details.appUser,
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

                let homeStr = JSON.stringify(home);

                AsyncStorage.setItem('homeStr', homeStr).then(() => {
                  this.props.navigation.navigate("Home");
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
          <Text style={styles.textStyle}>Home Name</Text>
          <TextInput style={styles.textInputStyle} value={this.state.homeName} placeholder="Home Name" onChangeText={(homeName) => this.setState({ homeName })}></TextInput>
          <Text style={styles.textStyle}>Address</Text>
          <TextInput style={styles.textInputStyle} value={this.state.address} placeholder="Address" onChangeText={(address) => this.setState({ address })}></TextInput>
          <Button primary text="Create" onPress={this.createHome} />
          <Button primary text="Cancel" onPress={() => { this.props.navigation.navigate("MainPage") }} />
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
