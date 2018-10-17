import React from 'react';
import { StyleSheet, Text, View, AsyncStorage, ScrollView } from 'react-native';
import { Button, ThemeProvider, Card } from 'react-native-material-ui';

export default class User extends React.Component {
  static navigationOptions = {
    title: 'User'
  }

  constructor(props) {
    super(props);

    this.state = {
      appUser: {},
      home: {},
      user: {}
    }
  }

  componentDidMount = () => {
    AsyncStorage.getItem('homeStr').then((value) => {
      home = JSON.parse(value);

      AsyncStorage.getItem('detailsStr').then((value) => {
        details = JSON.parse(value);

        AsyncStorage.getItem('userStr').then((value) => {
          user = JSON.parse(value);

          this.setState({
            appUser: details.appUser,
            home: home,
            user: user
          });
        });
      });
    });
  }

  render() {
    return (
      <ScrollView>
        <View style={styles.container}>
          <Text style={{ fontSize: 20 }}>{this.state.user["UserName"]}</Text>
          <Button primary text="Update User Details" onPress={() => {this.props.navigation.navigate("UpdateUser", back="User")}}/>
          <Button primary text="Users" onPress={() => { this.props.navigation.navigate("Users") }} />
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
