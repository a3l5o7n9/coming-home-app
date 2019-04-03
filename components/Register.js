import React from 'react';
import { StyleSheet, Text, View, TextInput, ScrollView, AsyncStorage } from 'react-native';
import { Button, ThemeProvider, Card } from 'react-native-material-ui';

export default class Register extends React.Component {
  static navigationOptions = {
    title: 'Registration',
  }

  constructor(props) {
    super(props);
    this.state = {
      userName: '',
      userPassword: '',
      confirmPassword: '',
      firstName: '',
      lastName: ''
    }
  }

  submit = () => {
    const { userName, userPassword, confirmPassword, firstName, lastName } = this.state;

    if (userName == '' || firstName == '' || lastName == '') {
      alert("UserName, FirstName and LastName fields must be filled in!");
      return;
    }

    if (userPassword != confirmPassword) {
      alert("Both password fields must be identical!");
      return;
    }

    var request = {
      userName,
      userPassword,
      firstName,
      lastName
    }

    fetch("http://orhayseriesnet.ddns.net/Coming_Home/ComingHomeWS.asmx/Register", {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json;'
      }),
      body: JSON.stringify(request)
    })
      .then(res => res.json()) // קובע שהתשובה מהשרת תהיה בפורמט JSON
      .then((result) => { // no error in server
        const userId = JSON.parse(result.d);
        switch (userId) {
          case -2:
            {
              alert("Error! User could not be created");
              return;
            }
          case -1:
            {
              alert("There is already a user with that UserName. Use a different UserName.");
              return;
            }
          default:
            {
              var details = {
                appUser: {
                  UserId: userId,
                  UserName: userName,
                  UserPassword: userPassword,
                  FirstName: firstName,
                  LastName: lastName,
                  Token: null
                },
                userList: null,
                homeList: null,
                allUserRoomsList: null,
                allUserDevicesList: null,
                allUserActivationConditionsList: null,
                resultMessage: 'Data'
              }

              var user = details.appUser;

              var detailsStr = JSON.stringify(details);
              AsyncStorage.setItem('detailsStr', detailsStr).then(() => {
                var userStr = JSON.stringify(user);
                AsyncStorage.setItem('userStr', userStr).then(() => {
                  this.props.navigation.navigate("MainPage");
                });
              });
              break;
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
            <Text style={styles.textStyle}>Username</Text>
          </View>
          <View style={styles.textInputViewStyle}>
            <TextInput style={styles.textInputStyle} value={this.state.userName} placeholder="Username" onChangeText={(userName) => this.setState({ userName })}></TextInput>
          </View>
          <View style={styles.textViewStyle}>
            <Text style={styles.textStyle}>Password</Text>
          </View>
          <View style={styles.textInputViewStyle}>
            <TextInput style={styles.textInputStyle} value={this.state.userPassword} placeholder="Password" onChangeText={(userPassword) => this.setState({ userPassword })}></TextInput>
          </View>
          <View style={styles.textViewStyle}>
            <Text style={styles.textStyle}>Confirm Password</Text>
          </View>
          <View style={styles.textInputViewStyle}>
            <TextInput style={styles.textInputStyle} value={this.state.confirmPassword} placeholder="Confirm Password" onChangeText={(confirmPassword) => this.setState({ confirmPassword })}></TextInput>
          </View>
          <View style={styles.textViewStyle}>
            <Text style={styles.textStyle}>First Name</Text>
          </View>
          <View style={styles.textInputViewStyle}>
            <TextInput style={styles.textInputStyle} value={this.state.firstName} placeholder="First Name" onChangeText={(firstName) => this.setState({ firstName })}></TextInput>
          </View>
          <View style={styles.textViewStyle}>
            <Text style={styles.textStyle}>Last Name</Text>
          </View>
          <View style={styles.textInputViewStyle}>
            <TextInput style={styles.textInputStyle} value={this.state.lastName} placeholder="Last Name" onChangeText={(lastName) => this.setState({ lastName })}></TextInput>
          </View>
          <View style={styles.submitButtonViewStyle}>
            <Button primary text="Submit" onPress={this.submit} />
          </View>
          <View style={styles.cancelButtonViewStyle}>
            <Button primary text="Login" onPress={() => { this.props.navigation.navigate('Login') }} />
          </View>
        </View>
      </ScrollView>
    );
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
