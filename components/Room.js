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
            room : {
                RoomId : '',
                RoomName : '',
                RoomTypeName : ''
            }
        }
    }

    componentDidMount = () => {
        AsyncStorage.getItem('homeStr').then((value) => {
            home = JSON.parse(value);
  
            AsyncStorage.getItem('detailsStr').then((value) => {
                details = JSON.parse(value);
      
                AsyncStorage.getItem('roomStr').then((value) => {
                    room = JSON.parse(value);
          
                    this.setState({
                      appUser : details.user,
                      home : home,
                      room : room
                  });
                });
            });
        });
    }

    render() {
        return(
            <View style={styles.container}>
                <Text style={{fontSize:30}}>Room</Text>
                <Text style={{fontSize:25}}>{this.state.room["RoomName"]}</Text>
                <Button primary text="Back to Room List" onPress={() => {this.props.navigation.navigate("Rooms")}}/>
                <Button primary text="Add New Room" onPress={() => {this.props.navigation.navigate("CreateRoom")}}/>
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
