import { Models } from "appwrite";

export type INavLink = {
  imageUrl: string;
  route: string;
  label: string;
};

export type IUpdateUser = {
  userId: string;
  name: string;
  bio: string;
  imageId: string;
  imageUrl: URL | string;
  file: File[];
};

export type INewPost = {
  userId: string;
  caption?: string;
  file: File[];
  location?: string;
  tags?: string;
};

export type IUpdatePost = {
  postId: string;
  caption: string;
  file: File[];
  imageId: string;
  imageUrl?: URL;
  location?: string;
  tags?: string;
};

export type IUser = {
  id: string;
  name: string;
  username: string;
  email: string;
  imageUrl: string;
  bio: string;
};

export type INewUser = {
  name: string;
  email: string;
  username: string;
  password: string;
};

export type IContextType = {
  user: IUser;
  isLoading: boolean;
  setUser: (user: IUser) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  checkAuthUser: () => Promise<boolean>;
};

export type GridPostListType = {
  posts?: Models.Document[];
  showUser?: boolean;
  showStats?: boolean;
};
