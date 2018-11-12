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
          <View style={styles.textViewStyle}>
            <Text style={{ fontSize: 20 }}>{this.state.user["UserName"]}</Text>
          </View>
          <View style={styles.updateButtonStyle}>
            <Button primary text="Update User Details" onPress={() => {this.props.navigation.navigate("UpdateUser", back="User")}}/>
          </View>
          <View style={styles.listButtonStyle}>
            <Button primary text="Users" onPress={() => { this.props.navigation.navigate("Users") }} />
          </View>
          <View style={styles.homeButtonStyle}>
            <Button primary text="Home" onPress={() => {this.props.navigation.navigate("Home")}}/>
          </View>
        </View>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'cyan',
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
