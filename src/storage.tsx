import EncryptedStorage from 'react-native-encrypted-storage';

export const Keys = {
  lastUpdated: 'last_updated',
  authToken: 'auth_token',
  userTraits: 'user_traits',
};

class Storage {
  get = async (key: string) => {
    try {
      const result = await EncryptedStorage.getItem(`com.iteratehq.${key}`);
      if (result != null) {
        return JSON.parse(result).value;
      }
    } catch (error) {
      console.error(error);
    }
  };

  set = async (key: string, value: any) => {
    try {
      await EncryptedStorage.setItem(
        `com.iteratehq.${key}`,
        JSON.stringify({ value })
      );
    } catch (error) {
      console.error(error);
    }
  };

  clear = async () => {
    try {
      EncryptedStorage.clear();
    } catch (error) {
      console.error(error);
    }
  };
}

export default new Storage();
