import React from 'react';
import { StyleSheet, Text, View, Alert, TextInput, AsyncStorage} from 'react-native';
import { Button, ThemeProvider, Card } from 'react-native-material-ui';

export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userName: '',
            userPassword: '',
            userList : [],
            homeList : [],
            resultMessage : ''
        }
    }

    signIn = () => {
        debugger;
        const { userName, userPassword } = this.state;

        if (userName == '')
        {
            Alert.alert("Please enter your username and password");
            return;
        }

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
                    user : jsonData.AU,
                    userList : jsonData.LU,
                    homeList : jsonData.LH,
                    resultMessage : jsonData.ResultMessage
                }
                    
            console.log(details);

            if (details.resultMessage == 'No Data')
            {
                alert("Invalid Username or Password. Please try again.");
                return;
            }

            let detailsStr = JSON.stringify(details);
            AsyncStorage.setItem('detailsStr', detailsStr).then(() =>
               {
               AsyncStorage.getItem('detailsStr').then((value) => {
                    console.log('detailsStr = ' + value);
               });
               this.props.navigation.navigate("MainPage");
            });        
        })
        .catch((error) => {
            alert("Login Error");
        });
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={{fontSize:30}}>Login</Text>
                <Text style={styles.textStyle}>Username</Text>  
                <TextInput style={styles.textInputStyle} name="userNameTxt" value={this.state.userName} placeholder="My Name" onChangeText={(userName) => this.setState({userName})}></TextInput>  
                <Text style={styles.textStyle}>Password</Text>    
                <TextInput style={styles.textInputStyle} name="passwordTxt" value={this.state.userPassword} placeholder="My Password" onChangeText={(userPassword) => this.setState({userPassword})}></TextInput>   
                <Button primary text="Sign In" onPress={this.signIn} /> 
                <Button primary text="Sign Up" onPress={ () => {this.props.navigation.navigate('Register')}} />       
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        marginTop:20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textStyle: {
        fontSize:20,
        alignItems: 'center',
    },
    textInputStyle: { 
        fontSize:25,
    }
});
