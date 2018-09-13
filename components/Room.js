import React from 'react';
import { StyleSheet, Text, View, Alert, TextInput, AsyncStorage } from 'react-native';
import { Button, ThemeProvider, Card } from 'react-native-material-ui';

export default class Room extends React.Component
{
    constructor(props) {
        super(props);

        this.state = {
            user : {},
            home : {},
            room : {}
        }
    }

    render() {
        let {user, home, room} = this.state;
        return(
            <View style={styles.container}>
                <Text style={{fontSize:30}}>Room</Text>
                <Text style={{fontSize:25}}>{this.state.room["RoomName"]}</Text>
                <Button primary text="Back to Room List" onPress={() => {this.props.navigation.navigate("Rooms", {user, home})}}/>
                <Button primary text="Add New Device" onPress={() => {this.props.navigation.navigate("CreateDevice", {user, home, room})}}/>
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
