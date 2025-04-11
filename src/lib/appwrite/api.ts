import { INewPost, INewUser, IUpdatePost } from "@/types/type";
import { ID, Permission, Query, Role } from "appwrite";
import { account, appwriteConfig, avatars, databases, storage } from "./config";

export async function createUser(user: INewUser) {
  try {
    const newAccount = await account.create(
      ID.unique(),
      user.email,
      user.password,
      user.name
    );

    if (!newAccount) throw Error;

    const avatarUrl = new URL(avatars.getInitials(user.name));

    //Rather create a complete new user in the database
    const newUser = await saveUserDB({
      accountId: newAccount.$id,
      name: newAccount.name,
      email: newAccount.email,
      username: user.username,
      imageUrl: avatarUrl,
    });

    return newUser;
  } catch (error) {
    console.log(error);
    return error;
  }
}

export async function saveUserDB(user: {
  accountId: string;
  name: string;
  email: string;
  username?: string;
  imageUrl: URL;
}) {
  //gonna Create a user and save it in the database
  try {
    const newUser = await databases.createDocument(
      appwriteConfig.databaseID,
      appwriteConfig.userCollectionID,
      ID.unique(),
      user
    );
    return newUser;
  } catch (error) {
    console.log(error);
  }
}

export async function signInAccount(user: { email: string; password: string }) {
  try {
    //create a new email session
    const session = await account.createEmailPasswordSession(
      user.email,
      user.password
    );
    return session;
  } catch (error) {
    console.log(error);
  }
}

export async function getCurrentUser() {
  try {
    //get the accounts in the database
    const currentAccount = await account.get();

    if (!currentAccount) throw Error;

    //retrive the user document from the database
    const userAccount = await databases.listDocuments(
      appwriteConfig.databaseID,
      appwriteConfig.userCollectionID,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!userAccount) throw Error;

    return userAccount.documents[0];
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function signOutAccount() {
  try {
    //delete the session
    const session = await account.deleteSessions();
    return session;
  } catch (error) {
    console.log(error);
  }
}

export async function createPost(post: INewPost) {
  try {
    // console.log("Sending request with data:", post);
    // Upload file to appwrite storage
    const uploadedFile = await uploadFile(post.file);

    if (!uploadedFile) throw Error;

    // Get file url
    const fileUrl = getFilePreview(uploadedFile.$id)?.toString();
    console.log("File Url: ", fileUrl);

    //something was corrupted
    if (!fileUrl) {
      await deleteFile(uploadedFile.$id);
      throw new Error("File preview failed");
    }

    // Convert tags into array
    const tags = post.tags ? post.tags.replace(/ /g, "").split(",") : [];

    // Create post
    const newPost = await databases.createDocument(
      appwriteConfig.databaseID,
      appwriteConfig.postCollectionID,
      ID.unique(),
      {
        creator: post.userId,
        caption: post.caption,
        imageUrl: fileUrl, //store as string
        imageId: uploadedFile.$id || "",
        location: post.location || "",
        tags: tags.length > 0 ? tags : [],
      }
    );

    if (!newPost) {
      await deleteFile(uploadedFile.$id);
      throw new Error("Failed to create Document");
    }

    return newPost;
  } catch (error) {
    console.error("Create Post Error:", error);
    throw error;
  }
}

// ============================== UPLOAD FILE
export async function uploadFile(file: File[]) {
  try {
    const uploadedFile = await storage.createFile(
      appwriteConfig.storageID,
      ID.unique(),
      file[0],
      [Permission.read(Role.any())]
    );

    return uploadedFile;
  } catch (error) {
    console.log(error);
  }
}

// ============================== GET FILE URL
export function getFilePreview(fileId: string) {
  try {
    const fileUrl = storage
      .getFilePreview(appwriteConfig.storageID, fileId, 2000, 2000)
      .toString();

    if (!fileUrl) throw new Error("File URL generation failed");
    console.log("Generated Download URL:", fileUrl); // Debug the URL

    return fileUrl;
  } catch (error) {
    console.log(error);
  }
}

// ============================== DELETE FILE
export async function deleteFile(fileId: string) {
  try {
    await storage.deleteFile(appwriteConfig.storageID, fileId);

    return { status: "ok" };
  } catch (error) {
    console.log(error);
  }
}

export async function getRecentPosts() {
  const post = await databases.listDocuments(
    appwriteConfig.databaseID,
    appwriteConfig.postCollectionID,
    [Query.orderDesc("$createdAt"), Query.limit(20)]
  );

  if (!post) throw Error;

  return post;
}

export async function likePost(postId: string, likedArray: string[]) {
  try {
    const updatedPost = await databases.updateDocument(
      appwriteConfig.databaseID,
      appwriteConfig.postCollectionID,
      postId,
      {
        likes: [...likedArray],
      }
    );

    if (!updatedPost) throw Error;

    return updatedPost;
  } catch (error) {
    console.log(error);
  }
}

export async function savePost(postId: string, userId: string) {
  try {
    const updatedPost = await databases.createDocument(
      appwriteConfig.databaseID,
      appwriteConfig.savesCollectionID,
      ID.unique(),
      {
        user: userId,
        post: postId,
      }
    );

    if (!updatedPost) throw Error;

    return updatedPost;
  } catch (error) {
    console.log(error);
  }
}

export async function deleteSave(saveId: string) {
  try {
    const statusCode = await databases.deleteDocument(
      appwriteConfig.databaseID,
      appwriteConfig.savesCollectionID,
      saveId
    );

    if (!statusCode) throw Error;

    return { status: "ok" };
  } catch (error) {
    console.log(error);
  }
}

export async function getPostDetails(postId: string) {
  try {
    const postDetails = await databases.getDocument(
      appwriteConfig.databaseID,
      appwriteConfig.postCollectionID,
      postId
    );

    if (!postDetails) throw Error("No document Found");

    return postDetails;
  } catch (error) {
    console.log(error);
  }
}

export async function updatePost(post: IUpdatePost) {
  //check if the user is updating the content or just the image
  const hasFileUpdate = post?.file && post.file.length > 0;
  try {
    let image = {
      imageUrl: post?.imageUrl || "",
      imageId: post?.imageId || "",
    };

    if (hasFileUpdate) {
      const uploadedFile = await uploadFile(post.file);

      if (!uploadedFile) throw Error;

      // Get file url
      const fileUrl = getFilePreview(uploadedFile.$id)?.toString();

      //something was corrupted
      if (!fileUrl) {
        await deleteFile(uploadedFile.$id);
        throw new Error("File preview failed");
      }

      image = {
        ...image,
        imageUrl: fileUrl,
        imageId: uploadedFile.$id,
      };
    }

    // Convert tags into array
    const tags = post.tags ? post.tags.replace(/ /g, "").split(",") : [];

    // Create post
    const updatedPost = await databases.updateDocument(
      appwriteConfig.databaseID,
      appwriteConfig.postCollectionID,
      post.postId,
      {
        caption: post.caption,
        imageUrl: image.imageUrl,
        imageId: image.imageId,
        location: post.location || "",
        tags: tags.length > 0 ? tags : [], //pass the tags array
      }
    );

    if (!updatedPost) {
      await deleteFile(post.imageId);
      throw Error;
    }

    return updatedPost;
  } catch (error) {
    console.log(error);
  }
}

export async function deletePost(postId: string, imageId: string) {
  if (!postId || !imageId) throw Error;

  try {
    await databases.deleteDocument(
      appwriteConfig.databaseID,
      appwriteConfig.postCollectionID,
      postId
    );

    return { status: "ok" };
  } catch (error) {
    console.log(error);
  }
}

export async function getInfinitePosts({ pageParams }: { pageParams: number }) {
  const queries: any[] = [Query.orderDesc("$updatedAt"), Query.limit(10)];

  if (pageParams) {
    queries.push(Query.offset(pageParams * 10)); // offset is used to get the next 10 posts
  }

  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseID,
      appwriteConfig.postCollectionID,
      queries
    );

    if (!posts) throw Error;

    return posts;
  } catch (error) {
    console.log(error);
  }
}

export async function getSearchPosts(searchTerm: string) {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseID,
      appwriteConfig.postCollectionID,
      [Query.search("caption", searchTerm)]
    );

    if (!posts) throw Error;

    return posts;
  } catch (error) {
    console.log(error);
  }
}
