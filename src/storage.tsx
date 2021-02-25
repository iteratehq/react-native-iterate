// Interface representing a secure storage facility
export interface StorageInterface {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
}

export const Keys = {
  lastUpdated: 'last_updated',
  authToken: 'auth_token',
  userTraits: 'user_traits',
};

const KeyPrefix = 'com.iteratehq.';

class Storage {
  // A user-provided secure storage
  storageProvider?: StorageInterface;

  // Remove all stored items
  clear = async () => {
    return this.secureStorage().then(async (storage) => {
      for (const [, value] of Object.entries(Keys)) {
        storage.removeItem(`${KeyPrefix}${value}`);
      }
    });
  };

  get = async (key: string) => {
    return this.secureStorage().then(async (storage) => {
      const result = await storage.getItem(`${KeyPrefix}${key}`);
      if (result != null) {
        return JSON.parse(result).value;
      }
    });
  };

  set = async (key: string, value: any) => {
    return this.secureStorage().then(
      async (storage) =>
        await storage.setItem(`${KeyPrefix}${key}`, JSON.stringify({ value }))
    );
  };

  secureStorage = async (): Promise<StorageInterface> => {
    if (this.storageProvider != null) {
      return this.storageProvider;
    }

    throw 'Error initializing Iterate: missing storage. You must provide a storage facility, see README for details';
  };
}

export default new Storage();
