import React from "react";
import { View, Text, StyleSheet } from "react-native";

const AppLogo = ({ props }) => {
  const styles = getStyles({
    colors: props.colors,
    windowHeight: props.windowHeight,
    windowWidth: props.windowWidth,
    fonts: props.fonts,
  });
  return (
    <View style={styles.appLogo}>
      <Text style={styles.textWrapper}>POKER CLUB</Text>
      <Text style={styles.textWrapper2}>HEAVY Ad 150</Text>
    </View>
  );
};

const getStyles = ({ colors, windowWidth, windowHeight, fonts }) => {
  return StyleSheet.create({
    appLogo: {
      alignItems: "center",
      paddingTop: 42,
      gap: 16,
    },

    textWrapper: {
      color: colors.primary,
      fontFamily: fonts.regular.fontFamily,
      fontSize: 36,
      textAlign: "center",
      letterSpacing: 1.6,
    },
    textWrapper2: {
      color: colors.primary,
      fontFamily: fonts.regular.fontFamily,
      fontSize: 20,
    },
  });
};

export default AppLogo;
