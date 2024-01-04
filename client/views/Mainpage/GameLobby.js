import { ScrollView, Text, View, StyleSheet } from "react-native";
import React, { useContext, useEffect } from "react";
import Chart from "./Game/BarChart";
import Players from "./Game/Players";
import { GameContext } from "../../providers/GameDataProvider";
import { MyContext } from "../../providers/DataProvider";
import { refreshTokenUser } from "../../providers/TokenRefreshHandler";
import { useTheme } from "react-native-paper";

import AsyncStorage from "@react-native-async-storage/async-storage";
const GameLobby = ({ navigation, route }) => {
  const {
    players,
    availablePlayers,
    pot,
    entries,
    clearUserData,
    setGameID,
    setPlayers,
    setLocation,
    setEntries,
    setPot,
    setIsGameAdmin,
    setPricePerEntry,
    setAvailablePlayers,
    setGameActive,
  } = useContext(GameContext);
  const { userInfo, setUserInfo, socket, windowWidth, windowHeight } =
    useContext(MyContext);
  const theme = useTheme();
  const { colors, fonts } = theme;
  const styles = getStyles({
    colors: colors,
    windowHeight,
    windowWidth,
    fonts: fonts,
  });
  const setGameState = (stateObject) => {
    setEntries(stateObject.entries);
    setPot(stateObject.pot);
    setLocation(stateObject.location);
    setGameActive(true);
    setGameID(stateObject.game_id);
    setPricePerEntry(stateObject.price_per_entry);
    setPlayers(stateObject.players);
    setAvailablePlayers(stateObject.availablePlayers);
    if (stateObject.created_by === userInfo.id) {
      setIsGameAdmin(stateObject.created_by);
    }
  };

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

  const fetchData = async () => {
    const storedActiveGame = await AsyncStorage.getItem("activeGame");
    if (storedActiveGame) {
      const activeGameObject = JSON.parse(storedActiveGame);
      setGameState(activeGameObject);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInfo]);

  useEffect(() => {
    if (!socket) {
      return; // Socket is not initialized yet
    }
    console.log("Component is mounting in GameLobby");
    socket.on("players_added", (data) => {
      setPot(data.pot);
      setEntries(data.entries);
      setPlayers(data.players);
    });

    socket.on("player_removed", (data) => {
      setPot(data.pot);
      setEntries(data.entries);
      setPlayers(data.players);
      if (userInfo.id == data.playerRemoved) {
        clearUserData();
        AsyncStorage.removeItem("activeGame");
        handleRefreshToken();
        navigation.navigate("Homepage");
      }
    });

    socket.on("entry_updated", (data) => {
      setPot(data.pot);
      setEntries(data.entries);
      setPlayers(data.players);
    });

    // Clean up event listeners when the component unmounts
    return () => {
      console.log("Component is unmounting in GameLobby");
    };
  }, [socket, userInfo, players, availablePlayers]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.FlatListContainer}>
        <Text style={styles.lobbyText}>Players</Text>
        <View style={styles.PlayersContainer}>
          <Players props={{ colors, fonts, windowHeight, windowWidth }} />
        </View>
      </View>

      {players && players.length > 0 && (
        <View style={styles.statisticsContainer}>
          <Text style={styles.lobbyText}>Statistics:</Text>
          <View style={styles.boardContainer}>
            <Text style={styles.statisticText}>Pot: {pot}</Text>
            <Text style={styles.statisticText}>Entries: {entries}</Text>
            <Chart props={{ colors, fonts, windowHeight, windowWidth }} />
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const getStyles = ({ colors, windowHeight, fonts }) => {
  return StyleSheet.create({
    container: {
      backgroundColor: colors.background,
      paddingBottom: 32,
    },
    FlatListContainer: {
      height: windowHeight * 0.5,
      marginTop: 128,
      gap: 24,
      paddingBottom: 16,
    },

    PlayersContainer: {
      alignSelf: "center",
      borderRadius: 40,
      height: "80%",
      width: "90%",
      backgroundColor: colors.primary,
    },
    lobbyText: {
      fontFamily: fonts.regular.fontFamily,
      fontSize: 28,
      paddingLeft: 56,
      color: colors.primary,
    },

    statisticsContainer: {
      height: windowHeight * 0.6,
      gap: 32,
    },

    boardContainer: {
      alignSelf: "center",
      width: "90%",
      borderRadius: 40,
      backgroundColor: colors.primary,
    },
    statisticText: {
      paddingLeft: 56,
      paddingTop: 24,
      fontFamily: fonts.regular.fontFamily,
      fontSize: 20,
      color: colors.background,
    },

    chartWrapper: {
      flex: 1,
      marginTop: 60,
    },
  });
};

export default GameLobby;
