import React from 'react';
import { StyleSheet, Text, View, AsyncStorage, ScrollView, Switch } from 'react-native';
import { Button, ThemeProvider, Card } from 'react-native-material-ui';

export default class ActivationCondition extends React.Component {
  static navigationOptions = {
    title: 'Activation Condition'
  }

  constructor(props) {
    super(props);

    this.state = {
      appUser: {},
      home: {},
      device: {
        DeviceId: '',
        DeviceName: '',
        DeviceTypeName: ''
      },
      room: {
        RoomId: '',
        RoomName: ''
      },
      activationCondition: {
        ConditionId: '',
        ConditionName: '',
        IsActive: false
      },
      userList: [],
      homeList: [],
      allUserRoomsList: [],
      allUserDevicesList: [],
      allUserActivationConditionsList: [],
      resultMessage: ''
    }
  }

  componentDidMount = () => {
    AsyncStorage.getItem('homeStr').then((value) => {
      home = JSON.parse(value);

      AsyncStorage.getItem('detailsStr').then((value) => {
        details = JSON.parse(value);

        AsyncStorage.getItem('deviceStr').then((value) => {
          device = JSON.parse(value);

          AsyncStorage.getItem('roomStr').then((value) => {
            room = JSON.parse(value);

            AsyncStorage.getItem('activationConditionStr').then((value) => {
              activationCondition = JSON.parse(value);

              this.setState({
                appUser: details.appUser,
                home: home,
                device: device,
                room: room,
                activationCondition: activationCondition,
                userList: details.userList,
                homeList: details.homeList,
                allUserRoomsList: details.allUserRoomsList,
                allUserDevicesList: details.allUserDevicesList,
                allUserActivationConditionsList: details.allUserActivationConditionsList,
                resultMessage: details.resultMessage
              });
            });
          });
        });
      });
    });
  }

  changeConditionStatus = () => {
    var userId = this.state.appUser["UserId"];
    var homeId = this.state.home["HomeId"];
    var { activationCondition } = this.state;
    var deviceId = this.state.device["DeviceId"];
    var roomId = this.state.device["RoomId"];
    var conditionId = this.state.activationCondition["ConditionId"];
    var newStatus;

    if (this.state.activationCondition["IsActive"]) {
      newStatus = 'false';
    }
    else if (!this.state.activationCondition["IsActive"]) {
      newStatus = 'true';
    }

    var request = {
      userId,
      homeId,
      deviceId,
      roomId,
      conditionId,
      newStatus
    }

    fetch("http://orhayseriesnet.ddns.net/Coming_Home/ComingHomeWS.asmx/ChangeConditionStatus", {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json;'
      }),
      body: JSON.stringify(request)
    })
      .then(res => res.json()) // קובע שהתשובה מהשרת תהיה בפורמט JSON
      .then((result) => { // no error in server
        let changeData = JSON.parse(result.d);

        switch (changeData) {
          case -3:
            {
              alert("Error! Condition not found!");
              break;
            }
          case -2:
            {
              alert("Error! You do not have permission to change this condition's status.");
              break;
            }
          case 0:
            {
              alert("Action aborted, as it does not actually change the condition's current status.");
              break;
            }
          default:
            {
              activationCondition.IsActive = !(activationCondition.IsActive);

              var activationConditionStr = JSON.stringify(activationCondition);

              AsyncStorage.setItem('activationConditionStr', activationConditionStr).then(() => {
                AsyncStorage.getItem('activationConditionsStr').then((value) => {
                  activationConditions = JSON.parse(value);
                  var activationConditionList = [];
                  activationConditionList = activationConditions.activationConditionList;
                  var index = activationConditionList.findIndex((actCon) => actCon.ConditionId === this.state.activationCondition.ConditionId);
                  activationConditionList[index].IsActive = this.state.activationCondition.IsActive;
                  var activationConditions = {
                    activationConditionList,
                    resultMessage : 'Data'
                  }
                  var activationConditionsStr = JSON.stringify(activationConditions);

                  AsyncStorage.setItem('activationConditionsStr', activationConditionsStr).then(() => {
                    var allUserActivationConditionsList = [];
                    allUserActivationConditionsList = this.state.allUserActivationConditionsList;
                    var indexA = allUserActivationConditionsList.findIndex((acCo) => (acCo.ConditionId === this.state.activationCondition.ConditionId));
                    allUserActivationConditionsList[indexA].IsActive = this.state.activationCondition.IsActive;
                    var detailsNew = {
                      appUser: this.state.appUser,
                      userList: this.state.userList,
                      homeList: this.state.homeList,
                      allUserRoomsList: this.state.allUserRoomsList,
                      allUserDevicesList: this.state.allUserDevicesList,
                      allUserActivationConditionsList: allUserActivationConditionsList,
                      resultMessage: this.state.resultMessage
                    }

                    var detailsNewStr = JSON.stringify(detailsNew);

                    AsyncStorage.setItem('detailsStr', detailsNewStr).then(() => {
                      this.setState({ activationCondition, allUserActivationConditionsList });
                      alert("Condition status changed!");
                    });
                  });
                });
              });
              break;
            }
        }
      })
      .catch((error) => {
        alert("A connection Error has occurred.");
        console.log(error);
      });
  }

  render() {
    return (
      <ScrollView>
        <View style={styles.container}>
          <View style={{margin:5, width:'100%', backgroundColor:'lawngreen', borderColor:'green', borderRadius:10, borderWidth:2, flex: 7, flexDirection: 'row', justifyContent: 'space-between'}}>
            <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start' }}>
              <Text style={{ fontSize: 20 }}>{this.state.activationCondition["ConditionName"]}</Text>
              <Text style={{ fontSize: 15 }}>{'Turn ' + this.state.device["DeviceName"] + ' ' + (this.state.activationCondition["TurnOn"] ? 'On' : 'Off') }</Text>
              <Text style={{ fontSize: 10 }}>{this.state.room["RoomName"]}</Text>
            </View>
            <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: "flex-end" }}>
              <Switch value={this.state.activationCondition["IsActive"]} onValueChange={this.changeConditionStatus} />
            </View>
          </View>
          <View style={{width:'100%', flex:3, flexDirection:'column'}}>
            <View style={styles.updateButtonStyle}>
              <Button primary text="Update Activation Condition Details" onPress={() => {this.props.navigation.navigate("UpdateActivationCondition")}}/>
            </View>
            <View style={styles.listButtonStyle}>
              <Button primary text="Activation Conditions" onPress={() => {this.props.navigation.navigate("ActivationConditions")}}/>
            </View>
            <View style={styles.homeButtonStyle}>
              <Button primary text="Home" onPress={() => {this.props.navigation.navigate("Home")}}/>
            </View>
          </View>
        </View>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'green',
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
  updateButtonStyle: {
    margin:5,
    backgroundColor:'lightgrey',
    borderColor:'silver',
    borderRadius:50,
    borderWidth:1
  },
  homeButtonStyle: {
    margin:5,
    backgroundColor:'lightblue',
    borderColor:'blue',
    borderRadius:50,
    borderWidth:1
  },
  listButtonStyle: {
    margin:5,
    backgroundColor:'lawngreen',
    borderColor:'green',
    borderRadius:50,
    borderWidth:1
  },
});
