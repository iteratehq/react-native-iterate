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
  provider?: StorageInterface;

  // Remove all stored items
  clear = async () => {
    return this.storageProvider().then(async (storage) => {
      for (const [, value] of Object.entries(Keys)) {
        // Ensure we're only removing items that exist to avoid errors
        storage.getItem(`${KeyPrefix}${value}`).then((item) => {
          if (item != null) {
            storage.removeItem(`${KeyPrefix}${value}`);
          }
        });
      }
    });
  };

  getItem = async (key: string) => {
    return this.storageProvider().then(async (storage) => {
      const result = await storage.getItem(`${KeyPrefix}${key}`);
      if (result != null) {
        return JSON.parse(result).value;
      }
    });
  };

  setItem = async (key: string, value: any) => {
    return this.storageProvider().then(
      async (storage) =>
        await storage.setItem(`${KeyPrefix}${key}`, JSON.stringify({ value }))
    );
  };

  storageProvider = async (): Promise<StorageInterface> => {
    if (this.provider != null) {
      return this.provider;
    }

    throw 'Error initializing Iterate: missing storage. You must provide a storage facility, see README for details';
  };
}

export default new Storage();
