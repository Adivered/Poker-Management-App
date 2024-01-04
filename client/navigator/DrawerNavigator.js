import React, { useState, useContext } from "react";
import { useWindowDimensions } from "react-native";
import AppNavigator from "../navigator/AppNavigator";
import ProfileScreen from "../views/Profile/ProfileScreen";
import SettingsScreen from "../views/Settings/SettingsScreen";
import { GameDataProvider } from "../providers/GameDataProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
} from "@react-navigation/drawer";
import { SvgXml } from "react-native-svg"; // Import the necessary library
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Icon2 from "react-native-vector-icons/Ionicons";
import { useFocusEffect } from "@react-navigation/native";
import makeApiRequest from "../providers/ApiRequest";
import { MyContext } from "../providers/DataProvider";
import { useTheme } from "react-native-paper";
const CustomDrawerContent = (props) => {
  const [userConnected, setUserConnected] = useState(false);
  const { userInfo, setUserInfo } = useContext(MyContext);
  console.log("userInfo: ", userInfo);
  if (
    userInfo.profile_picture?.assets &&
    userInfo.profile_picture.assets.length > 0
  ) {
    // If an image is selected, render the image
    const selectedImage = getProfilePicture.assets[0];
    console.log("selectedImage: ", selectedImage);
  }
  const logout = async () => {
    const refreshToken = await AsyncStorage.getItem("refreshToken");
    async function clearCache() {
      try {
        await AsyncStorage.clear();
        setUserInfo(null);
      } catch (exception) {
        console.log("Failed to clear cache: ", exception);
      }
    }
    const path = "logout";
    const method = "POST";

    const callback = () => {
      clearCache();
      props.navigation.navigate("Home");
    };

    const argument = {
      successCodes: [200], // Add any other success codes if needed
      errorMsgTitle: "Error logging out",
    };

    makeApiRequest(path, method, refreshToken, callback, argument);
  };

  const checkUserConnection = async () => {
    const refreshToken = await AsyncStorage.getItem("refreshToken");
    setUserConnected(refreshToken);
  };

  useFocusEffect(() => {
    checkUserConnection();
  });

  return (
    <View style={props.styles.container}>
      <DrawerContentScrollView {...props}>
        <View style={props.styles.topContainer}>
          <Image
            source={{ uri: userInfo?.profile_picture }} // Assuming profile_picture is a URI
            style={props.styles.profile}
          />
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={props.styles.title}>{userInfo?.first_name}</Text>
            <Icon2 name="ios-arrow-down" size={20} color="#00acee" />
          </View>

          <Text style={props.styles.username}>{userInfo?.username}</Text>
          <View style={props.styles.data}>
            <View style={props.styles.following}>
              <Text style={props.styles.number}>{userInfo?.profit}</Text>
              <Text style={props.styles.text}> Profit</Text>
            </View>
            <View style={props.styles.followers}>
              <Text style={props.styles.number}>{userInfo?.loss}</Text>
              <Text style={props.styles.text}> Loss</Text>
            </View>
          </View>
        </View>
        <DrawerItem
          label={() => <Text style={props.styles.Homepage}>Homepage</Text>}
          onPress={() => props.navigation.navigate("Home")}
          icon={() => <Icon name="account-outline" size={22} color="#898f93" />}
        />
        {userConnected && (
          <>
            <DrawerItem
              label={() => <Text style={props.styles.Profile}>Profile</Text>}
              onPress={() => props.navigation.navigate("Profile")}
              icon={() => <Icon name="text" size={22} color="#898f93" />}
            />
            <DrawerItem
              label={() => <Text style={props.styles.Profile}>Settings</Text>}
              onPress={() => props.navigation.navigate("Settings")}
              icon={() => <Icon name="text" size={22} color="#898f93" />}
            />
            <TouchableOpacity
              style={{ padding: 10, paddingLeft: 15 }}
              onPress={logout}
            >
              <Text style={props.styles.optionText}>Logout</Text>
            </TouchableOpacity>
          </>
        )}
      </DrawerContentScrollView>
    </View>
  );
};

export function DrawerNavigator() {
  const Drawer = createDrawerNavigator();
  const { windowWidth, windowHeight } = useContext(MyContext);
  const isLargeScreen = windowWidth >= 768;
  const theme = useTheme();
  const { colors, fonts } = theme;
  const styles = getStyles({
    colors: colors,
    fonts: fonts,
    windowWidth,
    windowHeight,
  });
  return (
    <GameDataProvider>
      <Drawer.Navigator
        defaultStatus="closed"
        edgeWidth={100}
        initialRouteName="Homepage"
        screenOptions={{
          headerShown: false,
          drawerType: isLargeScreen ? "permanent" : "back",
          drawerStyle: isLargeScreen ? { width: "20%" } : { width: "60%" },
        }}
        drawerContent={(props) => (
          <CustomDrawerContent {...props} styles={styles} />
        )}
      >
        <Drawer.Screen
          name="Homepage"
          component={AppNavigator}
          initialParams={{ screen: "Home" }}
        />
        <Drawer.Screen name="Profile" component={ProfileScreen} />
        <Drawer.Screen name="Settings" component={SettingsScreen} />
      </Drawer.Navigator>
    </GameDataProvider>
  );
}

const getStyles = ({ windowWidth, windowHeight, colors, fonts }) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.primary,
    },
    topContainer: {
      padding: 15,
      borderBottomWidth: 0.2,
      borderBottomColor: "#2b353c",
    },
    Profile: {
      fontFamily: fonts.regular.fontFamily,
      color: colors.onPrimary,
    },
    Homepage: {
      fontFamily: fonts.regular.fontFamily,
      color: colors.onPrimary,
    },
    profile: {
      height: 60,
      width: 60,
      borderRadius: 30,
    },
    title: {
      fontSize: 18,
      fontFamily: fonts.regular.fontFamily,
      color: colors.onPrimary,
      fontWeight: "bold",
      marginTop: 10,
    },
    username: {
      fontSize: 18,
      fontFamily: fonts.regular.fontFamily,
      color: colors.secondary,
    },
    data: {
      flexDirection: "row",
      marginTop: 15,
    },
    following: {
      flexDirection: "row",
      marginRight: 15,
    },
    followers: {
      flexDirection: "row",
    },
    number: {
      fontSize: 16,
      fontWeight: "bold",
      fontFamily: fonts.regular.fontFamily,
      color: colors.onPrimary,
    },
    text: {
      fontSize: 16,
      fontFamily: fonts.regular.fontFamily,
      color: "#898f93",
    },
    label: {
      fontSize: 18,
      fontFamily: fonts.regular.fontFamily,
      color: colors.onPrimary,
    },
    optionText: {
      fontSize: 18,
      color: colors.onPrimary,
      fontFamily: fonts.regular.fontFamily,
      // fontWeight: 'bold',
    },
  });
};

export default DrawerNavigator;
