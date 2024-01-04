import React, { useState, useContext } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import makeApiRequest from "../../../providers/ApiRequest";
import AddPlayersModal from "./AddPlayersModal";
import { GameContext } from "../../../providers/GameDataProvider";
const AddAnother = ({ props }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const {
    gameID,
    setAvailablePlayers,
    localPlayersSelected,
    setLocalPlayersSelected,
  } = useContext(GameContext);
  const styles = getStyles({
    colors: props.colors,
    windowWidth: props.windowWidth,
    fonts: props.fonts,
  });

  async function handleResponse(data) {
    try {
      console.log("Data from add players to db: ", data);
      setAvailablePlayers(data.availablePlayers);
      setLocalPlayersSelected([]);
    } catch (error) {
      console.error("Error storing data in AsyncStorage:", error);
    }
  }

  const addPlayersToDb = async () => {
    const accessToken = await AsyncStorage.getItem("accessToken");
    makeApiRequest("add_players_to_game", "POST", accessToken, handleResponse, {
      payload: {
        players: localPlayersSelected,
        game_id: gameID,
      },
      errorMsgTitle: "Couldn't connect to server",
      successCodes: [401, 500, 200, 201],
    });
  };

  return (
    <View>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={styles.addButton}
      >
        <Text style={[styles.addIcon, { color: "#fff" }]}>+</Text>
        <Text style={styles.addText}>Add</Text>
      </TouchableOpacity>
      <AddPlayersModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
        }}
        addPlayersToDb={addPlayersToDb}
        handleResponse={handleResponse}
      />
    </View>
  );
};
const getStyles = ({ colors, windowWidth, fonts }) => {
  return StyleSheet.create({
    addIcon: {
      fontSize: "100pt",
      fontFamily: fonts.regular.fontFamily,
    },
    addText: {
      fontSize: 20,
      fontFamily: fonts.regular.fontFamily,
      color: colors.onPrimary,
    },
    addButton: {
      height: 240,
      width: 90,
      marginTop: 48,
      alignItems: "center",
    },
    modalContainer: {
      height: "40%",
      width: "90%",
      bottom: 0,
      margin: 24,
      alignItems: "center",
      borderRadius: 20,
      position: "absolute",
      backgroundColor: "hsla(272, 100%, 5%, 1)",
    },
    scrollViewContainer: {
      height: "100%",
      width: "95%",
      marginHorizontal: 48,
      marginVertical: 24,
      borderRadius: 20,
      backgroundColor: "hsla(272, 100%, 5%, 1)",
    },
    modalItem: {
      height: 120,
      width: 120,
      borderRadius: 24,
      flexDirection: "column",
      backgroundColor: "hsla(272, 100%, 10%, 1)",
      alignItems: "center",
      justifyContent: "center",
      margin: 16,
    },
    modalItemText: {
      color: colors.onPrimary,
      fontFamily: fonts.regular.fontFamily,
      fontWeight: "bold",
      fontSize: "16pt",
    },
    selectedAddPlayerButtonContainer: {
      height: "20%",
      width: "90%",
      position: "absolute",
      bottom: 40,
      borderRadius: 32,
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
    },
    modalButton: {
      flex: 1,
      height: 50,
      justifyContent: "center",
      alignItems: "center",
    },
    modalButtonText: {
      fontFamily: fonts.regular.fontFamily,
      fontSize: 20,
      fontWeight: "bold",
      color: colors.onPrimary,
    },
  });
};

export default AddAnother;
