import React from 'react';
import { StyleSheet, Text, View, Alert, TextInput, AsyncStorage, ScrollView } from 'react-native';
import { Button, ThemeProvider, Card } from 'react-native-material-ui';

export default class ActivationCondition extends React.Component {
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
        IsActive: ''
      }
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

  render() {
    return (
      <ScrollView>
        <View style={styles.container}>
          <Text style={{ fontSize: 30 }}>Activation Condition</Text>
          <Text style={{ fontSize: 20 }}>{this.state.activationCondition["ConditionName"]}</Text>
          <Text style={{ fontSize: 15 }}>{this.state.device["DeviceName"]}</Text>
          <Text style={{ fontSize: 10 }}>{this.state.room["RoomName"]}</Text>
          <Button primary text="Back To Activation Conditions List" onPress={() => { this.props.navigation.navigate("ActivationConditions") }} />
        </View>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textStyle: {
    fontSize: 20,
    alignItems: 'center',
  },
  textInputStyle: {
    fontSize: 25,
  }
});
