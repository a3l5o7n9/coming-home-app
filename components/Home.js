import React from 'react';
import { StyleSheet, Text, View, Alert, TextInput } from 'react-native';
import { Button, ThemeProvider, Card } from 'react-native-material-ui';

export default class Home extends React.Component
{
    constructor(props)
    {
        super(props);

        let {details} = props.navigation.state.params;
        let {user} = details;
        let {userList} = details;
        let {homeList} = details;

        this.state = {
            user : user,
            userList : userList,
            homeList : homeList
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
                        {
                            this.state.homeList.map((home, HomeId) => (
                               <Text>{home["HomeName"]} {home["Address"]}</Text>
                            ))
                        }
                    </View>
                    <Button primary text="Sign Out" onPress={ () => {this.props.navigation.navigate('Login')}}/>
                </View>
            // </ThemeProvider>
        );
    }
}