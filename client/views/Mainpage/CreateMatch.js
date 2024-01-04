import React, { useState, useContext } from "react";
import { GameContext } from "../../providers/GameDataProvider";
import { MyContext } from "../../providers/DataProvider";
import makeApiRequest from "../../providers/ApiRequest";
import {
  StyleSheet,
  FlatList,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import Slides from "./CreateMatch/Slides";
import { useTheme } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
const slides = [
  {
    id: "1",
    image: require("../../assets/icons/pirates.svg"),
    title: "Great.",
    subtitle: "How many players?",
    rank: "A",
    shape: "heart",
    fill: "#FE019A",
    shadowColor: "#FE019A",
  },
  {
    id: "2",
    image: require("../../assets/icons/dices.svg"),
    subtitle: "Where?",
    rank: "A",
    shape: "spade",
    fill: "#CFFF04",
    shadowColor: "#CFFF04",
  },
  {
    id: "3",
    image: require("../../assets/icons/pirates.svg"),
    subtitle: "Creating Match...",
    rank: "A",
    shape: "club",
    fill: "#39FF14",
    shadowColor: "#39FF14",
  },
];

const CreateMatch = ({ navigation }) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const {
    location,
    pricePerEntry,
    localPlayersSelected,
    setLocalPlayersSelected,
    setPlayers,
    setPot,
    setEntries,
    setGameID,
    setIsGameAdmin,
    setAvailablePlayers,
  } = useContext(GameContext);
  const { userInfo, windowWidth, windowHeight } = useContext(MyContext);
  const theme = useTheme();
  const { colors, fonts } = theme;
  const styles = getStyles({
    colors: colors,
    windowHeight,
    windowWidth,
    fonts: fonts,
  });

  async function handleResponse(data) {
    try {
      console.log("Data from create match: ", data);
      setEntries(data.entries);
      setPot(data.pot);
      setPlayers(data.players);
      setAvailablePlayers(data.availablePlayers);
      setGameID(data.gameid);
      if (data.createdBy == userInfo.id) {
        setIsGameAdmin(true);
      }
      navigation.navigate("GameLobby");
      setLocalPlayersSelected([]);
    } catch (error) {
      console.error("Error storing data in AsyncStorage:", error);
    }
  }

  const createGame = async () => {
    const accessToken = await AsyncStorage.getItem("accessToken");
    makeApiRequest("create_game", "POST", accessToken, handleResponse, {
      payload: {
        game_active: true,
        created_by: userInfo.id,
        location: location,
        price_per_entry: pricePerEntry,
        players: localPlayersSelected,
      },
      errorMsgTitle: "Couldn't connect to server",
      successCodes: [401, 500, 200, 201],
    });
  };

  const ref = React.useRef();

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

  const skip = () => {
    const lastSlideIndex = slides.length - 1;
    const offset = lastSlideIndex * windowWidth;
    ref?.current.scrollToOffset({ offset });
    setCurrentSlideIndex(lastSlideIndex);
  };

  const Footer = () => {
    return (
      <View
        style={{
          height: "20%",
          bottom: 32,
          position: "absolute",
          paddingHorizontal: 16,
          alignSelf: "center",
          width: windowWidth * 0.75,
          justifyContent: "center",
        }}
      >
        {/* Indicator container */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            paddingBottom: 40,
          }}
        >
          {/* Render indicator */}
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                currentSlideIndex == index && {
                  backgroundColor: colors.primary,
                  width: 25,
                },
              ]}
            />
          ))}
        </View>

        {/* Render buttons */}
        <View style={{ marginBottom: 20 }}>
          {currentSlideIndex == slides.length - 1 ? (
            <View style={{ height: 50 }}>
              <TouchableOpacity style={styles.btn} onPress={createGame}>
                <Text
                  style={{
                    fontSize: 15,
                    fontFamily: fonts.regular.fontFamily,
                  }}
                >
                  GET STARTED
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity
                activeOpacity={0.8}
                style={[
                  styles.btn,
                  {
                    borderColor: colors.primary,
                    borderWidth: 1,
                    backgroundColor: "transparent",
                  },
                ]}
                onPress={skip}
              >
                <Text
                  style={{
                    fontWeight: "bold",
                    fontSize: 15,
                    fontFamily: fonts.regular.fontFamily,
                    color: colors.primary,
                  }}
                >
                  SKIP
                </Text>
              </TouchableOpacity>
              <View style={{ width: 15 }} />
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
          )}
        </View>
      </View>
    );
  };

  const renderItem = ({ item }) => {
    return (
      <View
        style={{
          width: windowWidth * 0.9,
          height: windowHeight,
        }}
      >
        <Slides
          item={item}
          props={{ colors, fonts, windowWidth, windowHeight }}
        />
        <Footer />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={ref}
        onMomentumScrollEnd={updateCurrentSlideIndex}
        showsHorizontalScrollIndicator={false}
        horizontal
        data={slides}
        pagingEnabled
        renderItem={renderItem}
      />
    </View>
  );
};

const getStyles = ({ colors, windowWidth, windowHeight, fonts }) => {
  return StyleSheet.create({
    container: {
      padding: 16,
      paddingTop: 24,
      backgroundColor: colors.background,
    },

    subtitle: {
      fontFamily: fonts.regular.fontFamily,
      color: colors.primary,
      fontSize: 22,
      marginTop: 10,
      maxWidth: windowWidth * 0.4,
      textAlign: "center",
    },
    title: {
      color: colors.primary,
      fontFamily: fonts.regular.fontFamily,
      fontSize: 34,
      textAlign: "center",
      fontWeight: "bold",
      marginTop: 20,
      maxWidth: windowWidth * 0.4,
      textAlign: "center",
    },
    image: {
      height: "100%",
      width: "100%",
      resizeMode: "contain",
    },
    indicator: {
      height: 2.5,
      width: 10,
      backgroundColor: "grey",
      marginHorizontal: 3,
      borderRadius: 2,
    },
    btn: {
      flex: 1,
      height: 50,
      borderRadius: 5,
      backgroundColor: colors.primary,
      justifyContent: "center",
      alignItems: "center",
    },
    textInput: {
      height: 40,
      width: windowWidth * 0.35,
      color: colors.primary,
      fontFamily: fonts.regular.fontFamily,
      textAlign: "center",
      margin: 12,
      padding: 10,
      marginTop: 25,
    },
  });
};
export default CreateMatch;
