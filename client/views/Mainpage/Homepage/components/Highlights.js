import React from "react";
import { View, StyleSheet } from "react-native";
import PropTypes from "prop-types";
import Loser from "./Loser"; // Make sure to adjust the import path
import Winner from "./Winner"; // Make sure to adjust the import path

class Highlights extends React.Component {
  render() {
    const { winnerEllipse, loserEllipse } = this.props;

    return (
      <View style={styles.photosFrame}>
        <View style={styles.winnerElipseView}>
          <Winner ellipse={winnerEllipse} />
        </View>
        <View style={styles.loserElipseView}>
          <Loser ellipse={loserEllipse} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  photosFrame: {
    flexDirection: "row",
    height: "70%",
    width: "100%",
    justifyContent: "center",
    paddingHorizontal: 8,
  },

  winnerElipseView: {
    flex: 0.5,
  },
  loserElipseView: {
    flex: 0.5,
  },
});

Highlights.propTypes = {
  winnerEllipse: PropTypes.string,
  loserEllipse: PropTypes.string,
};

export default Highlights;
