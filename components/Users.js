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
            home : {}
        }
    }

    componentDidMount = () => {
        AsyncStorage.getItem('homeStr').then((value) => {
            home = JSON.parse(value);
  
            AsyncStorage.getItem('detailsStr').then((value) => {
                details = JSON.parse(value);
      
                this.setState({
                  user : details.user,
                  home : home
              });
            });
        });
    }

    render() {
        let user = this.state.user;
        let home = this.state.home;
        return(
            <View>
                <Text>Users</Text>
                <Button primary text="Home" onPress={() => {this.props.navigation.navigate("Home")}}/>
            </View>
        );
    }
}