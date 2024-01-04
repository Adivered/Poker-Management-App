import React from "react";
import { TouchableOpacity, View, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

const NavBarFrame = () => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() => navigation.toggleDrawer()}
      style={styles.container}
    >
      <View style={styles.navBarRectangle} />
      <View style={styles.navBarRectangle} />
      <View style={styles.navBarRectangle} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  navBarRectangle: {
    backgroundColor: "#bc13fe",
    height: 3,
    width: 45,
  },
});

export default NavBarFrame;
