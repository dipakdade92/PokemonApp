import axios from 'axios';
import React from 'react';
import {Text, Image, StyleSheet, ScrollView, Linking} from 'react-native';
import {useInfiniteQuery} from 'react-query';
import colors from '../utils/colors';

const DetailScreen = ({route}: any) => {
  const url = route?.params?.url;

  const fetchPokemonDetails = async () => {
    const response = await axios.get(url);
    return response.data;
  };

  const {data, isLoading, isError} = useInfiniteQuery(
    'pokemonDetails',
    fetchPokemonDetails,
  );

  const pokemon: any = data?.pages[0];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>
        {pokemon?.name != undefined ? pokemon.name.toUpperCase() : ''}
      </Text>
      {pokemon?.sprites?.back_default != null && (
        <Image
          source={{uri: pokemon?.sprites?.back_default}}
          style={styles.sprite}
        />
      )}
      <Text style={styles.detail}>
        <Text style={styles.label}>Order:</Text> {pokemon?.order}
      </Text>
      <Text style={styles.detail}>
        <Text style={styles.label}>Species:</Text> {pokemon?.species.name}
      </Text>
      <Text style={styles.link}>
        <Text style={styles.label}>
          Species URL:{' '}
          <Text
            onPress={() => {
              Linking.openURL(pokemon?.species.url);
            }}
            style={{textDecorationLine: 'underline', color: 'blue'}}>
            {pokemon?.species.url}
          </Text>
        </Text>
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.White,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.DarkBlueGray,
    marginBottom: 16,
  },
  sprite: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    marginBottom: 16,
  },
  detail: {
    fontSize: 18,
    color: colors.BlueGray,
    marginVertical: 8,
  },
  label: {
    fontWeight: 'bold',
    color: colors.DarkBlueGray,
  },
  link: {
    fontSize: 16,
    color: colors.DodgerBlue,
    marginTop: 8,
  },
});

export default DetailScreen;
