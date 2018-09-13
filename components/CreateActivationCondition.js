import React from 'react';
import { StyleSheet, Text, View, Alert, TextInput, AsyncStorage } from 'react-native';
import { Button, ThemeProvider, Card } from 'react-native-material-ui';

export default class CreateActivationCondition extends React.Component
{
    constructor(props) {
        super(props);

        this.state={
            user : {},
            home : {},
            room : {},
            deviceName : '',
            deviceTypeName : ''
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
        return(
            <View style={styles.container}>
                <Text style={{fontSize:30}}>Create Activation Condition</Text>
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
