// TokenRefreshHandler.js
import React, { useEffect, useContext, useState } from "react";
import { MyContext } from "./DataProvider";
import { useNavigation } from "@react-navigation/native";
import { REACT_APP_SERVER } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Handles token refresh for the user.
 *
 * @param {string} refreshToken - The refresh token to use for refreshing.
 */
export const refreshTokenUser = async (
  refreshToken,
  setUserInfo,
  navigation
) => {
  try {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${refreshToken}`,
      },
    };

    const response = await fetch(
      `${REACT_APP_SERVER}/refresh_token_user`,
      options
    );
    const data = await response.json();

    if (data.access_token) {
      await AsyncStorage.setItem("refreshToken", data.refresh_token);
      await AsyncStorage.setItem("username", data.username);
      await AsyncStorage.setItem("tokenLifeSpan", data.token_life_span);
      await AsyncStorage.setItem("accessToken", data.access_token);
      setUserInfo(data);
      if (data.activeGame) {
        await AsyncStorage.setItem(
          "activeGame",
          JSON.stringify(data.activeGame)
        );
        navigation.navigate("GameLobby");
      }
    } else {
      throw new Error("Failed to refresh user token");
    }
  } catch (error) {
    console.error("Error refreshing user token:", error.message);
    navigation.navigate("SignUp");
  }
};

/**
 * Component for handling JWT token refresh.
 */
const TokenRefreshHandler = () => {
  const { setUserInfo } = useContext(MyContext);
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const handleTokenRefresh = async () => {
      try {
        setRefreshing(true);

        const refreshToken = await AsyncStorage.getItem("refreshToken");
        const tokenLifeSpan = await AsyncStorage.getItem("tokenLifeSpan");

        if (refreshToken && tokenLifeSpan) {
          if (!refreshToken) {
            // Example: Delayed refresh
            await refreshTokenWithDelay(parseInt(tokenLifeSpan));
          } else {
            // Example: Immediate refresh
            await refreshTokenUser(refreshToken, setUserInfo, navigation);
          }
        } else {
          throw new Error("Refresh token or token life span not available");
        }
      } catch (error) {
        console.error("Error handling token refresh:", error.message);
        navigation.navigate("Home");
      } finally {
        setRefreshing(false);
      }
    };

    handleTokenRefresh();
  }, [setUserInfo, navigation]);

  /**
   * Handles token refresh with a delay.
   *
   * @param {number} delay - The delay in milliseconds before refreshing.
   */
  const refreshTokenWithDelay = async (delay) => {
    try {
      console.log("Delay: ", delay);
      const refreshToken = await AsyncStorage.getItem("refreshToken");

      if (!refreshToken) {
        console.warn(
          "No refresh token present. Unable to refresh token with delay."
        );
        return;
      }

      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${refreshToken}`,
        },
      };

      const response = await new Promise((resolve, reject) => {
        setTimeout(async () => {
          try {
            const res = await fetch(
              `${REACT_APP_SERVER}/refresh_token`,
              options
            );
            resolve(res);
          } catch (error) {
            reject(error);
          }
        }, delay);
      });

      if (response.status === 200) {
        const data = await response.json();
        AsyncStorage.setItem("accessToken", data.access_token);
      } else {
        throw new Error("Failed to refresh token with delay");
      }
    } catch (error) {
      console.error("Error refreshing token with delay:", error.message);
      navigation.navigate("Login");
    }
  };

  return null;
};

export default TokenRefreshHandler;
