import React, { useState, useContext, useEffect } from "react";
import {
  TouchableOpacity,
  TextInput,
  View,
  Text,
  StyleSheet,
} from "react-native";
import PropTypes from "prop-types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MyContext } from "../../providers/DataProvider";
import makeApiRequest from "../../providers/ApiRequest";
import { REACT_APP_SERVER } from "@env";
import { useTheme } from "react-native-paper";

const LoginScreen = ({ navigation }) => {
  const { setUserInfo, windowWidth, windowHeight } = useContext(MyContext);
  const theme = useTheme();
  const { colors, fonts } = theme;
  const styles = getStyles({ windowWidth, windowHeight, colors, fonts });

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    setUserInfo();
  }, []);

  /**
   * Handles the API response after login.
   *
   * @param {Object} data - Response data from the API.
   * @returns {void}
   */
  async function handleResponse(data) {
    if (data.access_token) {
      try {
        const {
          refresh_token,
          token_life_span,
          access_token,
          username,
          ...userData
        } = data;
        console.log("Login Data: ", data);
        await AsyncStorage.setItem("accessToken", access_token);
        await AsyncStorage.setItem("refreshToken", refresh_token);
        await AsyncStorage.setItem("tokenLifeSpan", token_life_span);
        await AsyncStorage.setItem("username", username);
        setUserInfo({
          ...userData, // Spread the existing userData
          username, // Add the username
        });
        if (data.activeGame) {
          // User is a part of a session
          await AsyncStorage.setItem(
            "activeGame",
            JSON.stringify(data.activeGame)
          );
          navigation.navigate("GameLobby");
        } else {
          navigation.navigate("Home");
        }
      } catch (error) {
        console.error("Error storing data in AsyncStorage:", error);
      }
    } else {
      console.log(data.msg);
    }
  }

  /**
   * Initiates the login process by making an API request.
   */
  function sendLoginRequest() {
    makeApiRequest("get_token", "POST", "", handleResponse, {
      payload: { username: username, password: password },
      errorMsgTitle: "Couldn't connect to server",
      successCodes: [401, 500, 200, 201],
    });
  }

  const handleSignUpPress = () => {
    navigation.navigate("SignUp");
  };

  return (
    <View style={styles.container}>
      <View style={styles.boardContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.subHeaderWrapper}>
            Sign in to your account to continue
          </Text>
        </View>

        <View style={styles.labelWrapper}>
          <Text style={styles.textWrapper}>Username</Text>
          <TextInput
            onChangeText={setUsername}
            value={username}
            style={styles.input}
          />
        </View>
        <View style={styles.labelWrapper}>
          <Text style={styles.textWrapper}>Password</Text>
          <TextInput
            secureTextEntry={true}
            onChangeText={setPassword}
            value={password}
            style={styles.input}
          />
        </View>

        <TouchableOpacity
          title="Login"
          onPress={sendLoginRequest}
          style={styles.loginButton}
        >
          <Text style={styles.buttontextWrapper}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ marginTop: 8 }} onPress={handleSignUpPress}>
          <Text style={styles.textWrapper}>Not a user? Sign-up!</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

LoginScreen.propTypes = {
  /**
   * Navigation object provided by React Navigation.
   */
  navigation: PropTypes.object.isRequired,
};

const getStyles = ({ windowHeight, windowWidth, colors, fonts }) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.background,
      height: windowHeight,
      width: windowWidth,
      padding: 32,
    },

    boardContainer: {
      height: "70%",
      marginTop: 64,
      padding: 32,
      width: "100%",
      borderRadius: 40,
      backgroundColor: colors.primary,
    },

    headerContainer: {
      height: "20%",
      alignItems: "center",
      justifyContent: "center",
    },

    labelWrapper: {
      height: "25%",
      gap: 12,
      paddingHorizontal: 32,
    },

    textWrapper: {
      fontFamily: fonts.regular.fontFamily,
      fontSize: 12,
      color: colors.onPrimary,
    },
    subHeaderWrapper: {
      fontFamily: fonts.regular.fontFamily,
      fontSize: 13,
      color: colors.onPrimary,
    },
    buttontextWrapper: {
      fontFamily: fonts.regular.fontFamily,
      fontSize: 22,
      fontWeight: "bold",
      color: colors.primary,
    },
    input: {
      height: "30%",
      backgroundColor: colors.background,
      borderRadius: 12,
      fontFamily: fonts.regular.fontFamily,
      fontSize: 12,
      padding: 16,
    },
    loginButton: {
      height: "15%",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.onPrimary,
      borderRadius: 25,
      color: colors.primary,
    },
  });

export default LoginScreen;
