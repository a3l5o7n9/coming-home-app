import React from 'react';
import { StyleSheet, Text, View, Alert, TextInput, AsyncStorage } from 'react-native';
import { Button, ThemeProvider, Card } from 'react-native-material-ui';

export default class Devices extends React.Component
{
    constructor(props)
    {
        super(props);

        this.state = {
            user : {},
            home : {},
            deviceList : []
        }
    }

    componentDidMount = () => {
        AsyncStorage.getItem('homeStr').then((value) => {
            home = JSON.parse(value);
  
            AsyncStorage.getItem('detailsStr').then((value) => {
                details = JSON.parse(value);
      
                AsyncStorage.getItem('devicesStr').then((value) => {
                    devices = JSON.parse(value);
          
                    this.setState({
                      user : details.user,
                      home : home,
                      deviceList : devices.deviceList
                  });
                });
            });
        });
    }

    showRooms = () => {
        if (this.state.deviceList != null)
        {
            return ( 
                <View style={styles.container}>
                    <Text style={styles.textStyle}>Your Devices</Text>
                    {
                        this.state.deviceList.map((device, DeviceId) => (
                        <Button primary key={DeviceId} text={device["DeviceName"] + "\n" + device["DeviceTypeName"]} onPress={ () => {
                            let deviceStr = JSON.stringify(device);
                            AsyncStorage.setItem('deviceStr', deviceStr).then(() =>
                            { 
                                AsyncStorage.getItem('deviceStr').then((value) => 
                                {
                                    console.log('deviceStr = ' + value);
                                });
                                this.props.navigation.navigate("Device");
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
                        <Text style={styles.textStyle}>There are no devices in your home that you have access to</Text>
                    }
                </View>
            );
        }
    }

    render() {
        return(
            <View style={styles.container}>
                <Text style={{fontSize:30}}>Devices</Text>
                <View style={styles.container}>
                    {this.showDevices()}
                </View>
                <Button primary text="Add New Device" onPress={() => {this.props.navigation.navigate("CreateDevice")}}/>
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
