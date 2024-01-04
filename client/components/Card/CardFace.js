import React from "react";
import { View, Text } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const CardFaceView = ({ props }) => {
  let faceView;

  switch (props.face) {
    case "ace":
      faceView = <MaterialIcons name="add" size={75} color={props.fill} />;
      break;
    case "king":
      faceView = <MaterialIcons name="history" size={75} color={props.fill} />;

      break;
    case "queen":
      faceView = (
        <MaterialIcons name="leaderboard" size={75} color={props.fill} />
      );
      break;
    case "jack":
      faceView = (
        <MaterialIcons name="attach-money" size={75} color={props.fill} />
      );
      break;

    default:
      faceView = <Text></Text>;
  }

  return (
    <View
      style={{
        height: "65%",
        width: "100%",
        paddingTop: 32,
        paddingLeft: 8,
      }}
    >
      {faceView}
    </View>
  );
};
export default CardFaceView;
