import { getCurrentUser } from "@/lib/appwrite/api";
import { IContextType, IUser } from "@/types/type";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

//define how an empty user look like
export const Initial_User = {
  id: "",
  name: "",
  email: "",
  username: "",
  imgUrl: "",
  bio: "",
};

//make the state to know that there is a user logged in
export const Initial_State = {
  user: Initial_User,
  isLoading: false,
  isAuthenticated: false,
  setUser: () => {},
  setIsAuthenticated: () => {},
  checkAuthUser: async () => false as boolean,
};

//now decalre our context
const AuthContext = createContext<IContextType>(Initial_State);

//we wanna show our entire app within the AuthProvider
const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<IUser>(Initial_User);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkAuthUser = async () => {
    try {
      setIsLoading(true);
      //get to the current user logged in accounnt
      const currentUser = await getCurrentUser();
      if (currentUser) {
        setUser({
          id: currentUser.$id,
          name: currentUser.name,
          email: currentUser.email,
          imgUrl: currentUser.imgUrl,
          username: currentUser.username,
          bio: currentUser.bio,
        });
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch (error) {
      console.log(error);
      //meaning user is not Authenticated
      setIsAuthenticated(false);
      return false;
    } finally {
      //done with loading
      setIsLoading(false);
    }
  };

  const navigate = useNavigate();

  //called whenever we reload our page
  useEffect(() => {
    //there is no token we navigate user to sign-in
    //   localStorage.getItem("cookieFallback") === null
    if (localStorage.getItem("cookieFallback") === "[]") navigate("/sign-in");

    checkAuthUser();
  }, []);

  const value = {
    user,
    isLoading,
    isAuthenticated,
    setUser,
    setIsAuthenticated,
    checkAuthUser,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;

export const useUserContext = () => useContext(AuthContext);
