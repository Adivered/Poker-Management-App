import { Dimensions, ScrollView, View, Text, StyleSheet } from "react-native";
import React, { useContext } from "react";
import { GameContext } from "../../../providers/GameDataProvider";
import { BarChart } from "react-native-chart-kit";

const Chart = ({ props }) => {
  const { players } = useContext(GameContext);
  const minEntry = Math.min(...players.map((player) => player.entries));
  const maxEntry = Math.max(...players.map((player) => player.entries));
  const fromNumber = maxEntry > 4 ? maxEntry : 4;

  const data = {
    labels: players.map((player) => player.username),
    datasets: [
      {
        data: players.map((player) => player.entries),
      },
      {
        data: [minEntry],
      },
      {
        data: [maxEntry],
      },
    ],
  };

  const chartConfig = {
    backgroundGradientFrom: "transparent",
    backgroundGradientTo: "transparent",
    barPercentage: 0.4,
    barRadius: 7,
    decimalPlaces: 0,
    propsForLabels: {
      fontSize: 20,
      fontWeight: "bold",
      fontFamily: props.fonts.regular.fontFamily,
    },
    height: 5000,
    fillShadowGradient: props.colors.onPrimary,
    fillShadowGradientOpacity: 1,
    color: (opacity = 0.9) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  };

  const renderBars = () => {
    return (
      <BarChart
        data={data}
        width={Dimensions.get("window").width}
        height={Dimensions.get("window").height * 0.35}
        yAxisInterval={1}
        chartConfig={chartConfig}
        style={{
          marginLeft: -24,
          fontFamily: "Card-Characters",
          fontWeight: "bold",
        }}
        fromZero={true}
        fromNumber={fromNumber}
        showBarTop={true}
        showValuesOnTopOfBars={true}
      />
    );
  };

  return (
    <View style={styles.container}>
      <View style={{ height: 20, width: "100%", alignItems: "center" }}>
        <Text
          style={{
            color: "white",
            fontFamily: "card-characters",
            fontSize: "14pt",
          }}
        >
          Entries
        </Text>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ alignItems: "center" }}
      >
        {renderBars()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 16,
    borderRadius: 25,
  },
});

export default Chart;
