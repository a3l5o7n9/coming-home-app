import React from 'react';
import { StyleSheet, Text, View, Alert, TextInput, AsyncStorage } from 'react-native';
import { Button, ThemeProvider, Card } from 'react-native-material-ui';

export default class JoinHome extends React.Component
{
    constructor(props)
    {
        super(props);

        this.state = {
            user : {
                UserId : '',
                UserName : '',
                UserPassword : '',
                FirstName : '',
                LastName : '',
                UserTypeName : '',
                Token : ''
            },
            homeName : '',
            address : '',
        }
    }

    componentDidMount = () => {
        AsyncStorage.getItem('detailsStr').then((value) => {
          details = JSON.parse(value);

          this.setState({
            user : details.user,
        });
        });
    }

    joinHome = () => {
        const userId = this.state.user['UserId'];
        const {homeName, address} = this.state;

        if (homeName == '' || address == '')
        {
            alert("Both a name and an address are required in order to join an existing home.");
            return;
        }

        var request = {
            userId,
            homeName,
            address
        }

        fetch("http://ruppinmobile.tempdomain.co.il/SITE14/ComingHomeWS.asmx/JoinHome", {
            method: 'POST',
            headers: new Headers({
                'Content-Type': 'application/json;'
            }),
            body: JSON.stringify(request)
        })
            .then(res => res.json()) // קובע שהתשובה מהשרת תהיה בפורמט JSON
            .then((result) => { // no error in server
                var jsonData = JSON.parse(result.d);
                var homeDetails = {
                    home : jsonData.H,
                    resultMessage : jsonData.ResultMessage
                }
                
                if (homeDetails.resultMessage == 'Home Not Found' || homeDetails.resultMessage == 'User is already registered as a member of this home')
                {
                    alert(homeDetails.resultMessage);
                    return;
                }

                let home = homeDetails.home;

                let homeStr = JSON.stringify(home);

                AsyncStorage.setItem('homeStr', homeStr).then(() =>
                { console.log("homeStr");
                    AsyncStorage.getItem('homeStr').then((value) => {
                        console.log('homeStr = ' + value);
                    });
                    this.props.navigation.navigate("Home");
                });               
            })
            .catch((error) => {
               alert('A connection error has occurred.');
            });
    }  

    render() {
        return(
            <View style={styles.container}>
                <Text style={{fontSize:30}}>Join Home</Text>
                <Text style={styles.textStyle}>Home Name</Text>
                <TextInput style={styles.textInputStyle} value={this.state.homeName} placeholder="Home Name" onChangeText={(homeName) => this.setState({homeName})}></TextInput>
                <Text style={styles.textStyle}>Address</Text>
                <TextInput style={styles.textInputStyle} value={this.state.address} placeholder="Address" onChangeText={(address) => this.setState({address})}></TextInput>
                <Button primary text="Create" onPress={this.joinHome} />
                <Button primary text="Cancel" onPress={() => {this.props.navigation.navigate("MainPage")}}/>
            </View>
        )
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
