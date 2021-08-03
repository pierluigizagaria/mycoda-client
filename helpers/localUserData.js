import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

const DATA_TYPE = {
  USER: 'localUserData',
  SECURE: 'userSecureData',
}

const localUserData = {
  save: (userInformation, secureData) => {
    return new Promise((resolve, reject) => {
      Promise.all([
        AsyncStorage.setItem(DATA_TYPE.USER, JSON.stringify(userInformation)),
        SecureStore.setItemAsync(DATA_TYPE.SECURE, JSON.stringify(secureData)),
      ])
        .then(() => resolve({ ...userInformation, ...secureData }))
        .catch(error => reject(error));
    });
  },
  load: () => {
    return new Promise((resolve, reject) => {
      Promise.all([
        AsyncStorage.getItem(DATA_TYPE.USER),
        SecureStore.getItemAsync(DATA_TYPE.SECURE),
      ])
        .then(([data, secureData]) => resolve({ 
          ...JSON.parse(data), 
          ...JSON.parse(secureData) 
        }))
        .catch(error => reject(error));
    });
  },
  delete: () => {
    return new Promise((resolve, reject) => {
      Promise.all([
        AsyncStorage.removeItem(DATA_TYPE.USER),
        SecureStore.deleteItemAsync(DATA_TYPE.SECURE),
      ])
        .then(() => resolve())
        .catch(error => reject(error));
    });
  }
}

export default localUserData;