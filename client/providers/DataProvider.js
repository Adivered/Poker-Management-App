import React, { useState, useEffect, createContext } from "react";
import { Dimensions } from "react-native";
import io from "socket.io-client";
import { REACT_APP_SERVER } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const MyContext = createContext();

export const DataProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(0); //Loged-in User Information Json recived on login
  const [allGames, updateAllGames] = useState(0); //Access Token on login
  const [activeGame, setActiveGame] = useState(0); //Access Token on login
  const [windowWidth, setWindowWidth] = useState(
    Dimensions.get("window").width
  );
  const [windowHeight, setWindowHeight] = useState(
    Dimensions.get("window").height
  );
  const [socket, setSocket] = useState(null);
  const [socketInitialized, setSocketInitialized] = useState(false);

  useEffect(() => {
    if (userInfo) {
      const initializeSocket = async () => {
        const accessToken = await AsyncStorage.getItem("accessToken");
        const newSocket = io(REACT_APP_SERVER, {
          extraHeaders: accessToken
            ? {
                Authorization: `Bearer ${accessToken}`,
              }
            : {},
        });

        newSocket.on("disconnect", () => {
          console.log("Socket disconnected");
          setSocketInitialized(false);
        });
        setSocket(newSocket);
        setSocketInitialized(true);
      };

      initializeSocket();
    }
  }, [userInfo]);

  const value = {
    userInfo,
    setUserInfo,
    allGames,
    updateAllGames,
    activeGame,
    setActiveGame,
    windowWidth,
    windowHeight,
    socket,
    socketInitialized,
  };

  return <MyContext.Provider value={value}>{children}</MyContext.Provider>;
};
