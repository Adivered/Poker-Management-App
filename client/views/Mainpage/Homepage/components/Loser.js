import React from "react";
import { View, Image, StyleSheet } from "react-native";
import PropTypes from "prop-types";

class Loser extends React.Component {
  render() {
    const { ellipse } = this.props;

    return (
      <View style={styles.loser}>
        <View style={styles.loserLogoView}>
          <Image
            style={styles.loserLogo}
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
  loser: {
    flex: 1,
    alignItems: "center",
    flexDirection: "column",
    gap: 16,
  },

  loserLogoView: {
    flex: 0.4,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },

  loserLogo: {
    height: 85,
    width: 85,
    boxShadow: "#fe019a80 0px 0px 5px",
  },

  elipseView: {
    flex: 0.6,
    width: "100%",
    flex: 1,
  },

  ellipse: {
    height: "100%",
    width: "100%",
  },
});

Loser.propTypes = {
  ellipse: PropTypes.string,
};

export default Loser;
