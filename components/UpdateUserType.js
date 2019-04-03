import React from 'react';
import { StyleSheet, Text, View, AsyncStorage, ScrollView, Picker } from 'react-native';
import { Button, ThemeProvider, Card } from 'react-native-material-ui';

export default class UpdateRoom extends React.Component {
  static navigationOptions = {
    title: 'Update User Type'
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
      user: {},
      userTypes: [],
      homeUserList: [],
      updatedUserTypeCode: 0,
      updatedUserTypeName: ''
    }
  }

  componentDidMount = () => {
    AsyncStorage.getItem('homeStr').then((value) => {
      home = JSON.parse(value);

      AsyncStorage.getItem('detailsStr').then((value) => {
        details = JSON.parse(value);

        AsyncStorage.getItem('userTypesStr').then((value) => {
          userTypes = JSON.parse(value);

          AsyncStorage.getItem('usersStr').then((value) => {
            users = JSON.parse(value);

            AsyncStorage.getItem('userStr').then((value) => {
              user = JSON.parse(value);

              var userTypeCode = userTypes.find((usty) => usty.UserTypeName == user.UserTypeName).UserTypeCode;

              this.setState(
                {
                  appUser: details.appUser,
                  userList: details.userList,
                  homeList: details.homeList,
                  allUserRoomsList: details.allUserRoomsList,
                  allUserDevicesList: details.allUserDevicesList,
                  allUserActivationConditionsList: details.allUserActivationConditionsList,
                  resultMessage: details.resultMessage,
                  home: home,
                  userTypes: userTypes,
                  homeUserList: users.userList,
                  user: user,
                  updatedUserTypeCode: userTypeCode,
                  updatedUserTypeName: user.UserTypeName
                });
            });
          });
        });
      });
    });
  }

  updateUserTypeInHome = () => {
    const appUserId = this.state.appUser['UserId'];
    const userToUpdateId = this.state.user['UserId'];
    const homeId = this.state.home['HomeId'];
    var { updatedUserTypeCode, updatedUserTypeName } = this.state;

    if (updatedUserTypeCode == '' || updatedUserTypeCode == null) {
      updatedUserTypeName = this.state.user.UserTypeName;
    }
    else {
      var typeIndex = this.state.userTypes.findIndex((ut) => ut.UserTypeCode == updatedUserTypeCode);
      updatedUserTypeName = this.state.userTypes[typeIndex].UserTypeName;
    }

    var request = {
      appUserId,
      userToUpdateId,
      homeId,
      updatedUserTypeName
    }

    fetch("http://orhayseriesnet.ddns.net/Coming_Home/ComingHomeWS.asmx/UpdateUserTypeInHome", {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json;'
      }),
      body: JSON.stringify(request)
    })
      .then(res => res.json()) // קובע שהתשובה מהשרת תהיה בפורמט JSON
      .then((result) => { // no error in server
        const resultValue = JSON.parse(result.d);

        switch (resultValue) {
          case -2:
            {
              alert('Error! You do not possess the necessary permissions to perform this action!');
              return;
            }
          case -3:
            {
              alert('Error! Action could not be completed, possibly it would leave the home without a main user able to manage permissions');
              return;
            }
          case 0:
            {
              alert('Action aborted, since updateUserTypeName is the same as the original');
              return;
            }
          default:
            {
              var {user} = this.state;
              var homeUserList = [];
              homeUserList = this.state.homeUserList;

              user.UserTypeName = updatedUserTypeName;

              var index = homeUserList.findIndex((hu) => hu.UserId == user.UserId);
              homeUserList[index].UserTypeName = user.UserTypeName;

              var usersNew = {
                userList : homeUserList,
                resultMessage: 'data'
              }

              let userStr = JSON.stringify(user);
              let usersNewStr = JSON.stringify(usersNew);

              AsyncStorage.setItem('userStr', userStr).then(() => {
                AsyncStorage.setItem('usersStr', usersNewStr).then(() => {
                  var pathName = "User";

                  if (appUserId == userToUpdateId)
                  {
                    var userList = [];
                    userList = this.state.userList;

                    var indexA = userList.find((u) => u.UserId === userToUpdateId && u.HomeId === homeId);
                    userList[indexA].UserTypeName = user.UserTypeName;

                    var detailsNew = {
                      appUser: this.state.appUser,
                      userList: userList,
                      homeList: this.state.homeList,
                      allUserRoomsList: this.state.allUserRoomsList,
                      allUserDevicesList: this.state.allUserDevicesList,
                      allUserActivationConditionsList: this.state.allUserActivationConditionsList,
                      resultMessage: this.state.resultMessage
                    }
    
                    let detailsNewStr = JSON.stringify(detailsNew);

                    AsyncStorage.setItem('detailsStr', detailsNewStr).then(() => {
                      pathName = user.UserTypeName == 'דייר' ? "Home" : "User";
                    });
                  }

                  this.props.navigation.navigate(pathName);
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

  pickUserType = () => {
    var userTypes = [];
    userTypes = this.state.userTypes;

    return (
      <Picker
        style={styles.pickerStyle}
        selectedValue={this.state.updatedUserTypeCode}
        onValueChange={(itemValue) => this.setState({ updatedUserTypeCode: itemValue })}>
        {
          this.state.userTypes.filter((ut) => ut.UserTypeName != 'אחראי מערכת').map((userType) => {
            return (
              <Picker.Item key={userType["UserTypeCode"]} label={userType["UserTypeName"]} value={userType["UserTypeCode"]} />
            )
          })
        }
      </Picker>
    );
  }

  render() {
    return (
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.textViewStyle}>
            <Text style={styles.textStyle}>User Type</Text>
          </View>
          {this.pickUserType()}
          <View style={styles.submitButtonViewStyle}>
            <Button primary text="Update" onPress={this.updateUserTypeInHome} />
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
    backgroundColor: 'cyan',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  textStyle: {
    fontSize: 20,
    alignItems: 'center',
    color: 'green',
  },
  textViewStyle: {
    margin: 5,
  },
  submitButtonViewStyle: {
    margin: 5,
    backgroundColor: 'lightgrey',
    borderColor: 'silver',
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
  pickerStyle: {
    width: '80%',
    borderColor: 'black',
    borderRadius: 5,
    borderWidth: 2
  },
});