import {Dimensions, Platform} from 'react-native';

export const hp: number = Dimensions.get('window').height;
export const wp: number = Dimensions.get('window').width;

export const getWidthPercentage = (percentage: number) => {
  const value = percentage / 2;
  return Platform.OS === 'web' ? (wp * value) / 100 : (wp * percentage) / 100;
};

export const getHeightPercentage = (percentage: number) => {
  const value = percentage / 2;
  return Platform.OS === 'web' ? (hp * value) / 100 : (hp * percentage) / 100;
};
