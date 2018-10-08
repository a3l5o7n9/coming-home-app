import React from 'react';
import { StyleSheet, Text, View, Alert, TextInput, AsyncStorage, ScrollView, Switch } from 'react-native';
import { Button, ThemeProvider, Card } from 'react-native-material-ui';

export default class ConditionDetails extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user: this.props.user,
      home: this.props.home,
      device: this.props.device,
      room: this.props.room,
      activationCondition: this.props.activationCondition,
      navigation: this.props.navigation,
      activationConditionList: this.props.activationConditionList,
      backName: this.props.backName
    }
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

                var activationConditionList = this.state.activationConditionList;
                var index = activationConditionList.findIndex((actCon) => actCon.ConditionId === this.state.activationCondition.ConditionId);
                activationConditionList[index].IsActive = this.state.activationCondition.IsActive;
                var activationConditions = {
                  activationConditionList,
                  resultMessage : 'Data'
                }
                var activationConditionsStr = JSON.stringify(activationConditions);

                AsyncStorage.setItem('activationConditionsStr', activationConditionsStr).then(() => {
                  this.setState({ activationCondition, activationConditionList});
                  alert("Condition status changed!");
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
      <View style={styles.container}>
        <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start' }}>
          <Button primary text={this.state.activationCondition["ConditionName"] + "\n" + this.state.activationCondition["ActivationMethodName"]} onPress={() => {
            var activationConditionStr = JSON.stringify(this.state.activationCondition);
            AsyncStorage.setItem('activationConditionStr', activationConditionStr).then(() => {
              var deviceStr = JSON.stringify(this.state.device);
              AsyncStorage.setItem('deviceStr', deviceStr).then(() => {
                var roomStr = JSON.stringify(this.state.room);
                AsyncStorage.setItem('roomStr', roomStr).then(() => {
                  this.state.navigation.navigate("ActivationCondition", back={name: this.state.backName});
                });
              });
            });
          }} />
          <Text style={{ fontSize: 15 }}>{this.state.device["DeviceName"]}</Text>
          <Text style={{ fontSize: 10 }}>{this.state.room["RoomName"]}</Text>
        </View>
        <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: "flex-end" }}>
          <Switch value={this.state.activationCondition["IsActive"]} onValueChange={this.changeConditionStatus} />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '60%',
  },
  textStyle: {
    fontSize: 20,
    alignItems: 'center',
  },
  textInputStyle: {
    fontSize: 25,
  }
});