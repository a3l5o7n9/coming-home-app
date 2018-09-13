import React from 'react';
import { StyleSheet, Text, View, Alert, TextInput, AsyncStorage } from 'react-native';
import { Button, ThemeProvider, Card } from 'react-native-material-ui';

export default class Home extends React.Component
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

    render()
    {
        let user = this.state.user;
        let home = this.state.home;
        return(
            <View style={styles.container}>
                <Text style={{fontSize:30}}>{this.state.home["HomeName"]}</Text>
                <Text style={{fontSize:20}}>
                    Hello, {this.state.user["FirstName"]}
                </Text>
                <View style={{flex:1, width: '100%', height: '100%', flexDirection:'row', justifyContent:'space-around', flexWrap:'wrap'}}>
                    <View style={{width: '40%', height: 100, margin:10, backgroundColor: 'powderblue', flexWrap:'wrap', alignContent:'center'}}>
                        <Button primary text="Rooms" onPress={ () => {this.props.navigation.navigate("Rooms")}}/>
                    </View>
                    <View style={{width: '40%', height: 100, margin:10, backgroundColor: 'skyblue', flexWrap:'wrap'}}>
                        <Button primary text="Devices" onPress={ () => {this.props.navigation.navigate('Devices')}}/>
                    </View>
                    <View style={{width: '40%', height: 100, margin:10, backgroundColor: 'steelblue', flexWrap:'wrap'}}>
                        <Button primary text="Users" onPress={ () => {this.props.navigation.navigate("Users")}}/>
                    </View>
                    <View style={{width: '40%', height: 100, margin:10, backgroundColor:'blue', flexWrap:'wrap'}}>
                        <Button primary text="Activation Conditions" onPress={ () => {this.props.navigation.navigate("ActivationConditions")}}/>
                    </View>
                </View>   
            </View>
        );
    }
}

{/* <View style={{justifyContent : 'space-around'}}>
<View style={{flex: 1, flexDirection:'column', justifyContent:'space-around'}}>
  <View style={{flex: 1, flexDirection: 'row', justifyContent:'space-around'}}>
    <View style={{width: 50, height: 50, backgroundColor: 'powderblue', justifyContent:'space-around'}} />
    <View style={{width: 50, height: 50, backgroundColor: 'skyblue', justifyContent:'space-around'}} />
  </View>
</View>
<View style={{flex: 1, flexDirection:'column', justifyContent:'space-around'}}>
  <View style={{flex: 1, flexDirection: 'row', justifyContent:'space-around'}}>
    <View style={{width: 50, height: 50, backgroundColor: 'steelblue', justifyContent:'space-around'}} />
    <View style={{width: 50, height: 50, backgroundColor:'blue', justifyContent:'space-around'}}/>
  </View>
</View>
</View> */}


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
