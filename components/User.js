import React from 'react';
import { StyleSheet, Text, View, Alert, TextInput, AsyncStorage } from 'react-native';
import { Button, ThemeProvider, Card } from 'react-native-material-ui';

export default class User extends React.Component
{
    constructor(props) {
        super(props);

        this.state = {
            appUser : {},
            home : {},
            user : {}
        }
    }

    componentDidMount = () => {
        AsyncStorage.getItem('homeStr').then((value) => {
            home = JSON.parse(value);
  
            AsyncStorage.getItem('detailsStr').then((value) => {
                details = JSON.parse(value);
      
                AsyncStorage.getItem('userStr').then((value) => {
                    user = JSON.parse(value);
          
                    this.setState({
                      appUser : details.user,
                      home : home,
                      user : user
                  });
                });
            });
        });
    }

    render() {
        return(
            <View style={style.container}>
                <Text style={{fontSize:30}}>User</Text>
                <Text style={{fontSize:20}}>{this.state.user["UserName"]}</Text>
                <Button primary text="Users" onPress={ () => {this.props.navigation.navigate("Users")}}/>
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
