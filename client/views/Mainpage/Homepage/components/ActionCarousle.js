import React from "react";
import { Animated, TouchableOpacity, StyleSheet, Platform } from "react-native";
import Card, { getCards } from "../../../../components/Card/Card";

const Item = ({ item, style }) => {
  return (
    <TouchableOpacity onPress={item.onPress} style={style}>
      <Card props={item} />
    </TouchableOpacity>
  );
};

const ActionCarousle = ({ props }) => {
  const scrollX = React.useRef(new Animated.Value(0)).current;
  const cards = getCards();
  const styles = getStyles({
    colors: props.theme.colors,
    windowHeight: props.windowHeight,
    windowWidth: props.windowWidth,
    fonts: props.theme.fonts,
  });

  const renderItem = ({ item, index }) => {
    return (
      <Animated.View
        style={{
          width: "100%",
          paddingHorizontal: 10,

          //transform: [{ translateY }],
        }}
      >
        <Item style={styles.item} item={item} onPress={item.onPress} />
      </Animated.View>
    );
  };
  return (
    <Animated.FlatList
      data={cards}
      renderItem={renderItem}
      horizontal
      bounces={false}
      decelerationRate={Platform.OS === "ios" ? 0 : 0.98}
      renderToHardwareTextureAndroid
      snapToAlignment="start"
      snapToInterval={25}
      onScroll={Animated.event(
        [{ nativeEvent: { contentOffset: { x: scrollX } } }],
        { useNativeDriver: false }
      )}
      contentContainerStyle={{
        width: props.windowWidth,
        alignItems: "center",
      }}
      scrollEventThrottle={24}
      keyExtractor={(item) => item.id}
      showsHorizontalScrollIndicator={false}
    />
  );
};

const getStyles = ({ colors, windowWidth, windowHeight, fonts }) => {
  return StyleSheet.create({
    item: {
      width: windowWidth * 0.5,
      height: windowHeight * 0.2,
    },
  });
};

export default ActionCarousle;
