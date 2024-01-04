import React, { useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
import CardShapeView from "./Shape";
import CardFaceView from "./CardFace";
import { MyContext } from "../../providers/DataProvider";
import { useTheme } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

export function getCards() {
  const navigation = useNavigation();
  return [
    {
      id: "1",
      face: "ace",
      text: "Create Match",
      rank: "A",
      shape: "diamond",
      scale: 25,
      fill: "#FF073A",
      shadowColor: "#FF073A",
      backgroundColor: "#FFF",
      onPress: () => navigation.navigate("CreateMatch"),
    },
    {
      id: "2",
      text: "Match History",
      face: "king",
      rank: "K",
      shape: "heart",
      scale: 25,
      fill: "#FE019A",
      shadowColor: "#FE019A",
      backgroundColor: "#FFF",

      onPress: () => navigation.navigate("MatchHistory"),
    },
    {
      id: "3",
      text: "Leaderboard",
      face: "queen",
      rank: "Q",
      shape: "club",
      scale: 25,
      fill: "#39FF14",
      shadowColor: "#39FF14",
      backgroundColor: "#FFF",
      onPress: () => navigation.navigate("Leaderboard"),
    },
    {
      id: "4",
      face: "jack",
      text: "Counter",
      rank: "J",
      shape: "spade",
      scale: 25,
      fill: "#CFFF04",
      shadowColor: "#CFFF04",
      backgroundColor: "#FFF",
      onPress: () => navigation.navigate("Counter"),
    },
  ];
}

const Card = ({ props }) => {
  const { windowWidth, windowHeight } = useContext(MyContext);
  const { face, text, rank, scale, shape, fill, shadowColor, backgroundColor } =
    props;
  const theme = useTheme();
  const { colors, fonts } = theme;
  const styles = getStyles({
    windowWidth,
    windowHeight,
    shadowColor,
    backgroundColor,
    fonts: fonts,
    colors: colors,
  });

  return (
    <View style={styles.container}>
      <View style={styles.cardFaceContainer}>
        <CardFaceView props={{ colors, face, fill }} />
        <Text style={styles.textWrapper}>{text}</Text>
      </View>
      <View style={styles.rightCorner}>
        <Text style={styles.rankText}>{rank}</Text>
        <CardShapeView
          shape={shape}
          scale={scale}
          fill={fill}
          shadowColor={shadowColor}
        />
      </View>
    </View>
  );
};
const getStyles = ({ shadowColor, backgroundColor, fonts, colors }) =>
  StyleSheet.create({
    container: {
      alignSelf: "center",
      flexDirection: "row",
      borderRadius: 22,
      backgroundColor: backgroundColor,
      height: "100%",
      width: "80%",
    },

    cardFaceContainer: {
      height: "100%",
      width: "80%",
      paddingLeft: 16,
      gap: 8,
    },

    rightCorner: {
      width: "20%",
      height: "100%",
      paddingTop: 8,
      paddingRight: 16,
      gap: 16,
    },

    textWrapper: {
      color: colors.primary,
      fontFamily: fonts.regular.fontFamily,
      fontWeight: "bold",
      fontSize: 18,
    },

    rankText: {
      color: colors.secondary,
      fontFamily: "Card-Characters",
      fontSize: 36,
    },
  });

export default Card;
