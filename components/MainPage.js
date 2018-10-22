import React from 'react';
import { StyleSheet, Text, View, AsyncStorage, ScrollView } from 'react-native';
import { Button, ThemeProvider, Card } from 'react-native-material-ui';

export default class MainPage extends React.Component {
  static navigationOptions = {
    title: 'Main'
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
        Token: ''
      },
      userList: null,
      homeList: null
    }
  }

  componentDidMount = () => {
    AsyncStorage.getItem('detailsStr').then((value) => {
      details = JSON.parse(value);

      var request = {
        userId: details.appUser.UserId
      };

      fetch("http://ruppinmobile.tempdomain.co.il/SITE14/ComingHomeWS.asmx/GetAllUserActivationConditions", {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json;'
      }),
      body: JSON.stringify(request)
      })
      .then(res => res.json()) // קובע שהתשובה מהשרת תהיה בפורמט JSON
      .then((result) => { // no error in server
        let userActivationConditionList = JSON.parse(result.d);

        let userActivationConditionListStr = JSON.stringify(userActivationConditionList);

        AsyncStorage.setItem('userActivationConditionListStr', userActivationConditionListStr).then(() => {
          this.setState({
            appUser: details.appUser,
            userList: details.userList,
            homeList: details.homeList
          });
        });
      })
      .catch((error) => {
        alert("Login Error");
      });
    });
  }

  showHomes = () => {
    if (this.state.homeList != null) {
      return (
        <View style={styles.container}>
          <Text style={styles.textStyle}>Your Homes</Text>
          {
            this.state.homeList.map((home, HomeId) => (
              <Button primary key={HomeId} text={home["HomeName"] + "\n" + home["Address"]} onPress={() => {
                let homeStr = JSON.stringify(home);
                AsyncStorage.setItem('homeStr', homeStr).then(() => {
                  this.props.navigation.navigate("Home");
                });
              }} />
            ))
          }
        </View>
      );
    }
    else {
      return (
        <View>
          {
            <Text style={styles.textStyle}>You have yet to join a home</Text>
          }
        </View>
      );
    }
  }

  signOut = () => {
    AsyncStorage.multiRemove(['detailsStr', 'homeStr', 'userStr', 'roomStr', 'deviceStr', 'activationConditionStr', 'usersStr', 'roomsStr', 'devicesStr', 'activationConditionsStr']).then(() => {
      this.props.navigation.navigate("Login");
    });
  }

  render() {
    var { appUser } = this.state;

    return (
      <ScrollView>
        <View style={styles.container}>
          <Text style={styles.textStyle}>
            Hello, {appUser["FirstName"]}
          </Text>
          <View style={styles.container}>
            {this.showHomes()}
          </View>
          <Button primary text="Update User Details" onPress={() => {this.props.navigation.navigate('UpdateUser', back="MainPage")}}/>
          <Button primary text="Create New Home" onPress={() => { this.props.navigation.navigate("CreateHome") }} />
          <Button primary text="Join an existing Home" onPress={() => { this.props.navigation.navigate("JoinHome") }} />
          <Button primary text="Sign Out" onPress={ this.signOut } />
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
