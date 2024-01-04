import React from "react";
import { View, StyleSheet } from "react-native";
import FooterIcon from "./FooterIcon"; // Make sure to adjust the import path

class Footer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View style={styles.footer}>
        <FooterIcon
          icon={require("../assets/icons/poker.svg")}
          text="Player"
          color="#39FF14"
        />
        <FooterIcon
          icon={require("../assets/icons/casino-woman.svg")}
          text="Home"
          color="#FE019A"
        />
        <FooterIcon
          icon={require("../assets/icons/settings.svg")}
          text="Settings"
          color="#CFFF04"
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  footer: {
    backgroundColor: "#1b0033",
    padding: "16px",
    justifyContent: "center",
    flexDirection: "row",
    height: "100%",
  },
});

export default Footer;
