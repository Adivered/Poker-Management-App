import React, { useContext } from "react";
import Counter from "react-native-counters";
import {
  TouchableOpacity,
  ImageBackground,
  Text,
  View,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import makeApiRequest from "../../../providers/ApiRequest";
import { GameContext } from "../../../providers/GameDataProvider";
import { MyContext } from "../../../providers/DataProvider";
import { FontAwesome } from "@expo/vector-icons";
const PlayerItem = ({ props }) => {
  const {
    gameID,
    isGameAdmin,
    updatePlayerEntries,
    pricePerEntry,
    removePlayer,
    setAvailablePlayers,
  } = useContext(GameContext);
  const { socket } = useContext(MyContext);
  const styles = getStyles({
    colors: props.props.colors,
    fonts: props.props.fonts,
    windowHeight: props.props.windowHeight,
    windowWidth: props.props.windowWidth,
  });

  async function handleAddEntryResponse(data) {
    try {
      console.log("Data from add entries to db: ", data);
      updatePlayerEntries(props.item.username, data.newPlayerEntries);
      socket.emit("entry_updated", {
        pot: data.pot,
        entries: data.entries,
        players: data.players,
      });
    } catch (error) {
      console.error("Error storing data in AsyncStorage:", error);
    }
  }

  const addEntry = async (value) => {
    const accessToken = await AsyncStorage.getItem("accessToken");
    makeApiRequest(
      "add_entry_to_player",
      "POST",
      accessToken,
      handleAddEntryResponse,
      {
        payload: {
          player: props.item.id,
          game_id: gameID,
          entries: value,
        },
        errorMsgTitle: "Couldn't connect to server",
        successCodes: [401, 500, 200, 201],
      }
    );
  };

  async function handleRemoveResponse(data) {
    try {
      console.log("Data from remove player in db: ", data);
      removePlayer(props.item.username);
      setAvailablePlayers(data.availablePlayers);
      socket.emit("player_removed", {
        pot: data.pot,
        entries: data.entries,
        players: data.players,
        playerRemoved: data.player_removed,
      });
    } catch (error) {
      console.error("Error storing data in AsyncStorage:", error);
    }
  }

  const removePlayerInDb = async () => {
    const accessToken = await AsyncStorage.getItem("accessToken");
    makeApiRequest(
      "remove_player_from_game",
      "POST",
      accessToken,
      handleRemoveResponse,
      {
        payload: {
          player: props.item.id,
          game_id: gameID,
        },
        errorMsgTitle: "Couldn't connect to server",
        successCodes: [401, 500, 200, 201],
      }
    );
  };

  return (
    <TouchableOpacity onPress={props.onPress} style={styles.item}>
      <ImageBackground
        style={[styles.imgBackground, { boxShadow: props.boxShadow }]}
        resizeMode="cover"
        imageStyle={{ borderRadius: 100 }}
        source={require("../../../assets/profiles/1.jpg")}
      >
        {isGameAdmin && (
          <View style={styles.adminContainer}>
            <Counter
              start={props.item.entries}
              min={1}
              max={20}
              buttonStyle={{
                borderColor: props.color,
                borderWidth: 2,
                borderRadius: 100,
              }}
              buttonTextStyle={{
                color: props.color,
                fontSize: 16,
                fontFamily: props.props.fonts.regular.fontFamily,
              }}
              countTextStyle={{
                color: props.color,
                fontSize: 16,
                fontFamily: props.props.fonts.regular.fontFamily,
              }}
              onChange={addEntry}
            />
            <View>
              <FontAwesome
                name="trash"
                size={25}
                color={props.props.colors.background}
                style={styles.trash}
                onPress={removePlayerInDb}
              />
            </View>
          </View>
        )}
      </ImageBackground>
      <Text style={[styles.title, { color: props.color }]}>
        {props.item.username}
      </Text>
      <Text style={[styles.entriesTextWrapper, { color: props.color }]}>
        Entries: {props.item.entries}
      </Text>
      <Text style={[styles.entriesTextWrapper, { color: props.color }]}>
        Total: {props.item.entries * pricePerEntry}
      </Text>
    </TouchableOpacity>
  );
};

const getStyles = ({ colors, windowHeight, windowWidth, fonts }) => {
  return StyleSheet.create({
    item: {
      height: "100%",
      width: "100%",
      //backgroundColor: "blue",
      padding: 32,
      margin: 16,
    },
    title: {
      textAlign: "center",
      fontSize: 22,
      fontWeight: 200,
      fontFamily: fonts.regular.fontFamily,
      maxWidth: "65%",
    },
    imgBackground: {
      height: "40%",
      width: "80%",
      //backgroundColor: "red",
      //borderRadius: 100,
      //boxShadow: `rgba(188, 19, 254, 1) 0px 0px 15px`,
      //right: 0,
    },
    entriesContainer: {
      paddingTop: 70,
      paddingBottom: 16,
      gap: 8,
    },
    entriesTextWrapper: {
      fontSize: 20,
      fontFamily: fonts.regular.fontFamily,
    },
    trash: {
      //position: "absolute",
      //right: 8,
      //bottom: 24,
    },
    adminContainer: {
      paddingTop: 56,
      //gap: 48,
    },
  });
};

export default PlayerItem;
