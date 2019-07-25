import { Permissions, Notifications } from 'expo';
import { AsyncStorage } from "react-native";

export default async function registerForPushNotificationsAsync() {
  const { status: existingStatus } = await Permissions.getAsync(
    Permissions.NOTIFICATIONS
  );
  let finalStatus = existingStatus;

  // only ask if permissions have not already been determined, because
  // iOS won't necessarily prompt the user a second time.
  if (existingStatus !== 'granted') {
    // Android remote notification permissions are granted during the app
    // install, so this will only ask on iOS
    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    finalStatus = status;
  }

  // Stop here if the user did not grant permissions
  if (finalStatus !== 'granted') {
    return;
  }

  // Get the token that uniquely identifies this device
  let token = await Notifications.getExpoPushTokenAsync();
  console.log(token);
  console.log(finalStatus);
  //alert(token);
  // POST the token to your backend server from where you can retrieve it to send push notifications.

  AsyncStorage.getItem('detailsStr').then((value) => {
    details = JSON.parse(value);

    var appUser = details.appUser;

    AsyncStorage.getItem('apiStr').then((value) => {
      let api = JSON.parse(value);

      fetch("http://" + api + '/ComingHomeWS.asmx/UpdateTokenForUserId', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(
          {
            token: token,
            userId: appUser.UserId
          }
        )
      })
        .then(() => {
          console.log('token updated ');
          AsyncStorage.setItem('tokenStr', token);
        }).catch(() => {
          console.log('err u[dateToken...');
        });
    })
  })
}