import React from 'react';
import { StyleSheet, Text, View, Alert, TextInput, ScrollView } from 'react-native';
import { Button, ThemeProvider, Card } from 'react-native-material-ui';

export default class Register extends React.Component {
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

    fetch("http://ruppinmobile.tempdomain.co.il/SITE14/ComingHomeWS.asmx/Register", {
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
              break;
            }
          case -1:
            {
              alert("There is already a user with that UserName. Use a different UserName.");
              break;
            }
          default:
            {
              let details = {
                user: {
                  UserId: userId,
                  UserName: userName,
                  UserPassword: userPassword,
                  FirstName: firstName,
                  LastName: lastName,
                  UserTypeName: '',
                  Token: ''
                },
                userList: null,
                homeList: null,
                resultMessage: 'Data'
              }

              let detailsStr = JSON.stringify(details);
              AsyncStorage.setItem('detailsStr', detailsStr).then(() => {
                // console.log("detailStr");
                // AsyncStorage.getItem('detailsStr').then((value) => {
                //     console.log('detailsStr = ' + value);
                // });
                this.props.navigation.navigate("MainPage");
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
          <Text style={{ fontSize: 30 }}>Registration</Text>
          <Text style={styles.textStyle}>Username</Text>
          <TextInput style={styles.textInputStyle} value={this.state.userName} placeholder="Username" onChangeText={(userName) => this.setState({ userName })}></TextInput>
          <Text style={styles.textStyle}>Password</Text>
          <TextInput style={styles.textInputStyle} value={this.state.userPassword} placeholder="Password" onChangeText={(userPassword) => this.setState({ userPassword })}></TextInput>
          <Text style={styles.textStyle}>Confirm Password</Text>
          <TextInput style={styles.textInputStyle} value={this.state.confirmPassword} placeholder="Confirm Password" onChangeText={(confirmPassword) => this.setState({ confirmPassword })}></TextInput>
          <Text style={styles.textStyle}>First Name</Text>
          <TextInput style={styles.textInputStyle} value={this.state.firstName} placeholder="First Name" onChangeText={(firstName) => this.setState({ firstName })}></TextInput>
          <Text style={styles.textStyle}>Last Name</Text>
          <TextInput style={styles.textInputStyle} value={this.state.lastName} placeholder="Last Name" onChangeText={(lastName) => this.setState({ lastName })}></TextInput>
          <Button primary text="Submit" onPress={this.submit} />
          <Button primary text="Login" onPress={() => { this.props.navigation.navigate('Login') }} />
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textStyle: {
    fontSize: 20,
    alignItems: 'center',
  },
  textInputStyle: {
    fontSize: 25,
  }
});
