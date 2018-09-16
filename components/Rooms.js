import React from 'react';
import { StyleSheet, Text, View, Alert, TextInput, AsyncStorage } from 'react-native';
import { Button, ThemeProvider, Card } from 'react-native-material-ui';

export default class Rooms extends React.Component
{
    constructor(props)
    {
        super(props);

        this.state = {
            user : {},
            home : {},
            roomList : []
        }
    }

    componentDidMount = () => {
        AsyncStorage.getItem('homeStr').then((value) => {
            home = JSON.parse(value);
  
            AsyncStorage.getItem('detailsStr').then((value) => {
                details = JSON.parse(value);
      
                AsyncStorage.getItem('roomsStr').then((value) => {
                    rooms = JSON.parse(value);
          
                    this.setState({
                      user : details.user,
                      home : home,
                      roomList : rooms.roomList
                  });
                });
            });
        });
    }

    showRooms = () => {
        if (this.state.roomList != null)
        {
            return ( 
                <View style={styles.container}>
                    <Text style={styles.textStyle}>Your Rooms</Text>
                    {
                        this.state.roomList.map((room, RoomId) => (
                        <Button primary key={RoomId} text={room["RoomName"] + "\n" + room["RoomTypeName"]} onPress={ () => {
                            let roomStr = JSON.stringify(room);
                            AsyncStorage.setItem('roomStr', roomStr).then(() =>
                            { 
                                AsyncStorage.getItem('roomStr').then((value) => 
                                {
                                    console.log('roomStr = ' + value);
                                });
                                this.props.navigation.navigate("Room");
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
                        <Text style={styles.textStyle}>There are no rooms in your home that you have access to</Text>
                    }
                </View>
            );
        }
    }

    render() {
        return(
            <View style={styles.container}>
                <Text style={{fontSize:30}}>Rooms</Text>
                <View style={styles.container}>
                    {this.showRooms()}
                </View>
                <Button primary text="Add New Room" onPress={() => {this.props.navigation.navigate("CreateRoom")}}/>
                <Button primary text="Home" onPress={() => {this.props.navigation.navigate("Home")}}/>
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
