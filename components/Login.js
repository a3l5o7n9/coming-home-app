import React from 'react';
import { StyleSheet, Text, View, TextInput, AsyncStorage, ScrollView} from 'react-native';
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
          user: jsonData.AU,
          userList: jsonData.LU,
          homeList: jsonData.LH,
          resultMessage: jsonData.ResultMessage
        }

        if (details.resultMessage == 'No Data') {
          alert("Invalid Username or Password. Please try again.");
          return;
        }

        var detailsStr = JSON.stringify(details);
        AsyncStorage.setItem('detailsStr', detailsStr).then(() => {
          this.props.navigation.navigate("MainPage");
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
          <Text style={styles.textStyle}>Username</Text>
          <TextInput style={styles.textInputStyle} name="userNameTxt" value={this.state.userName} placeholder="My Name" onChangeText={(userName) => this.setState({ userName })}></TextInput>
          <Text style={styles.textStyle}>Password</Text>
          <TextInput style={styles.textInputStyle} name="passwordTxt" value={this.state.userPassword} placeholder="My Password" onChangeText={(userPassword) => this.setState({ userPassword })}></TextInput>
          <Button primary text="Sign In" onPress={this.signIn} />
          <Button primary text="Sign Up" onPress={() => { this.props.navigation.navigate('Register') }} />
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
