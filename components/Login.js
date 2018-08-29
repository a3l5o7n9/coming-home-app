import React from 'react';
import { StyleSheet, Text, View, Alert, TextInput} from 'react-native';
import { Button, ThemeProvider, Card } from 'react-native-material-ui';

export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userName: '',
            userPassword: '',
            users : [],
            homes : []
        }
    }

    signIn = () => {
        debugger;
        const { userName, userPassword } = this.state;

        var request = {
            userName,
            userPassword
        }
        //Alert.alert(JSON.stringify(request));
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
            let details = {
                user : jsonData.U,
                userList : jsonData.LU,
                homeList : jsonData.LH
            }
            this.props.navigation.navigate("Home", {details});
        })
        .catch((error) => {
            alert("Login Error");
        });
    }

    render() {
        return (
            // <ThemeProvider>
                <View>
                  <Card>
                    <Text>Login</Text>
                    <Text>Username</Text>
                    <TextInput name="userNameTxt" value={this.state.userName} placeholder="My Name" onChangeText={(userName) => this.setState({userName})}></TextInput>
                    <Text>Password</Text>
                    <TextInput name="passwordTxt" value={this.state.userPassword} placeholder="My Password" onChangeText={(userPassword) => this.setState({userPassword})}></TextInput>
                    <Button primary text="Sign In" onPress={this.signIn} />
                    <Button primary text="Sign Up" onPress={ () => {this.props.navigation.navigate('Register')}} />
                  </Card>
                </View>
            // </ThemeProvider>
        );
    }
}

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#fff',
//         alignItems: 'center',
//         justifyContent: 'center',
//     },
// });
