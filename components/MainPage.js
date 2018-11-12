import React from 'react';
import { StyleSheet, Text, View, AsyncStorage, ScrollView } from 'react-native';
import { Button, ThemeProvider, Card } from 'react-native-material-ui';

export default class MainPage extends React.Component {
  static navigationOptions = {
    title: 'Main'
  }

  constructor(props) {
    super(props);

    this.state = {
      appUser: {
        UserId: '',
        UserName: '',
        UserPassword: '',
        FirstName: '',
        LastName: '',
        Token: ''
      },
      userList: null,
      homeList: null
    }
  }

  componentDidMount = () => {
    AsyncStorage.getItem('detailsStr').then((value) => {
      details = JSON.parse(value);
      this.setState({
        appUser: details.appUser,
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
              <View key={HomeId} style={{borderColor:'cyan', borderRadius:10, borderWidth:5, backgroundColor:'lightcyan', flex: 1, flexDirection:'row', alignItems: 'center' }}>
                <Button primary text={home["HomeName"] + "\n" + home["Address"]} onPress={() => {
                  let homeStr = JSON.stringify(home);
                  AsyncStorage.setItem('homeStr', homeStr).then(() => {
                    this.props.navigation.navigate("Home");
                  });
                }} />
              </View>
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

  signOut = () => {
    AsyncStorage.multiRemove(['detailsStr', 'homeStr', 'userStr', 'roomStr', 'deviceStr', 'activationConditionStr', 'usersStr', 'roomsStr', 'devicesStr', 'activationConditionsStr']).then(() => {
      this.props.navigation.navigate("Login");
    });
  }

  render() {
    var { appUser } = this.state;

    return (
      <ScrollView>
        <View style={styles.container}>
          <Text style={styles.textStyle}>
            Hello, {appUser["FirstName"]}
          </Text>
          <View>
            {this.showHomes()}
          </View>
          <View style={styles.updateButtonStyle}>
            <Button primary text="Update User Details" onPress={() => { this.props.navigation.navigate('UpdateUser', back = "MainPage") }} />
          </View>
          <View style={styles.createButtonStyle}>
            <Button primary text="Create New Home" onPress={() => { this.props.navigation.navigate("CreateHome") }} />
          </View>
          <View style={styles.joinButtonStyle}>
            <Button primary text="Join an existing Home" onPress={() => { this.props.navigation.navigate("JoinHome") }} />
          </View>
          <View style={styles.signOutButtonStyle}>
            <Button primary text="Sign Out" onPress={this.signOut} />
          </View>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width:'100%',
    backgroundColor: 'mediumpurple',
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
  },
  updateButtonStyle: {
    margin:5,
    backgroundColor:'lightgrey',
    borderColor:'silver',
    borderRadius:50,
    borderWidth:1
  },
  createButtonStyle: {
    margin:5,
    backgroundColor:'yellow',
    borderColor:'gold',
    borderRadius:50,
    borderWidth:1
  },
  joinButtonStyle: {
    margin:5,
    backgroundColor:'sandybrown',
    borderColor:'brown',
    borderRadius:50,
    borderWidth:1
  },
  signOutButtonStyle: {
    margin:5,
    backgroundColor:'grey',
    borderColor:'lightgrey',
    borderRadius:50,
    borderWidth:1
  },
});
