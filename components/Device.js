import React from 'react';
import { StyleSheet, Text, View, Alert, TextInput, AsyncStorage } from 'react-native';
import { Button, ThemeProvider, Card } from 'react-native-material-ui';

export default class Device extends React.Component
{
    constructor(props) {
        super(props);

        this.state = {
            user : {},
            home : {},
            device : {
                DeviceId : '',
                DeviceName : '',
                DeviceTypeName : ''
            }
        }
    }

    componentDidMount = () => {
        AsyncStorage.getItem('homeStr').then((value) => {
            home = JSON.parse(value);
  
            AsyncStorage.getItem('detailsStr').then((value) => {
                details = JSON.parse(value);
      
                AsyncStorage.getItem('deviceStr').then((value) => {
                    device = JSON.parse(value);
          
                    this.setState({
                      appUser : details.user,
                      home : home,
                      device : device
                  });
                });
            });
        });
    }

    render() {
        return(
            <View style={styles.container}>
                <Text style={{fontSize:30}}>Device</Text>
                <Text style={{fontSize:20}}>{this.state.device["DeviceName"]}</Text>
                <Button primary text="Back To Device List" onPress={ () => {this.props.navigation.navigate("Devices")}}/>
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
