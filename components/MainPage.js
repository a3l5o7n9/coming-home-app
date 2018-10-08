import React from 'react';
import { StyleSheet, Text, View, Alert, TextInput, AsyncStorage, ScrollView } from 'react-native';
import { Button, ThemeProvider, Card } from 'react-native-material-ui';

export default class MainPage extends React.Component {
  static navigationOptions = {
    title: 'Main'
  }

  constructor(props) {
    super(props);

    this.state = {
      user: {
        UserId: '',
        UserName: '',
        UserPassword: '',
        FirstName: '',
        LastName: '',
        UserTypeName: '',
        Token: ''
      },
      userList: [],
      homeList: null
    }
  }

  componentDidMount = () => {
    AsyncStorage.getItem('detailsStr').then((value) => {
      details = JSON.parse(value);

      this.setState({
        user: details.user,
        userList: details.userList,
        homeList: details.homeList
      });
    });
  }

  showHomes = () => {
    if (this.state.homeList != null) {
      return (
        <View style={styles.container}>
          <Text style={styles.textStyle}>Your Homes</Text>
          {
            this.state.homeList.map((home, HomeId) => (
              <Button primary key={HomeId} text={home["HomeName"] + "\n" + home["Address"]} onPress={() => {
                let homeStr = JSON.stringify(home);
                AsyncStorage.setItem('homeStr', homeStr).then(() => {
                  this.props.navigation.navigate("Home");
                });
              }} />
            ))
          }
        </View>
      );
    }
    else {
      return (
        <View>
          {
            <Text style={styles.textStyle}>You have yet to join a home</Text>
          }
        </View>
      );
    }
  }

  render() {
    var { user } = this.state;

    return (
      <ScrollView>
        <View style={styles.container}>
          <Text style={styles.textStyle}>
            Hello, {user["FirstName"]}
          </Text>
          <View style={styles.container}>
            {this.showHomes()}
          </View>
          <Button primary text="Create New Home" onPress={() => { this.props.navigation.navigate("CreateHome") }} />
          <Button primary text="Join an existing Home" onPress={() => { this.props.navigation.navigate("JoinHome") }} />
          <Button primary text="Sign Out" onPress={() => { this.props.navigation.navigate('Login') }} />
        </View>
      </ScrollView>
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
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  textStyle: {
    fontSize: 20,
    alignItems: 'center',
  },
  textInputStyle: {
    fontSize: 25,
  }
});
