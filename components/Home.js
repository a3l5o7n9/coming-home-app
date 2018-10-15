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
      user: {},
      home: {}
    }
  }

  componentDidMount = () => {
    AsyncStorage.getItem('homeStr').then((value) => {
      home = JSON.parse(value);

      AsyncStorage.getItem('detailsStr').then((value) => {
        details = JSON.parse(value);

        this.setState({
          user: details.user,
          home: home
        });

        this.getUserHomeDetails();
      });
    });
  }

  backToMainPage = () => {
    const userName = this.state.user["UserName"];
    const userPassword = this.state.user["UserPassword"];

    var request = {
      userName,
      userPassword
    }
    //Alert.alert(JSON.stringify(request));
    fetch("http://ruppinmobile.tempdomain.co.il/SITE14/ComingHomeWS.asmx/Login", {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json;'
      }),
      body: JSON.stringify(request)
    })
      .then(res => res.json()) // קובע שהתשובה מהשרת תהיה בפורמט JSON
      .then((result) => { // no error in server
        let jsonData = JSON.parse(result.d);
        let details = {
          user: jsonData.AU,
          userList: jsonData.LU,
          homeList: jsonData.LH,
          resultMessage: jsonData.ResultMessage
        }

        if (details.resultMessage == 'No Data') {
          alert("Error! User could not be found.");
          return;
        }

        let detailsStr = JSON.stringify(details);
        AsyncStorage.setItem('detailsStr', detailsStr).then(() => {
          this.props.navigation.navigate("MainPage");
        });
      })
      .catch((error) => {
        alert("A connection Error has occurred.");
      });
  }

  getUserHomeDetails = () => {
    var userId = this.state.user["UserId"];
    var homeId = this.state.home["HomeId"];

    var request = {
      userId,
      homeId
    }
    //Alert.alert(JSON.stringify(request));
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
          <Text style={{ fontSize: 30 }}>{this.state.home["HomeName"]}</Text>
          <Text style={{ fontSize: 20 }}>
            Hello, {this.state.user["FirstName"]}
          </Text>
          <View style={{ flex: 1, width: '100%', height: '100%', flexDirection: 'row', justifyContent: 'space-around', flexWrap: 'wrap' }}>
            <View style={{ width: '40%', height: 100, margin: 10, backgroundColor: 'powderblue', flexWrap: 'wrap', alignContent: 'center' }}>
              <Button primary text="Rooms" onPress={() => { this.props.navigation.navigate("Rooms") }} />
            </View>
            <View style={{ width: '40%', height: 100, margin: 10, backgroundColor: 'skyblue', flexWrap: 'wrap' }}>
              <Button primary text="Devices" onPress={() => { this.props.navigation.navigate("Devices") }} />
            </View>
            <View style={{ width: '40%', height: 100, margin: 10, backgroundColor: 'steelblue', flexWrap: 'wrap' }}>
              <Button primary text="Users" onPress={() => { this.props.navigation.navigate("Users") }} />
            </View>
            <View style={{ width: '40%', height: 100, margin: 10, backgroundColor: 'blue', flexWrap: 'wrap' }}>
              <Button primary text="Activation Conditions" onPress={() => { this.props.navigation.navigate("ActivationConditions") }} />
            </View>
          </View>
          <Button primary text="Update Home Details" onPress={() => {this.props.navigation.navigate('UpdateHome')}}/>
          <Button primary text="Main Page" onPress={this.backToMainPage} />
        </View>
      </ScrollView>
    );
  }
}

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
