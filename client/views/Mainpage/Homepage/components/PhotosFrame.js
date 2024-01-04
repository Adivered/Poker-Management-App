import React from "react";
import { View, StyleSheet, Text } from "react-native";
import Highlights from "./Highlights";
const PhotosFrame = ({ props }) => {
  const styles = getStyles({
    colors: props.theme.colors,
    windowHeight: props.windowHeight,
    windowWidth: props.windowWidth,
    fonts: props.theme.fonts,
  });
  return (
    <View style={styles.container}>
      <View style={styles.topicWrapper}>
        <Text style={styles.textWrapper}>Last week highlights</Text>
      </View>
      <View style={styles.photosFrameInstance}>
        <Highlights
          loserEllipse="https://cdn.animaapp.com/projects/656360e699aa09cc825450b1/releases/6563614212c40ceeb6b8f4bd/img/ellipse-3@2x.png"
          winnerEllipse="https://cdn.animaapp.com/projects/656360e699aa09cc825450b1/releases/6563614212c40ceeb6b8f4bd/img/ellipse-2@2x.png"
        />
      </View>
    </View>
  );
};

const getStyles = ({ colors, windowWidth, windowHeight, fonts }) => {
  return StyleSheet.create({
    container: {
      paddingTop: 48,
      height: windowHeight * 0.4,
      width: windowWidth,
      gap: 24,
    },

    topicWrapper: {
      paddingLeft: 56,
      paddingTop: 24,
    },

    photosFrameInstance: {
      alignSelf: "center",
      backgroundColor: colors.primary,
      paddingTop: 32,
      borderRadius: 30,
      width: "90%",
      height: "100%",
    },

    textWrapper: {
      color: colors.primary,
      fontFamily: fonts.medium.fontFamily,
      fontSize: 24,
    },
  });
};

export default PhotosFrame;
