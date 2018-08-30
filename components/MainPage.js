import React from 'react';
import { StyleSheet, Text, View, Alert, TextInput } from 'react-native';
import { Button, ThemeProvider, Card } from 'react-native-material-ui';

export default class MainPage extends React.Component
{
    constructor(props)
    {
        super(props);

        let {details} = props.navigation.state.params;

        this.state = {
            user : details.user,
            userList : details.userList,
            homeList : details.homeList
        }
    }

    showHomes = () => {
        if (this.state.homeList != null)
        {
            let user = this.state.user;
            return ( 
                <View>
                    <Text>Your Homes</Text>
                    {
                        this.state.homeList.map((home, HomeId) => (
                        <Button primary key={HomeId} text={home["HomeName"] + " " + home["Address"]} onPress={ () => {this.props.navigation.navigate("Home", {user, home})}}/> 
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
                        <Text>You have yet to join a home</Text>
                    }
                </View>
            );
        }
    }

    // GetItemList = () => {
    //     let itemsList = []
        
    //     this.state.items.forEach((item, index) => {
    //         itemsList.push(<Text>{item.Picture} {item.ItemName} {item.PriceILS}</Text>)
    //     });
    // }

    render()
    {
        return(
            // <ThemeProvider>
                <View>
                    <Text>Home</Text>
                    <Text>
                        Hello, {this.state.user["FirstName"]}
                    </Text>
                    <View>
                        {this.showHomes()}
                        {/* {
                            this.state.homeList.map((home, HomeId) => (
                               <Text>{home["HomeName"]} {home["Address"]}</Text>
                            ))
                        } */}
                    </View>
                    <Button primary text="Sign Out" onPress={ () => {this.props.navigation.navigate('Login')}}/>
                </View>
            // </ThemeProvider>
        );
    }
}