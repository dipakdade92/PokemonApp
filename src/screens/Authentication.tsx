import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {
  GoogleSignin,
  GoogleSigninButton,
  isErrorWithCode,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {getFromStorage, saveToStorage} from '../storage/AsyncStorageUtils';
import colors from '../utils/colors';

GoogleSignin.configure({
  webClientId:
    '433721000280-cil85r23jlh9v8tm5ihj0kudsv9lr9fd.apps.googleusercontent.com',
});

const Authentication = ({navigation}: any) => {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    getUserDetails();
  }, []);

  const getUserDetails = async () => {
    const userDetails = await getFromStorage('userDetails');
    if (userDetails != null) {
      setLoggedIn(true);
      navigation.navigate('pokemonList');
    }
  };

  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      setLoggedIn(true);
      saveToStorage('userDetails', userInfo);
      navigation.navigate('pokemonList');
    } catch (error: any) {
      if (isErrorWithCode(error)) {
        switch (error.code) {
          case statusCodes.SIGN_IN_CANCELLED:
            console.log('SIGN IN CANCELLED');
            break;
          case statusCodes.IN_PROGRESS:
            console.log('IN PROGRESS');
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            console.log('PLAY SERVICES NOT AVAILABLE');
            break;
          default:
        }
      }
    }
  };

  return (
    <View style={styles.container}>
      <GoogleSigninButton
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Dark}
        onPress={signIn}
      />
    </View>
  );
};

export default Authentication;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.White,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
