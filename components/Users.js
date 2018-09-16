import React from 'react';
import { StyleSheet, Text, View, Alert, TextInput, AsyncStorage } from 'react-native';
import { Button, ThemeProvider, Card } from 'react-native-material-ui';

export default class Users extends React.Component
{
    constructor(props)
    {
        super(props);

        this.state = {
            user : {},
            home : {},
            userList : []
        }
    }

    componentDidMount = () => {
        AsyncStorage.getItem('homeStr').then((value) => {
            home = JSON.parse(value);
  
            AsyncStorage.getItem('detailsStr').then((value) => {
                details = JSON.parse(value);
      
                AsyncStorage.getItem('usersStr').then((value) => {
                    users = JSON.parse(value);
          
                    this.setState({
                      user : details.user,
                      home : home,
                      userList : users.userList
                  });
                });
            });
        });
    }

    showUsers = () => {
        if (this.state.userList != null)
        {
            return ( 
                <View style={styles.container}>
                    <Text style={styles.textStyle}>Your Home Members</Text>
                    {
                        this.state.userList.map((user, UserId) => (
                        <Button primary key={UserId} text={user["UserName"] + "\n" + user["FirstName"] + " " + user["LastName"]} onPress={ () => {
                            let userStr = JSON.stringify(user);
                            AsyncStorage.setItem('userStr', userStr).then(() =>
                            { 
                                AsyncStorage.getItem('userStr').then((value) => 
                                {
                                    console.log('userStr = ' + value);
                                });
                                this.props.navigation.navigate("User");
                            });        
                        }}/> 
                        ))
                    }
                </View>
            );
        }
        else
        {
            return (
                <View>
                    {
                        <Text style={styles.textStyle}>There are no other users in your home</Text>
                    }
                </View>
            );
        }
    }

    render() {
        return(
            <View style={styles.container}>
                <Text style={{fontSize:30}}>Users</Text>
                <View style={styles.container}>
                    {this.showUsers()}
                </View>
                <Button primary text="Home" onPress={() => {this.props.navigation.navigate("Home")}}/>
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
