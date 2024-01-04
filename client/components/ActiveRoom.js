import React from "react";
import { View, Text, StyleSheet } from "react-native";

class ActiveRoom extends React.Component {
  render() {
    return (
      <View style={styles.active}>
        <Text style={styles.textWrapper}>ACTIVE</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  active: {
    backgroundColor: "#39ff14",
    borderRadius: 26,
    boxShadow: "#39ff14 0px 0px 5px",
    height: 42,
    alignItems: "center",
    justifyContent: "center",
    width: 98,
  },
  textWrapper: {
    color: "#ffffff",
    fontFamily: "Card-Characters",
    fontSize: "12pt",
    fontWeight: "700",
    letterSpacing: 1.2,
  },
});

export default ActiveRoom;
