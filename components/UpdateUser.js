import React from 'react';
import { StyleSheet, Text, View, TextInput, AsyncStorage, ScrollView } from 'react-native';
import { Button, ThemeProvider, Card } from 'react-native-material-ui';

export default class UpdateUser extends React.Component {
  static navigationOptions = {
    title: 'Update User',
  }

  constructor(props) {
    super(props);
    this.state = {
      appUser: {},
      user: {

      },
      newUserName: '',
      newUserPassword: '',
      newConfirmPassword: '',
      newFirstName: '',
      newLastName: '',
      back: this.props.navigation.state.params
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
            home: home,
            user: user,
          });
        });
      });
    });
  }

  updateUserDetails = () => {
    var { newUserName, newUserPassword, newConfirmPassword, newFirstName, newLastName } = this.state;
    const appUserId = this.state.appUser.UserId;
    const userToUpdateId = this.state.user.UserId; 

    if (appUserId != userToUpdateId)
    {
      alert("Error! You cannot change another user's details!");
      return;
    }

    if (newUserName == '' || newUserName == null) 
    {
      newUserName = 'null';
    }

    if (newUserPassword != newConfirmPassword) {
      alert("Both password fields must be identical!");
      return;
    }

    if (newUserPassword == '' || newUserPassword == null)
    {
      newUserPassword = 'null';
    }

    if (newFirstName == '' || newFirstName == null)
    {
      newFirstName = 'null';
    }

    if (newLastName == '' || newLastName == null)
    {
      newLastName = 'null';
    }

    var request = {
      appUserId,
      userToUpdateId,
      newUserName,
      newUserPassword,
      newFirstName,
      newLastName
    }

    fetch("http://ruppinmobile.tempdomain.co.il/SITE14/ComingHomeWS.asmx/UpdateUserDetails", {
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
              var userNew = {
                UserId: userToUpdateId,
                UserName: newUserName == 'null' ? this.state.user.UserName : newUserName,
                UserPassword: newUserPassword == 'null' ? this.state.user.UserPassword : newUserPassword,
                FirstName: newFirstName == 'null' ? this.state.user.FirstName : newFirstName,
                LastName: newLastName == 'null' ? this.state.user.LastName : newLastName,
                Token: this.state.user.Token,
              };

              var newDetails = {
                appUser: {
                  UserId: appUserId,
                  UserName: newUserName == 'null' ? this.state.appUser.UserName : newUserName,
                  UserPassword: newUserPassword == 'null' ? this.state.appUser.UserPassword : newUserPassword,
                  FirstName: newFirstName == 'null' ? this.state.appUser.FirstName : newFirstName,
                  LastName: newLastName == 'null' ? this.state.appUser.LastName : newLastName,
                  Token: this.state.appUser.Token,
                },
                userList: null,
                homeList: null,
                resultMessage: 'Data'
              }
              var detailsStr = JSON.stringify(newDetails);
              AsyncStorage.setItem('detailsStr', detailsStr).then(() => {
                var userStr = JSON.stringify(userNew);
                AsyncStorage.setItem('userStr', userStr).then(() => {
                  var back = this.state.back;
                  this.props.navigation.navigate(back);
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
          <Text style={styles.textStyle}>Username</Text>
          <TextInput style={styles.textInputStyle} value={this.state.newUserName} placeholder={this.state.user.UserName} onChangeText={(newUserName) => this.setState({ newUserName })}></TextInput>
          <Text style={styles.textStyle}>Password</Text>
          <TextInput style={styles.textInputStyle} value={this.state.newUserPassword} placeholder="Password" onChangeText={(newUserPassword) => this.setState({ newUserPassword })}></TextInput>
          <Text style={styles.textStyle}>Confirm Password</Text>
          <TextInput style={styles.textInputStyle} value={this.state.newConfirmPassword} placeholder="Confirm Password" onChangeText={(newConfirmPassword) => this.setState({ newConfirmPassword })}></TextInput>
          <Text style={styles.textStyle}>First Name</Text>
          <TextInput style={styles.textInputStyle} value={this.state.newFirstName} placeholder={this.state.user.FirstName} onChangeText={(newFirstName) => this.setState({ newFirstName })}></TextInput>
          <Text style={styles.textStyle}>Last Name</Text>
          <TextInput style={styles.textInputStyle} value={this.state.newLastName} placeholder={this.state.user.LastName} onChangeText={(newLastName) => this.setState({ newLastName })}></TextInput>
          <Button primary text="Update" onPress={this.updateUserDetails} />
          <Button primary text="Cancel" onPress={() => { this.props.navigation.goBack() }} />
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