import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Authentication from '../screens/Authentication';
import PokemonList from '../screens/PokemonList';
import DetailScreen from '../screens/DetailScreen';
import {navigationRef} from '../utils/navigationRef';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator initialRouteName="authentication">
        <Stack.Screen
          name="authentication"
          component={Authentication}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="pokemonList"
          component={PokemonList}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="detailScreen"
          component={DetailScreen}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
