import React from 'react';
import { StyleSheet, Text, View, TextInput, AsyncStorage, ScrollView } from 'react-native';
import { Button, ThemeProvider, Card } from 'react-native-material-ui';

export default class UpdateHome extends React.Component {
  static navigationOptions = {
    title: 'Update Home'
  }

  constructor(props) {
    super(props);

    this.state = {
      appUser: {},
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
          home: home
        });
      });
    });
  }

  updateHomeDetails = () => {
    const appUserId = this.state.appUser['UserId'];
    const homeId = this.state.home['HomeId'];
    var { newHomeName, newAddress } = this.state;

    if (newHomeName == '' || newHomeName == null) 
    {
      newHomeName = 'null';
    }

    if (newAddress == '' || newAddress == null)
    {
      newAddress = 'null';
    }

    var request = {
      appUserId,
      homeId,
      newHomeName,
      newAddress
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
                NumOfUsers: this.state.home.NumOfUsers
              }

              let homeStr = JSON.stringify(home);

              AsyncStorage.setItem('homeStr', homeStr).then(() => {
                this.props.navigation.navigate("Home");
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
          <Text style={styles.textStyle}>Home Name</Text>
          <TextInput style={styles.textInputStyle} value={this.state.newHomeName} placeholder={this.state.home.HomeName} onChangeText={(newHomeName) => this.setState({ newHomeName })}></TextInput>
          <Text style={styles.textStyle}>Address</Text>
          <TextInput style={styles.textInputStyle} value={this.state.newAddress} placeholder={this.state.home.Address} onChangeText={(newAddress) => this.setState({ newAddress })}></TextInput>
          <Button primary text="Update" onPress={this.updateHomeDetails} />
          <Button primary text="Cancel" onPress={() => { this.props.navigation.goBack() }} />
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
