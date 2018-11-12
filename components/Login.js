import React from 'react';
import { StyleSheet, Text, View, TextInput, AsyncStorage, ScrollView } from 'react-native';
import { Button, ThemeProvider, Card } from 'react-native-material-ui';

export default class Login extends React.Component {
  static navigationOptions = {
    title: 'Login',
  }

  constructor(props) {
    super(props);
    this.state = {
      userName: 'a',
      userPassword: '1',
      userList: [],
      homeList: [],
      resultMessage: '',
      language: 'abc'
    }
  }

  signIn = () => {
    debugger;
    const { userName, userPassword } = this.state;

    if (userName == '') {
      alert("Please enter your username and password");
      return;
    }

    var request = {
      userName,
      userPassword
    }

    fetch("http://ruppinmobile.tempdomain.co.il/SITE14/ComingHomeWS.asmx/Login", {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json;'
      }),
      body: JSON.stringify(request)
    })
      .then(res => res.json()) // קובע שהתשובה מהשרת תהיה בפורמט JSON
      .then((result) => { // no error in server
        let jsonData = JSON.parse(result.d);
        var details = {
          appUser: jsonData.AU,
          userList: jsonData.LU,
          homeList: jsonData.LH,
          allUserRoomsList: jsonData.LR,
          allUserDevicesList: jsonData.LD,
          allUserActivationConditionsList: jsonData.LActCon,
          resultMessage: jsonData.ResultMessage
        }

        var user = details.appUser;

        if (details.resultMessage == 'No Data') {
          alert("Invalid Username or Password. Please try again.");
          return;
        }

        var detailsStr = JSON.stringify(details);
        AsyncStorage.setItem('detailsStr', detailsStr).then(() => {
          var userStr = JSON.stringify(user);
          AsyncStorage.setItem('userStr', userStr).then(() => {
            this.props.navigation.navigate("MainPage");
          });
        });
      })
      .catch((error) => {
        alert("Login Error");
      });
  }

  render() {
    return (
      <ScrollView>
        <View style={styles.container}>
          <View style={{margin:5}}>
            <Text style={styles.textStyle}>Username</Text>
          </View>
          <View style={{margin:5, borderColor:'black', borderRadius:5, borderWidth:1}}>
            <TextInput style={styles.textInputStyle} name="userNameTxt" value={this.state.userName} placeholder="My Name" onChangeText={(userName) => this.setState({ userName })}></TextInput>
          </View>
          <View style={{margin:5}}>
            <Text style={styles.textStyle}>Password</Text>
          </View>
          <View style={{margin:5, borderColor:'black', borderRadius:5, borderWidth:1}}>
            <TextInput style={styles.textInputStyle} name="passwordTxt" value={this.state.userPassword} placeholder="My Password" onChangeText={(userPassword) => this.setState({ userPassword })}></TextInput>
          </View>
          <View style={{margin:5, backgroundColor:'lightblue', borderColor:'blue', borderRadius:50, borderWidth:1}}>
            <Button primary text="Sign In" onPress={this.signIn} />
          </View>
          <View style={{margin:5, backgroundColor:'lawngreen', borderColor:'green', borderRadius:50, borderWidth:1}}>
            <Button primary text="Sign Up" onPress={() => { this.props.navigation.navigate('Register') }} />
          </View> 
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height:'100%',
    backgroundColor: 'cyan',
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
