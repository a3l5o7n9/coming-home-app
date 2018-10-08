import React from 'react';
import { StyleSheet, Text, View, Alert, TextInput, AsyncStorage, ScrollView, Switch } from 'react-native';
import { Button, ThemeProvider, Card } from 'react-native-material-ui';

export default class ActivationCondition extends React.Component {
  static navigationOptions = {
    title: 'Activation Condition'
  }

  constructor(props) {
    super(props);

    this.state = {
      user: {},
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
      back: this.props.navigation.state.params
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
                user: details.user,
                home: home,
                device: device,
                room: room,
                activationCondition: activationCondition
              });
            });
          });
        });
      });
    });
  }

  changeConditionStatus = () => {
    var userId = this.state.user["UserId"];
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

    fetch("http://ruppinmobile.tempdomain.co.il/SITE14/ComingHomeWS.asmx/ChangeConditionStatus", {
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
                    this.setState({ activationCondition });
                    alert("Condition status changed!");
                  });
                });
              });
              break;
            }
        }
      })
      .catch((error) => {
        alert("A connection Error has occurred.");
      });
  }

  render() {
    return (
      <ScrollView>
        <View style={styles.container}>
          <View style={{flex: 2, flexDirection: 'row', justifyContent: 'space-between'}}>
            <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start' }}>
              <Text style={{ fontSize: 20 }}>{this.state.activationCondition["ConditionName"]}</Text>
              <Text style={{ fontSize: 15 }}>{this.state.device["DeviceName"]}</Text>
              <Text style={{ fontSize: 10 }}>{this.state.room["RoomName"]}</Text>
            </View>
            <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: "flex-end" }}>
              <Switch value={this.state.activationCondition["IsActive"]} onValueChange={this.changeConditionStatus} />
            </View>
          </View>
          <Button primary text="Back" onPress={() => { this.props.navigation.navigate(this.state.back["name"]) }} />
          <Button primary text="Home" onPress={() => {this.props.navigation.navigate("Home")}}/>
        </View>
      </ScrollView>
    )
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
