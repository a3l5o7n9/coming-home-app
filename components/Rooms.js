import React from 'react';
import { StyleSheet, Text, View, Alert, TextInput } from 'react-native';
import { Button, ThemeProvider, Card } from 'react-native-material-ui';

export default class Rooms extends React.Component
{
    constructor(props)
    {
        super(props);

        this.state = {
            user : props.navigation.state.params.user,
            home : props.navigation.state.params.home
        }
    }

    render() {
        let user = this.state.user;
        let home = this.state.home;
        return(
            <View>
                <Text>Rooms</Text>
                <Button primary text="Home" onPress={() => {this.props.navigation.navigate("Home", {user, home})}}/>
            </View>
        )
    }
}