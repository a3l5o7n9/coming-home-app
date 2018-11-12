import React from 'react';
import { StyleSheet, Text, View, AsyncStorage, ScrollView } from 'react-native';
import { Button, ThemeProvider, Card } from 'react-native-material-ui';

export default class Home extends React.Component {
  static navigationOptions = {
    title: 'Home',
  }

  constructor(props) {
    super(props);

    this.state = {
      appUser: {},
      home: {}
    }
  }

  componentDidMount = () => {
    AsyncStorage.getItem('homeStr').then((value) => {
      home = JSON.parse(value);

      AsyncStorage.getItem('detailsStr').then((value) => {
        details = JSON.parse(value);

        this.setState({
          appUser: details.appUser,
          home: home
        });

        this.getUserHomeDetails();
      });
    });
  }

  backToMainPage = () => {
    const userName = this.state.appUser["UserName"];
    const userPassword = this.state.appUser["UserPassword"];

    var request = {
      userName,
      userPassword
    }
    fetch("http://ruppinmobile.tempdomain.co.il/SITE14/ComingHomeWS.asmx/Login", {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json;'
      }),
      body: JSON.stringify(request)
    })
      .then(res => res.json()) // קובע שהתשובה מהשרת תהיה בפורמט JSON
      .then((result) => { // no error in server
        var jsonData = JSON.parse(result.d);
        var details = {
          appUser: jsonData.AU,
          userList: jsonData.LU,
          homeList: jsonData.LH,
          allUserRoomsList: jsonData.LR,
          allUserDevicesList: jsonData.LD,
          allUserActivationConditionsList: jsonData.LActCon,
          resultMessage: jsonData.ResultMessage
        }

        var user = details.appUser;

        if (details.resultMessage == 'No Data') {
          alert("Error! User could not be found.");
          return;
        }

        var detailsStr = JSON.stringify(details);
        AsyncStorage.setItem('detailsStr', detailsStr).then(() => {
          var userStr = JSON.stringify(user);
          AsyncStorage.setItem('userStr', userStr).then(() => {
            this.props.navigation.navigate("MainPage");
          });
        });
      })
      .catch((error) => {
        alert("A connection Error has occurred.");
      });
  }

  getUserHomeDetails = () => {
    var userId = this.state.appUser["UserId"];
    var homeId = this.state.home["HomeId"];

    var request = {
      userId,
      homeId
    }
    fetch("http://ruppinmobile.tempdomain.co.il/SITE14/ComingHomeWS.asmx/GetUserHomeDetails", {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json;'
      }),
      body: JSON.stringify(request)
    })
      .then(res => res.json()) // קובע שהתשובה מהשרת תהיה בפורמט JSON
      .then((result) => { // no error in server
        let jsonData = JSON.parse(result.d);
        let rooms = {
          roomList: jsonData.LR,
          resultMessage: jsonData.ResultMessage
        }

        let devices = {
          deviceList: jsonData.LD,
          resultMessage: jsonData.ResultMessage
        }

        let users = {
          userList: jsonData.LU,
          resultMessage: jsonData.ResultMessage
        }

        let activationConditions = {
          activationConditionList: jsonData.LActCon,
          resultMessage: jsonData.ResultMessage
        }

        let roomsStr = JSON.stringify(rooms);

        AsyncStorage.setItem('roomsStr', roomsStr).then(() => {
          let devicesStr = JSON.stringify(devices);

          AsyncStorage.setItem('devicesStr', devicesStr).then(() => {
            let usersStr = JSON.stringify(users);

            AsyncStorage.setItem('usersStr', usersStr).then(() => {
              let activationConditionsStr = JSON.stringify(activationConditions);

              AsyncStorage.setItem('activationConditionsStr', activationConditionsStr).then(() => {
              });
            });
          });
        });
      })
      .catch((error) => {
        alert("A connection Error has occurred.");
      });
  }

  render() {
    return (
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.textViewStyle}>
            <Text style={{ fontSize: 30 }}>{this.state.home["HomeName"]}</Text>
            <Text style={{ fontSize: 20 }}>
              Hello, {this.state.appUser["FirstName"]}
            </Text>
          </View>
          <View style={{ flex: 1, width: '100%', height: '100%', flexDirection: 'row', justifyContent: 'space-around', flexWrap: 'wrap' }}>
            <View style={{borderColor:'blue', borderRadius:5, borderWidth:1, width: '40%', height: 100, margin: 10, backgroundColor: 'powderblue', flexWrap: 'wrap', alignContent: 'center' }}>
              <Button primary text="Rooms" onPress={() => { 
                  this.getUserHomeDetails();
                  this.props.navigation.navigate("Rooms"); 
                }} 
              />
            </View>
            <View style={{borderColor:'blue', borderRadius:5, borderWidth:1, width: '40%', height: 100, margin: 10, backgroundColor: 'skyblue', flexWrap: 'wrap' }}>
              <Button primary text="Devices" onPress={() => { 
                  this.getUserHomeDetails();
                  this.props.navigation.navigate("Devices");
                }} 
              />
            </View>
            <View style={{borderColor:'lightcyan', borderRadius:5, borderWidth:1, width: '40%', height: 100, margin: 10, backgroundColor: 'cyan', flexWrap: 'wrap' }}>
              <Button primary text="Users" onPress={() => {
                  this.getUserHomeDetails(); 
                  this.props.navigation.navigate("Users");
                }} 
              />
            </View>
            <View style={{borderColor:'green', borderRadius:5, borderWidth:1, width: '40%', height: 100, margin: 10, backgroundColor: 'lawngreen', flexWrap: 'wrap' }}>
              <Button primary text="Activation Conditions" onPress={() => {
                  this.getUserHomeDetails(); 
                  this.props.navigation.navigate("ActivationConditions"); 
                }} 
              />
            </View>
          </View>
          <View style={styles.updateButtonViewStyle}>
            <Button primary text="Update Home Details" onPress={() => {this.props.navigation.navigate('UpdateHome')}}/>
          </View>
          <View style={styles.mainPageButtonViewStyle}>
            <Button primary text="Main Page" onPress={this.backToMainPage} />
          </View>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'orange',
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
  textViewStyle: {
    margin:5,
  },
  textInputViewStyle: {
    margin:5,
    borderColor:'black',
    borderRadius:5,
    borderWidth:1
  },
  updateButtonViewStyle: {
    margin:5,
    backgroundColor:'lightgrey',
    borderColor:'silver',
    borderRadius:50,
    borderWidth:1
  },
  mainPageButtonViewStyle: {
    margin:5,
    backgroundColor:'mediumpurple',
    borderColor:'indigo',
    borderRadius:50,
    borderWidth:1
  },
});
