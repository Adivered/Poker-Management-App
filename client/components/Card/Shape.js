import React from "react";
import { View, Text, StyleSheet } from "react-native";

const CardShapeView = ({ shape, scale, fill, shadowColor }) => {
  let shapeView;
  const size = scale || 100;
  const styles = getStyles({ shadowColor, fill, size });

  switch (shape) {
    case "diamond":
      shapeView = (
        <View style={styles.diamondWrapper}>
          <View style={styles.diamond} />
        </View>
      );
      break;
    case "heart":
      shapeView = (
        <View style={styles.heart}>
          <View style={styles.heartBefore} />
          <View style={styles.heartAfter} />
        </View>
      );

      break;
    case "spade":
      shapeView = (
        <View style={styles.spadeContainer}>
          <View style={styles.spade}>
            <View style={styles.heart}>
              <View style={styles.heartBefore} />
              <View style={styles.heartAfter} />
            </View>
          </View>
          <View style={styles.tale} />
        </View>
      );
      break;
    case "club":
      shapeView = (
        <View style={styles.marginContainer}>
          <View style={styles.clubContainer}>
            <View style={styles.clubBefore}></View>
            <View style={styles.clubAfter}></View>
          </View>
        </View>
      );
      break;
    default:
      shapeView = <Text>Invalid shape</Text>;
  }

  return <View>{shapeView}</View>;
};

const getStyles = ({ shadowColor, size, fill }) =>
  StyleSheet.create({
    diamondWrapper: {
      flex: 1,
    },
    diamond: {
      backgroundColor: fill,
      height: size,
      width: size,
      marginTop: size * 0.1,
      transform: [
        { rotate: "67.5deg" },
        { skewX: "45deg" },
        { scaleY: Math.cos(45 * (Math.PI / 180)).toString() },
      ],
    },

    heart: {
      position: "relative",
      width: size,
      height: size,
      marginTop: size * 0.1,
    },
    heartBefore: {
      position: "absolute",
      top: 0,
      width: size / 2 + 2,
      height: size * 0.8,
      borderTopLeftRadius: size / 2,
      borderTopRightRadius: size / 2,
      borderBottomRightRadius: 0,
      borderBottomLeftRadius: 0,
      backgroundColor: fill,
      left: size / 2 + 1.7,
      transform: [{ rotate: "-45deg" }],
      transformOrigin: "0 100%",
      //boxShadow: `${shadowColor} 0px 0px 10px`,
    },
    heartAfter: {
      position: "absolute",
      top: 0,
      width: size / 2 + 2,
      height: size * 0.8,
      borderTopLeftRadius: size / 2,
      borderTopRightRadius: size / 2,
      borderBottomRightRadius: 0,
      borderBottomLeftRadius: 0,
      backgroundColor: fill,
      transform: [{ rotate: "45deg" }],
      transformOrigin: "100% 100%",
    },
    spadeContainer: {
      position: "absolute",
      alignItems: "center",
    },
    spade: {
      transform: [{ rotate: "180deg" }],
    },
    tale: {
      borderLeftWidth: 4,
      borderLeftColor: "transparent",
      borderRightWidth: 4,
      borderRightColor: "transparent",
      borderTopWidth: 20,
      borderTopColor: fill,
      transform: [{ rotate: "180deg" }],
      marginTop: -17,
      marginLeft: -4,
      //boxShadow: `${shadowColor} 0px 0px 10px`,
    },
    marginContainer: {
      left: -8,
    },

    clubContainer: {
      width: size,
      height: size * 0.9,
      width: 0,
      borderBottomWidth: size,
      borderColor: fill,
      borderLeftWidth: size * 0.3,
      borderRightWidth: size * 0.3,
      transform: [{ translateX: 40 }],
      marginLeft: -26,
      //boxShadow: `${shadowColor} 0px 0px 30px`,
    },
    clubBefore: {
      width: size * 0.7,
      height: size * 0.7,
      backgroundColor: fill,
      borderRadius: size * 0.4,
      top: size * -0.2,
      left: size * -0.38,
    },
    clubAfter: {
      position: "absolute",
      width: size * 0.6,
      height: size * 0.6,
      backgroundColor: fill,
      borderRadius: size * 4,
      left: size * -0.7,
      top: size * 0.25,
      shadowOffset: { width: size - 6, height: 0 },
      shadowColor: fill,
      shadowOpacity: 1,
      shadowRadius: 0,
    },
  });
export default CardShapeView;
