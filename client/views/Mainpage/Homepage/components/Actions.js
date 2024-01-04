import React from "react";
import { View, StyleSheet, Text } from "react-native";
import ActionCarousle from "./ActionCarousle";

const Actions = ({ props }) => {
  const styles = getStyles({
    colors: props.theme.colors,
    windowHeight: props.windowHeight,
    windowWidth: props.windowWidth,
    fonts: props.theme.fonts,
  });

  return (
    <View style={styles.container}>
      <Text style={styles.textWrapper}>Actions</Text>
      <View style={styles.actionsCarousleInstance}>
        <ActionCarousle props={props} />
      </View>
    </View>
  );
};

const getStyles = ({ colors, windowWidth, windowHeight, fonts }) => {
  return StyleSheet.create({
    container: {
      gap: 24,
      paddingTop: 128,
      height: windowHeight * 0.4,
      width: windowWidth,
    },

    textWrapper: {
      paddingLeft: 56,
      color: colors.primary,
      fontFamily: fonts.regular.fontFamily,
      fontSize: 26,
    },
    actionsCarousleInstance: {
      alignSelf: "center",
      backgroundColor: colors.primary,
      borderRadius: 30,
      height: "100%",
      width: "90%",
      justifyContent: "center",
    },
  });
};

export default Actions;
