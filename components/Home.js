import React from 'react';
import { StyleSheet, Text, View, Alert, TextInput } from 'react-native';
import { Button, ThemeProvider, Card } from 'react-native-material-ui';

export default class Home extends React.Component
{
    constructor(props)
    {
        super(props);

        this.state = {
            user : props.navigation.state.params.user,
            home : props.navigation.state.params.home
        }
    }

    // showHomes = () => {
    //     if (this.state.homeList != null)
    //     {
    //         return ( 
    //             <View>
    //                 <Text>Your Homes</Text>
    //                 {
    //                     this.state.homeList.map((home, HomeId) => (
    //                     <Text>{home["HomeName"]} {home["Address"]}</Text>
    //                     ))
    //                 }
    //             </View>
    //         );
    //     }
    //     else
    //     {
    //         return (
    //             <View>
    //                 {
    //                     <Text>You have yet to join a home</Text>
    //                 }
    //             </View>
    //         );
    //     }
    // }

    // GetItemList = () => {
    //     let itemsList = []
        
    //     this.state.items.forEach((item, index) => {
    //         itemsList.push(<Text>{item.Picture} {item.ItemName} {item.PriceILS}</Text>)
    //     });
    // }

    render()
    {
        let user = this.state.user;
        let home = this.state.home;
        return(
            // <ThemeProvider>
                <View>
                    <Text>{this.state.home["HomeName"]}</Text>
                    <Text>
                        Hello, {this.state.user["FirstName"]}
                    </Text>
                    <Button primary text="Rooms" onPress={ () => {this.props.navigation.navigate("Rooms", {user, home})}}/>
                    <Button primary text="Devices" onPress={ () => {this.props.navigation.navigate('Devices', {user, home})}}/>
                    <Button primary text="Users" onPress={ () => {this.props.navigation.navigate("Users", {user, home})}}/>
                </View>
            // </ThemeProvider>
        );
    }
}