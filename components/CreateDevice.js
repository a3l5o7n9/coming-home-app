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
            deviceTypeName : ''
        }
    }

    render() {
        var {user, home, room} = this.state;
        return(
            <View style={styles.container}>
                    <Text style={{fontSize:30}}>Create Device</Text>
                    <Text style={styles.textStyle}>Device Name</Text>
                    <TextInput style={styles.textInputStyle} value={this.state.deviceName} placeholder="Device Name" onChangeText={(deviceName) => this.setState({deviceName})}></TextInput>
                    <Text style={styles.textStyle}>Device Type Name</Text>
                    <TextInput style={styles.textInputStyle} value={this.state.deviceTypeName} placeholder="" onChangeText={(deviceTypeName) => this.setState({deviceTypeName})}></TextInput>
                    <Button primary text="Create" onPress={this.createDevice} />
                    <Button primary text="Cancel" onPress={() => {this.props.navigation.navigate("Devices", {user, home, room})}}/>
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
