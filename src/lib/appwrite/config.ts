const appwrite = await import("appwrite");
const { Client, Account, Databases, Storage, Avatars } = appwrite;

export const appwriteConfig = {
  projectID: import.meta.env.VITE_APPWRITE_PROJECT_ID,
  url: import.meta.env.VITE_APPWRITE_URL,
  databaseID: import.meta.env.VITE_APPWRITE_DATABASE_ID,
  storageID: import.meta.env.VITE_APPWRITE_STORAGE_ID,
  userCollectionID: import.meta.env.VITE_APPWRITE_USERS_COLLECTION_ID,
  savesCollectionID: import.meta.env.VITE_APPWRITE_SAVES_COLLECTION_ID,
  postCollectionID: import.meta.env.VITE_APPWRITE_POSTS_COLLECTION_ID,
};

export const client = new Client()
  .setProject(appwriteConfig.projectID)
  .setEndpoint(appwriteConfig.url);

// console.log("Appwrite URL:", appwriteConfig.url);

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const avatars = new Avatars(client);
