import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import React, { useState, useContext } from "react";
import { GameContext } from "../../../providers/GameDataProvider";
import AddPlayersModal from "../Game/AddPlayersModal";

const Slide1 = ({ styles }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const { localPlayersSelected } = useContext(GameContext);
  const renderSelectedPlayers = () => {
    if (localPlayersSelected.length === 0) {
      return (
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Text style={styles.addIcon}>+</Text>
          <Text style={styles.addText}>Add Players</Text>
        </TouchableOpacity>
      );
    }

    return (
      <View style={styles.selectedPlayersContainer}>
        {localPlayersSelected.map((player, index) => (
          <View key={index} style={styles.selectedPlayerItem}>
            <Text style={styles.selectedPlayerText}>
              {index + 1}. {player.username}
            </Text>
          </View>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {renderSelectedPlayers()}
      <AddPlayersModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
};

const Slide2 = ({ styles }) => {
  const { pricePerEntry, setPricePerEntry, setLocation } =
    useContext(GameContext);
  const handlePriceChange = (text) => {
    const newPrice = text.trim() !== "" ? parseInt(text, 10) : 0;
    setPricePerEntry(newPrice);
  };

  const handleLocationChange = (text) => {
    setLocation(text);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.subtitle}>Price Per Entry:</Text>
      <TextInput
        onChangeText={handlePriceChange}
        keyboardType="numeric"
        value={pricePerEntry}
        style={styles.textInput}
      />
      <Text style={styles.subtitle}>Location:</Text>
      <TextInput
        onChangeText={handleLocationChange}
        placeholder="optional"
        style={styles.textInput}
      />
    </View>
  );
};

const Slides = ({ item, props }) => {
  const styles = getStyles({
    colors: props.colors,
    windowWidth: props.windowWidth,
    fonts: props.fonts,
  });
  switch (item.id) {
    case "1":
      return <Slide1 styles={styles} />;
    case "2":
      return <Slide2 styles={styles} />;
  }
};

const getStyles = ({ colors, windowWidth, fonts }) => {
  return StyleSheet.create({
    container: {
      height: "80%",
      width: "100%",
      alignItems: "center",
      justifyContent: "center",
    },

    subtitle: {
      fontFamily: fonts.regular.fontFamily,
      color: colors.primary,
      fontSize: 22,
      marginTop: 10,
      maxWidth: windowWidth * 0.4,
      textAlign: "center",
    },
    textInput: {
      height: 40,
      width: windowWidth * 0.7,
      color: colors.primary,
      fontFamily: fonts.regular.fontFamily,
      textAlign: "center",
      margin: 12,
      boxShadow: "#FE019A 0px 0px 2px",
      padding: 10,
      marginTop: 25,
    },
    addText: {
      fontSize: 32,
      fontFamily: fonts.regular.fontFamily,
      color: colors.primary,
    },

    addIcon: {
      textAlign: "center",
      fontFamily: fonts.regular.fontFamily,
      fontSize: 48,
      color: colors.primary,
    },
    selectedPlayersContainer: {
      flex: 1,
      width: "100%",
      flexDirection: "row",
      flexWrap: "wrap",
      alignItems: "center",
    },
    selectedPlayerItem: {
      width: "50%",
      padding: 8,
      alignItems: "center",
    },
    selectedPlayerText: {
      fontSize: 20,
      color: colors.primary,
      fontFamily: fonts.regular.fontFamily,
      fontWeight: "bold",
    },
  });
};
export default Slides;
