import React, { useEffect, useContext } from "react";

import { GameContext } from "../../../providers/GameDataProvider";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
} from "react-native";

import { useTheme } from "react-native-paper";

const AddPlayersModal = ({
  visible,
  onClose,
  addPlayersToDb,
  handleResponse,
}) => {
  const {
    players,
    localPlayersSelected,
    setLocalPlayersSelected,
    availablePlayers,
    setAvailablePlayers,
  } = useContext(GameContext);

  const theme = useTheme();
  const { colors, fonts } = theme;
  const styles = getStyles({
    colors: colors,
    fonts: fonts,
  });

  useEffect(() => {}, [availablePlayers]);

  const toggleSelection = (player) => {
    const isSelected =
      localPlayersSelected &&
      localPlayersSelected.some((p) => p.username === player.username);
    if (isSelected) {
      setLocalPlayersSelected((prevSelected) =>
        prevSelected.filter((prevPlayer) => prevPlayer !== player)
      );
    } else {
      setLocalPlayersSelected((prevSelected) => {
        const newSelected = [...prevSelected, player];
        return newSelected;
      });
    }
  };

  const handleAddPlayer = () => {
    setAvailablePlayers((prevAvailable) =>
      prevAvailable.filter(
        (prevPlayer) => !localPlayersSelected.includes(prevPlayer)
      )
    );
    onClose();
    if (addPlayersToDb) {
      addPlayersToDb();
    }
  };

  useEffect(() => {}, [localPlayersSelected]);

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalContainer}>
        <ScrollView
          style={styles.scrollViewContainer}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ alignItems: "center" }}
        >
          {availablePlayers &&
            availablePlayers.map((player, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.modalItem,
                  {
                    backgroundColor: localPlayersSelected?.includes(player)
                      ? colors.onPrimary
                      : colors.onPrimary,
                    boxShadow: localPlayersSelected?.includes(player)
                      ? `${colors.onSurface} 0px 0px 25px`
                      : "",
                  },
                ]}
                onPress={() => toggleSelection(player)}
              >
                <Text
                  style={[
                    styles.modalItemText,
                    {
                      color: players?.includes(player)
                        ? colors.primary
                        : colors.scrim,
                    },
                  ]}
                >
                  {player.username}
                </Text>
              </TouchableOpacity>
            ))}
        </ScrollView>
        <View style={styles.selectedAddPlayerButtonContainer}>
          <TouchableOpacity onPress={onClose} style={styles.modalButton}>
            <Text style={styles.modalButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleAddPlayer}
            style={styles.modalButton}
          >
            {localPlayersSelected.length > 0 ? (
              <Text style={styles.modalButtonText}>Add Players</Text>
            ) : (
              <View style={[styles.modalButton, styles.disabledButton]}>
                <Text style={[styles.modalButtonText, { color: "gray" }]}>
                  Add Players
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
const getStyles = ({ colors, fonts }) => {
  return StyleSheet.create({
    modalContainer: {
      height: "40%",
      width: "90%",
      bottom: 0,
      margin: 24,
      alignItems: "center",
      borderRadius: 20,
      position: "absolute",
      backgroundColor: colors.primary,
    },
    scrollViewContainer: {
      height: "100%",
      width: "95%",
      marginHorizontal: 48,
      marginVertical: 24,
      borderRadius: 20,
    },
    modalItem: {
      height: 120,
      width: 120,
      borderRadius: 24,
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      margin: 16,
    },
    modalItemText: {
      color: colors.onPrimary,
      fontFamily: fonts.regular.fontFamily,
      fontSize: 26,
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

export default AddPlayersModal;
