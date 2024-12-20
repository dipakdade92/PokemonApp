import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import axios from 'axios';
import {useInfiniteQuery} from 'react-query';
import {
  getFromStorage,
  removeFromStorage,
  saveToStorage,
} from '../storage/AsyncStorageUtils';
import colors from '../utils/colors';
import {wp} from '../utils/responsive';
import {GoogleSignin} from '@react-native-google-signin/google-signin';

let baseUrl = `https://pokeapi.co/api/v2/pokemon?limit=${10}&offset=${0}`;

const fetchPosts = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
};

const PokemonList: any = ({navigation}: any) => {
  const [userDetails, setUserDetails] = useState('');
  const [userName, setUserName] = useState('');
  const [userImage, setUserImage] = useState('');
  const [pokemonButton, setPokemonButton] = useState('');
  const {data, fetchNextPage, isLoading, isError, error} = useInfiniteQuery(
    'posts',
    fetchPosts,
    {
      getNextPageParam: (lastPage: any, allPages: any) => {
        baseUrl = lastPage.next;
        return lastPage.nextPage ?? false;
      },
    },
  );

  const pokemons = data?.pages?.flatMap(page => page.results) || [];

  useEffect(() => {
    getUserDetails();
  }, []);

  const getUserDetails = async () => {
    const userDetails = await getFromStorage('userDetails');
    const cachedButton = await getFromStorage('cachedButton');

    if (userDetails != null) {
      const userName = userDetails.data.user.name;
      const photo = userDetails.data.user.photo;
      setUserName(userName);
      setUserImage(photo);
      setUserDetails(userDetails);
    }

    if (cachedButton != null) {
      handleSelectButton(cachedButton.value);
    }
  };

  const signOut = async () => {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      console.log('User access revoked and logged out');
      await removeFromStorage('userDetails');
      await removeFromStorage('cachedButton');
      navigation.navigate('authentication');
    } catch (error: any) {
      console.error('Error revoking access:', error);
    }
  };

  const handlePokemonClick = (pokemon: any) => {
    navigation.navigate('detailScreen', {url: pokemon?.url});
  };

  const renderItem = ({item}: any) => {
    return (
      <TouchableOpacity
        style={styles.pokemonItem}
        onPress={() => handlePokemonClick(item)}>
        <Text style={styles.pokemonName}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  const handleSelectButton = (name: string) => {
    setPokemonButton(name);
    switch (name) {
      case 'CatchPokémon':
        saveToStorage('cachedButton', {value: 'CatchPokémon'});
        break;
      case 'ViewTeam':
        saveToStorage('cachedButton', {value: 'ViewTeam'});
        break;
      case 'Settings':
        saveToStorage('cachedButton', {value: 'Settings'});
        break;
      default:
        break;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.mainAppBarWrapper}>
        <View style={{flexDirection: 'row'}}>
          <Image source={{uri: userImage}} style={styles.userImageWrapper} />
          <Text style={styles.userNameWrapper}>{userName}</Text>
        </View>
        <View style={{alignSelf: 'center'}}>
          <TouchableOpacity
            onPress={() => {
              signOut();
            }}
            style={styles.logoutButtonMainWrapper}>
            <Text style={styles.logoutTextWrapper}>LogOut</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.buttonMainWrapper}>
        <TouchableOpacity
          onPress={() => {
            handleSelectButton('CatchPokémon');
          }}
          style={[
            styles.threeButtonWrapper,
            {
              backgroundColor:
                pokemonButton == 'CatchPokémon'
                  ? colors.LightGoldenBrown
                  : colors.White,
            },
          ]}>
          <Text style={styles.threeButtonTextWrapper}>Catch Pokémon</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            handleSelectButton('ViewTeam');
          }}
          style={[
            styles.threeButtonWrapper,
            {
              backgroundColor:
                pokemonButton == 'ViewTeam'
                  ? colors.LightGoldenBrown
                  : colors.White,
            },
          ]}>
          <Text style={styles.threeButtonTextWrapper}>View Team</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            handleSelectButton('Settings');
          }}
          style={[
            styles.threeButtonWrapper,
            {
              backgroundColor:
                pokemonButton == 'Settings'
                  ? colors.LightGoldenBrown
                  : colors.White,
            },
          ]}>
          <Text style={styles.threeButtonTextWrapper}>Settings</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        style={styles.flatListWrapper}
        showsVerticalScrollIndicator={false}
        data={pokemons}
        renderItem={renderItem}
        onEndReached={() => {
          fetchNextPage();
        }}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          isLoading ? (
            <ActivityIndicator size="small" color={colors.SoftBlue} />
          ) : null
        }
      />
    </View>
  );
};

export default PokemonList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.White,
  },
  mainAppBarWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: (wp * 100) / 100,
    height: (wp * 14) / 100,
    paddingHorizontal: (wp * 2.5) / 100,
  },
  userImageWrapper: {
    width: (wp * 10) / 100,
    height: (wp * 10) / 100,
    resizeMode: 'contain',
    alignSelf: 'center',
    borderRadius: (wp * 25) / 100,
  },
  userNameWrapper: {
    marginLeft: (wp * 2) / 100,
    alignSelf: 'center',
    fontSize: 18,
    fontWeight: '500',
    color: colors.Black,
  },
  logoutButtonMainWrapper: {
    backgroundColor: colors.Red,
    width: (wp * 16) / 100,
    height: (wp * 7) / 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: (wp * 1) / 100,
  },
  logoutTextWrapper: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.White,
  },
  buttonMainWrapper: {
    width: (wp * 90) / 100,
    marginTop: (wp * 2) / 100,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'center',
  },
  flatListWrapper: {
    width: (wp * 95) / 100,
    marginTop: (wp * 2) / 100,
    alignSelf: 'center',
  },
  pokemonItem: {
    backgroundColor: colors.SoftBlue,
    width: (wp * 95) / 100,
    alignSelf: 'center',
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
  },
  pokemonName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.White,
    textAlign: 'center',
  },
  threeButtonTextWrapper: {
    fontSize: 16,
    color: colors.Black,
  },
  threeButtonWrapper: {
    backgroundColor: colors.LightGoldenBrown,
    borderWidth: 1,
    borderColor: colors.SoftBlue,
    borderRadius: (wp * 1) / 100,
    paddingHorizontal: (wp * 1.5) / 100,
    paddingVertical: (wp * 0.5) / 100,
  },
});
