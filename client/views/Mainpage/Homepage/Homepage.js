import React, { useState, useEffect, useContext } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Text,
} from "react-native";
import AppLogo from "./components/AppLogo";
import Actions from "./components/Actions";
import PhotosFrame from "./components/PhotosFrame";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MyContext } from "../../../providers/DataProvider";
import { useIsFocused } from "@react-navigation/native";
import { refreshTokenUser } from "../../../providers/TokenRefreshHandler";
import { useTheme } from "react-native-paper";

const Homepage = ({ navigation }) => {
  const {
    userInfo,
    setUserInfo,
    socket,
    socketInitialized,
    windowHeight,
    windowWidth,
  } = useContext(MyContext);
  const [loading, setLoading] = useState(true);
  const isFocused = useIsFocused();
  const theme = useTheme();
  const { colors, fonts } = theme;
  const styles = getStyles({
    colors: colors,
    windowHeight,
    windowWidth,
    fonts: fonts,
  });

  const handleRefreshToken = async () => {
    try {
      const refreshToken = await AsyncStorage.getItem("refreshToken");
      if (refreshToken) {
        await refreshTokenUser(refreshToken, setUserInfo, navigation);
      } else {
        console.warn("No refresh token present.");
      }
    } catch (error) {
      console.error("Error handling token refresh:", error.message);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      // Fetch user information here
      // ...

      // Simulate loading delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setLoading(false);
    };

    fetchData();
  }, [socket, userInfo, loading, isFocused]);

  useEffect(() => {
    if (!socketInitialized || !socket || !isFocused) {
      return; // Socket is not initialized yet
    }

    console.log("Component is mounting");
    socket.on("players_added", (data) => {
      if (
        data.playersAdded.includes(userInfo.username) ||
        data.playersAdded.some(
          (player) => player.username === userInfo.username
        )
      ) {
        handleRefreshToken();
        navigation.navigate("GameLobby");
      }
    });

    return () => {
      console.log("Component is unmounting");
    };
  }, [socket]);

  const renderWelcomeContent = () => (
    <View style={styles.helloContent} id="helloContent">
      <Text style={styles.textWrapper}>
        Hello {userInfo && userInfo.first_name}
      </Text>
    </View>
  );

  const renderSignInSignUpDrawer = () => (
    <View style={styles.signInSignUpDrawer}>
      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={styles.drawerOption}>Sign In</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
        <Text style={styles.drawerOption}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ScrollView
      style={styles.div2}
      id="div2"
      contentContainerStyle={{
        paddingBottom: 60,
      }}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
    >
      {loading ? (
        <View style={styles.loadingContainer}>
          {/* Add a loading indicator or message if needed */}
          <Text style={styles.textWrapper}>Loading...</Text>
        </View>
      ) : !userInfo ? (
        <>
          <View style={styles.appLogo}>
            <AppLogo props={{ windowWidth, windowHeight, colors, fonts }} />
          </View>
          {renderSignInSignUpDrawer()}
        </>
      ) : (
        <>
          {renderWelcomeContent()}
          <PhotosFrame
            props={{ navigation, windowWidth, windowHeight, theme }}
          />
          <Actions props={{ navigation, windowWidth, windowHeight, theme }} />
        </>
      )}
    </ScrollView>
  );
};

const getStyles = ({ colors, windowWidth, windowHeight, fonts }) => {
  return StyleSheet.create({
    div2: {
      backgroundColor: colors.background,
    },

    header: {
      justifyContent: "space-between",
      alignItems: "center",
      top: 8,
      flexDirection: "row",
    },

    appLogo: {
      alignItems: "center",
    },

    helloContent: {
      paddingTop: 64,
      paddingLeft: 56,
    },

    textWrapper: {
      color: colors.primary,
      fontFamily: fonts.regular.fontFamily,
      fontSize: 28,
      //letterSpacing: 1.6,
    },

    signInSignUpDrawer: {
      marginTop: 64,
      paddingLeft: 48,
    },
    loadingContainer: {
      height: 600,
      width: "100%",
      alignItems: "center",
      justifyContent: "center",
    },
    drawerOption: {
      color: colors.primary,
      fontFamily: fonts.regular.fontFamily,
      fontSize: "18pt",
      letterSpacing: 1.6,
      textShadow: "#bc13fe80 0px 0px 5px",
      marginBottom: 16,
    },
  });
};

export default Homepage;
