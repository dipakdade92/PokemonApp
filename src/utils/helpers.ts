import messaging from '@react-native-firebase/messaging';
import {navigate} from './navigationRef';

export async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  console.log('authStatus', authStatus);
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
    getFcmToken();
  }
}

async function getFcmToken() {
  let fcmToken = await messaging().getToken();
  console.log('fcmToken', fcmToken);
}

export const NotificationListener = () => {
  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
  });

  messaging().onNotificationOpenedApp(remoteMessage => {
    console.log(
      'Notification caused app to open from background state:',
      remoteMessage.notification?.body,
    );
    if (remoteMessage?.notification?.body != undefined) {
      navigate('detailScreen', {
        url: `https://pokeapi.co/api/v2/pokemon/${remoteMessage?.notification.body}/`,
      });
    }
  });

  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        console.log(
          'Notification caused app to open from quit state:',
          remoteMessage.notification,
        );
      }
    });

  messaging().onMessage(async remoteMessage => {
    console.log('notification on forground state...', remoteMessage);
  });
};
