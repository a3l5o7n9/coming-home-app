import React from 'react';
import { StyleSheet, Text, View, Alert, TextInput, AsyncStorage } from 'react-native';
import { Button, ThemeProvider, Card } from 'react-native-material-ui';

export default class CreateRoom extends React.Component
{
    constructor(props) {
        super(props);

        this.state = {
            user : {},
            home : {},
            roomName : '',
            roomTypeName : ''
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

    createRoom = () => {
        const homeId = this.state.home['HomeId'];
        const {roomName, roomTypeName} = this.state;

        if (roomName == '' || roomTypeName == '')
        {
            alert("Both a name and a room type are required to create a room.");
            return;
        }

        var request = {
            roomName,
            homeId,
            roomTypeName
        }

        fetch("http://ruppinmobile.tempdomain.co.il/SITE14/ComingHomeWS.asmx/CreateRoom", {
            method: 'POST',
            headers: new Headers({
                'Content-Type': 'application/json;'
            }),
            body: JSON.stringify(request)
        })
            .then(res => res.json()) // קובע שהתשובה מהשרת תהיה בפורמט JSON
            .then((result) => { // no error in server
                const roomId = JSON.parse(result.d);
                
                switch(roomId)
                {
                    case -1:
                    {
                        alert("There is already a room with that name in this home. Use a different room name.");
                        break;
                    }
                    default:
                    {
                        var user = this.state.user;
                        var home = this.state.home;
                        var room = {
                            RoomId : roomId,
                            RoomName : roomName,
                            RoomTypeName : roomTypeName,
                            HomeId : homeId
                        }

                        this.props.navigation.navigate('Room', {user, home, room});
                        break;
                    }
                }      
            })
            .catch((error) => {
               alert('A connection error has occurred.');
            });
    }  

    render() {
        var {user, home} = this.state;
        return(
            <View style={styles.container}>
                <Text style={{fontSize:30}}>Create Home</Text>
                <Text style={styles.textStyle}>Room Name</Text>
                <TextInput style={styles.textInputStyle} value={this.state.roomName} placeholder="Room Name" onChangeText={(roomName) => this.setState({roomName})}></TextInput>
                <Text style={styles.textStyle}>Room Type Name</Text>
                <TextInput style={styles.textInputStyle} value={this.state.roomTypeName} placeholder="" onChangeText={(roomTypeName) => this.setState({roomTypeName})}></TextInput>
                <Button primary text="Create" onPress={this.createRoom} />
                <Button primary text="Cancel" onPress={() => {this.props.navigation.navigate("Home", {user, home})}}/>
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
