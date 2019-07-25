import React from 'react';
import { StyleSheet, Text, View, TextInput, AsyncStorage, ScrollView } from 'react-native';
import { Button } from 'react-native-material-ui';

export default class UpdateUser extends React.Component {
  static navigationOptions = {
    title: 'Update User',
  }

  constructor(props) {
    super(props);

    this.api = "";
    this.state = {
      appUser: {},
      userList: [],
      homeList: [],
      allUserRoomsList: [],
      allUserDevicesList: [],
      allUserActivationConditionsList: [],
      resultMessage: '',
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

          AsyncStorage.getItem('apiStr').then((value) => {
            this.api = JSON.parse(value);

            this.setState({
              appUser: details.appUser,
              userList: details.userList,
              homeList: details.homeList,
              allUserRoomsList: details.allUserRoomsList,
              allUserDevicesList: details.allUserDevicesList,
              allUserActivationConditionsList: details.allUserActivationConditionsList,
              resultMessage: details.resultMessage,
              home: home,
              user: user,
            });
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

    fetch("http://" + this.api + "/ComingHomeWS.asmx/UpdateUserDetails", {
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

              var userList = [];

              if (this.state.userList != null)
              {
                userList = this.state.userList;
              }

              for (var i = 0; i < userList.length; i++)
              {
                userList[i].UserName = userNew.UserName;
                userList[i].UserPassword = userNew.UserPassword;
                userList[i].FirstName = userNew.FirstName;
                userList[i].LastName = userNew.LastName;
                userList[i].Token = userNew.Token;
              }

              var newDetails = {
                appUser: {
                  UserId: appUserId,
                  UserName: newUserName == 'null' ? this.state.appUser.UserName : newUserName,
                  UserPassword: newUserPassword == 'null' ? this.state.appUser.UserPassword : newUserPassword,
                  FirstName: newFirstName == 'null' ? this.state.appUser.FirstName : newFirstName,
                  LastName: newLastName == 'null' ? this.state.appUser.LastName : newLastName,
                  Token: this.state.appUser.Token,
                },
                userList: userList,
                homeList: this.state.homeList,
                allUserRoomsList: this.state.allUserRoomsList,
                allUserDevicesList: this.state.allUserDevicesList,
                allUserActivationConditionsList: this.state.allUserActivationConditionsList,
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
          <View style={styles.textViewStyle}>
            <Text style={styles.textStyle}>Username</Text>
          </View>
          <View style={styles.textInputViewStyle}>
            <TextInput style={styles.textInputStyle} value={this.state.newUserName} placeholder={this.state.user.UserName} onChangeText={(newUserName) => this.setState({ newUserName })}></TextInput>
          </View>
          <View style={styles.textViewStyle}>
            <Text style={styles.textStyle}>Password</Text>
          </View>
          <View style={styles.textInputViewStyle}>
            <TextInput style={styles.textInputStyle} value={this.state.newUserPassword} placeholder="Password" onChangeText={(newUserPassword) => this.setState({ newUserPassword })}></TextInput>
          </View>
          <View style={styles.textViewStyle}>
            <Text style={styles.textStyle}>Confirm Password</Text>
          </View>
          <View style={styles.textInputViewStyle}>
            <TextInput style={styles.textInputStyle} value={this.state.newConfirmPassword} placeholder="Confirm Password" onChangeText={(newConfirmPassword) => this.setState({ newConfirmPassword })}></TextInput>
          </View>
          <View style={styles.textViewStyle}>
            <Text style={styles.textStyle}>First Name</Text>
          </View>
          <View style={styles.textInputViewStyle}>
            <TextInput style={styles.textInputStyle} value={this.state.newFirstName} placeholder={this.state.user.FirstName} onChangeText={(newFirstName) => this.setState({ newFirstName })}></TextInput>
          </View>
          <View style={styles.textViewStyle}>
            <Text style={styles.textStyle}>Last Name</Text>
          </View>
          <View style={styles.textInputViewStyle}>
            <TextInput style={styles.textInputStyle} value={this.state.newLastName} placeholder={this.state.user.LastName} onChangeText={(newLastName) => this.setState({ newLastName })}></TextInput>
          </View>
          <View style={styles.submitButtonViewStyle}>
            <Button primary text="Update" onPress={this.updateUserDetails} />
          </View>
          <View style={styles.cancelButtonViewStyle}>
            <Button primary text="Cancel" onPress={() => { this.props.navigation.goBack() }} />
          </View>
        </View>
      </ScrollView>
    );
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