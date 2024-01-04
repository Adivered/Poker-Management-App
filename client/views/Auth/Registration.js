import React, { useState, useContext } from "react";
import {
  FlatList,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { MyContext } from "../../providers/DataProvider";
import makeApiRequest from "../../providers/ApiRequest";
import { REACT_APP_SERVER } from "@env";
import RegistrationSlides from "./RegistrationSlides";
import { useTheme } from "react-native-paper";

const slides = [
  {
    id: "1",
  },
  {
    id: "2",
  },
  {
    id: "3",
  },
  {
    id: "4",
  },
];

const RegistrationScreen = ({ navigation }) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const { windowWidth, windowHeight } = useContext(MyContext);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const theme = useTheme();
  const { colors, fonts } = theme;
  const styles = getStyles({
    colors: colors,
    fonts: fonts,
    windowWidth,
    windowHeight,
  });
  const ref = React.useRef();

  const isSignUpButtonEnabled = () => {
    const areFieldsFilled =
      firstName !== "" &&
      lastName !== "" &&
      username !== "" &&
      password !== "" &&
      email !== "" &&
      phoneNumber !== "" &&
      profilePicture !== "";
    return areFieldsFilled && currentSlideIndex !== 0;
  };

  const updateCurrentSlideIndex = (e) => {
    const contentOffsetX = e.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(contentOffsetX / windowWidth);
    setCurrentSlideIndex(currentIndex);
  };

  const goToNextSlide = () => {
    const nextSlideIndex = currentSlideIndex + 1;
    if (nextSlideIndex != slides.length) {
      const offset = nextSlideIndex * windowWidth;
      ref?.current.scrollToOffset({ offset });
      setCurrentSlideIndex(currentSlideIndex + 1);
    }
  };

  const goToPrevSlide = () => {
    const prevSlideIndex = currentSlideIndex - 1;
    if (prevSlideIndex != slides.length) {
      const offset = prevSlideIndex * windowWidth;
      ref?.current.scrollToOffset({ offset });
      setCurrentSlideIndex(currentSlideIndex - 1);
    }
  };

  const Footer = () => {
    const isLastSlide = currentSlideIndex === slides.length - 1;

    return (
      <View
        style={{
          justifyContent: "space-between",
          width: windowWidth * 0.6,
        }}
      >
        {/* Indicator container */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            paddingBottom: 40,
            width: "80%",
          }}
        >
          {/* Render indicator */}
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                currentSlideIndex === index && {
                  backgroundColor: colors.onPrimary,
                  width: 25,
                },
              ]}
            />
          ))}
        </View>

        {/* Render buttons */}
        <View style={{ marginBottom: 20, width: "80%" }}>
          {currentSlideIndex === 0 ? (
            // If it's the first page, don't show the back button
            <View style={{ flexDirection: "row" }}>
              <View style={{ flex: 1 }} />
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={goToNextSlide}
                style={styles.btn}
              >
                <Text
                  style={{
                    fontWeight: "bold",
                    fontSize: 15,
                    fontFamily: fonts.regular.fontFamily,
                  }}
                >
                  NEXT
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            // If it's not the first page, show the back button
            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity
                activeOpacity={0.8}
                style={[
                  styles.btn,
                  {
                    borderColor: colors.onPrimary,
                    borderWidth: 1,
                    backgroundColor: "transparent",
                  },
                ]}
                onPress={goToPrevSlide}
              >
                <Text
                  style={{
                    fontWeight: "bold",
                    fontSize: 15,
                    fontFamily: fonts.regular.fontFamily,
                    color: colors.onPrimary,
                  }}
                >
                  Back
                </Text>
              </TouchableOpacity>
              <View style={{ width: 15 }} />
              {isLastSlide ? (
                // If it's the last slide, show the Sign Up button instead of Next
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={sendSignUpRequest}
                  style={[
                    styles.btn,
                    isSignUpButtonEnabled()
                      ? null
                      : {
                          backgroundColor: "gray",
                          opacity: 0.6,
                          alignItems: "center",
                        },
                  ]}
                  disabled={!isSignUpButtonEnabled()}
                >
                  <Text
                    style={{
                      fontWeight: "bold",
                      fontSize: 15,
                      fontFamily: fonts.regular.fontFamily,
                      color: isSignUpButtonEnabled() ? colors.primary : "#666",
                    }}
                  >
                    SIGN UP
                  </Text>
                </TouchableOpacity>
              ) : (
                // If it's not the last slide, show the Next button
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={goToNextSlide}
                  style={styles.btn}
                >
                  <Text
                    style={{
                      fontWeight: "bold",
                      fontSize: 15,
                      fontFamily: fonts.regular.fontFamily,
                    }}
                  >
                    NEXT
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      </View>
    );
  };

  const renderItem = ({ item }) => {
    return (
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          paddingRight: 32,
        }}
      >
        <View style={{ width: windowWidth, height: windowHeight * 0.35 }}>
          <RegistrationSlides
            colors={colors}
            fonts={fonts}
            windowWidth={windowWidth}
            windowHeight={windowHeight}
            item={item}
            getFirstName={firstName}
            setFirstName={setFirstName}
            getLastName={lastName}
            setLastName={setLastName}
            getUsername={username}
            setUsername={setUsername}
            getPassword={password}
            setPassword={setPassword}
            getEmail={email}
            setEmail={setEmail}
            getPhoneNumber={phoneNumber}
            setPhoneNumber={setPhoneNumber}
            getProfilePicture={profilePicture}
            setProfilePicture={setProfilePicture}
          />
        </View>
        <View
          style={{
            width: windowWidth * 0.8,
          }}
        >
          <Footer />
        </View>
      </View>
    );
  };

  function handleResponse(response) {
    if (response.approved) {
      console.log("User signed-up successfully!");
      navigation.navigate("Login");
    } else console.log(response.msg);
  }

  function sendSignUpRequest() {
    makeApiRequest("sign_up", "POST", "", handleResponse, {
      payload: {
        firstname: firstName,
        lastname: lastName,
        username: username,
        password: password,
        email: email,
        phonenumber: phoneNumber,
        profilepicture: profilePicture,
      },

      errorMsgTitle: "Couldn't connect to server",
      successCodes: [401, 500, 200, 201],
    });
  }

  const handleLoginPress = () => {
    navigation.navigate("Login");
  };

  return (
    <View style={styles.container}>
      <View style={styles.boardContainer}>
        <FlatList
          ref={ref}
          onMomentumScrollEnd={updateCurrentSlideIndex}
          onScroll={updateCurrentSlideIndex}
          contentContainerStyle={{ flexGrow: 1 }}
          showsHorizontalScrollIndicator={false}
          horizontal
          data={slides}
          pagingEnabled
          renderItem={renderItem}
        />
      </View>
    </View>
  );
};

const getStyles = ({ colors, fonts, windowHeight, windowWidth }) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.background,
      height: windowHeight,
      width: windowWidth,
      padding: 32,
    },
    boardContainer: {
      height: windowHeight * 0.7,
      marginTop: 64,
      padding: 32,
      width: "100%",
      borderRadius: 40,
      backgroundColor: colors.primary,
    },
    btn: {
      flex: 1,
      height: 50,
      borderRadius: 5,
      backgroundColor: colors.background,
      justifyContent: "center",
      alignItems: "center",
    },
    indicator: {
      height: 2.5,
      width: 10,
      backgroundColor: "grey",
      marginHorizontal: 3,
      borderRadius: 2,
    },
  });

export default RegistrationScreen;
