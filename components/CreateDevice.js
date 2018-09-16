import React from 'react';
import { StyleSheet, Text, View, Alert, TextInput, AsyncStorage } from 'react-native';
import { Button, ThemeProvider, Card } from 'react-native-material-ui';

export default class CreateDevice extends React.Component
{
    constructor(props) {
        super(props);

        this.state={
            user : {},
            home : {},
            room : {},
            deviceName : '',
            deviceTypeName : '',
            isDividedIntoRooms : ''
        }
    }

    componentDidMount = () => {
        AsyncStorage.getItem('roomStr').then((value) => {
            room = JSON.parse(value);
            
            AsyncStorage.getItem('homeStr').then((value) => {
                home = JSON.parse(value);
    
                AsyncStorage.getItem('detailsStr').then((value) => {
                    details = JSON.parse(value);
        
                    this.setState({
                    user : details.user,
                    home : home,
                    room : room
                });
            });
        });
    });
    }

    createRoom = () => {
        const userId = this.state.user['UserId'];
        const homeId = this.state.home['HomeId'];
        const roomId = this.state.room['RoomId'];
        const {deviceName, deviceTypeName, isDividedIntoRooms} = this.state;

        if (deviceName == '' || deviceTypeName == '' || (isDividedIntoRooms != 'true' && isDividedIntoRooms != 'false'))
        {
            alert("Creating a device requires a device name, a device type name, and an indication if it is divided into rooms.");
            return;
        }

        var request = {
            deviceName,
            homeId,
            deviceTypeName,
            isDividedIntoRooms,
            userId,
            roomId
        }

        fetch("http://ruppinmobile.tempdomain.co.il/SITE14/ComingHomeWS.asmx/CreateDevice", {
            method: 'POST',
            headers: new Headers({
                'Content-Type': 'application/json;'
            }),
            body: JSON.stringify(request)
        })
            .then(res => res.json()) // קובע שהתשובה מהשרת תהיה בפורמט JSON
            .then((result) => { // no error in server
                const deviceId = JSON.parse(result.d);
                
                switch(deviceId)
                {
                    case -1:
                    {
                        alert("There is already a device with that name in this home. Use a different device name.");
                        break;
                    }
                    default:
                    {
                        var device =
                        {
                            DeviceId : deviceId,
                            DeviceName : deviceName,
                            DeviceTypeName : deviceTypeName,
                            HomeId : homeId,
                            IsDividedIntoRooms : isDividedIntoRooms,
                            RoomId : roomId
                        }

                        let deviceStr = JSON.stringify(device);

                        AsyncStorage.setItem('deviceStr', deviceStr).then(() =>
                        { console.log("deviceStr");
                            AsyncStorage.getItem('deviceStr').then((value) => {
                                console.log('deviceStr = ' + value);
                            });
                            this.props.navigation.navigate("Device");
                        });        
                        break;
                    }
                }      
            })
            .catch((error) => {
               alert('A connection error has occurred.');
            });
    }  

    render() {
        return(
            <View style={styles.container}>
                <Text style={{fontSize:30}}>Create Device</Text>
                <Text style={styles.textStyle}>Device Name</Text>
                <TextInput style={styles.textInputStyle} value={this.state.deviceName} placeholder="Device Name" onChangeText={(deviceName) => this.setState({deviceName})}></TextInput>
                <Text style={styles.textStyle}>Device Type Name</Text>
                <TextInput style={styles.textInputStyle} value={this.state.deviceTypeName} placeholder="" onChangeText={(deviceTypeName) => this.setState({deviceTypeName})}></TextInput>
                <Text style={styles.textStyle}>Is Divided Into Rooms?(true/false)</Text>
                <TextInput style={styles.textInputStyle} value={this.state.isDividedIntoRooms} placeholder="false" onChangeText={(isDividedIntoRooms) => this.setState({isDividedIntoRooms})}></TextInput>
                <Button primary text="Create" onPress={this.createDevice} />
                <Button primary text="Cancel" onPress={() => {this.props.navigation.navigate("Devices")}}/>
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
