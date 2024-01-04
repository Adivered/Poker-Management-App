import React, { Component } from "react";
import { View, Image, Text, StyleSheet } from "react-native";
import PropTypes from "prop-types";

class Winner extends Component {
  render() {
    const { ellipse } = this.props;

    return (
      <View style={styles.winner}>
        <View style={styles.winnerLogoView}>
          <Image
            style={styles.winnerLogo}
            source={require("../../../../assets/icons/winner.svg")}
          />
        </View>
        <View style={styles.elipseView}>
          <Image style={styles.ellipse} source={{ uri: ellipse }} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  winner: {
    flex: 1,
    alignItems: "center",
    flexDirection: "column",
    gap: 24,
  },

  winnerLogoView: {
    flex: 0.4,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },

  winnerLogo: {
    height: 85,
    width: 85,
    textShadow: "#fe019a80 0px 0px 5px",
  },

  elipseView: {
    width: "100%",
    flex: 1,
  },

  ellipse: {
    height: "100%",
    width: "100%",
  },
});

Winner.propTypes = {
  ellipse: PropTypes.string,
};

export default Winner;
