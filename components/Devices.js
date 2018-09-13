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
        let room = {
            RoomId : 0,
            RoomName : '',
            HomeId : home.HomeId,
            RoomTypeName : '' 
        }
        return(
            <View style={styles.container}>
                <Text style={{fontSize:30}}>Devices</Text>
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
