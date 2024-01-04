import React from "react";
import { View, Image, Text, StyleSheet } from "react-native";
import PropTypes from "prop-types";

class FooterIcon extends React.Component {
  render() {
    const { icon, text, color } = this.props;
    const styles = StyleSheet.create({
      container: {
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: "32px",
        gap: "16px",
      },

      text: {
        color: "#ffffff",
        fontFamily: "Card-Characters",
        fontSize: "12pt",
        fontWeight: "200",
        letterSpacing: 1.6,
        textAlign: "center",
      },
      icon: {
        height: 45,
        width: 45,
      },
    });
    return (
      <View style={styles.container}>
        <View style={styles.iconGroup}>
          <Image style={styles.icon} source={{ uri: icon }} tintColor={color} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.text}>{text}</Text>
        </View>
      </View>
    );
  }
}

FooterIcon.propTypes = {
  icon: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
};

export default FooterIcon;
