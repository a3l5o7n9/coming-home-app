import React from 'react';
import { StyleSheet, Text, View, Alert, TextInput} from 'react-native';
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
        const {userName, userPassword, confirmPassword, firstName, lastName} = this.state;

        if (userPassword != confirmPassword)
        {
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
                switch(userId)
                {
                    case -1:
                    {
                        alert("User could not be created. Use a different username.");
                        break;
                    }
                    default:
                    {
                        let details = {
                            user = {
                                userId,
                                userName,
                                userPassword,
                                firstName,
                                lastName  
                            },
                            userList = {
                                user : user
                            },
                            homeList = {
                                home : {
                                    HomeId : "",
                                    HomeName : "",
                                    Address : "" 
                                }
                            }
                        }
                        this.props.navigation.navigate('Home', {details});
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
            //   <ThemeProvider>
                <View>
                    <Card>
                        <Text>Registration</Text>
                        <Text>Username</Text>
                        <TextInput value={this.state.userName} placeholder="Username" onChangeText={(userName) => this.setState({userName})}></TextInput>
                        <Text>Password</Text>
                        <TextInput value={this.state.userPassword} placeholder="Password" onChangeText={(userPassword) => this.setState({userPassword})}></TextInput>
                        <Text>Confirm Password</Text>
                        <TextInput value={this.state.confirmPassword} placeholder="Confirm Password" onChangeText={(confirmPassword) => this.setState({confirmPassword})}></TextInput>
                        <Text>First Name</Text>
                        <TextInput value={this.state.firstName} placeholder="First Name" onChangeText={(firstName) => this.setState({firstName})}></TextInput>
                        <Text>Last Name</Text>
                        <TextInput value={this.state.lastName} placeholder="Last Name" onChangeText={(lastName) => this.setState({lastName})}></TextInput>
                        <Button primary text="Submit" onPress={this.submit} />
                        <Button primary text="Login" onPress={() => {this.props.navigation.navigate('Login')}}/>
                    </Card>
                </View>
            //   </ThemeProvider>

        );
    }
}