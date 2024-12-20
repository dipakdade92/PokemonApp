import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveToStorage = async (key: string, value: any) => {
  try {
    const stringifiedValue =
      typeof value === 'object' ? JSON.stringify(value) : value;
    await AsyncStorage.setItem(key, stringifiedValue);
  } catch (error) {
    console.error('Error saving data to AsyncStorage', error);
  }
};

export const getFromStorage = async (key: string) => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value != null ? JSON.parse(value) : null;
  } catch (error) {
    console.error('Error retrieving data from AsyncStorage', error);
    return null;
  }
};

export const removeFromStorage = async (key: string) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing data from AsyncStorage', error);
  }
};

export const clearStorage = async () => {
  try {
    await AsyncStorage.clear();
  } catch (error) {
    console.error('Error clearing AsyncStorage', error);
  }
};
