import { ScrollView, FlatList } from "react-native";
import React, { useState, useContext, useMemo } from "react";
import AddAnother from "./AddAnother";
import PlayerItem from "./PlayerItem";
import { GameContext } from "../../../providers/GameDataProvider";

const Players = ({ props }) => {
  const [selectedId, setSelectedId] = useState();
  const { players, isGameAdmin } = useContext(GameContext);

  const renderItem = ({ item, index }) => {
    const color = item.id === selectedId ? props.colors.background : "#000";
    const boxShadow =
      item.id === selectedId ? `${props.colors.background} 0px 0px 5px` : "";
    return (
      <PlayerItem
        props={{
          props,
          item,
          onPress: () => setSelectedId(item.id),
          color,
          boxShadow,
        }}
      />
    );
  };

  const memoizedPlayersComponent = useMemo(() => {
    return (
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <FlatList
          data={players}
          horizontal
          contentContainerStyle={{
            height: "100%",
            width: "100%",
          }}
          renderItem={renderItem}
          keyExtractor={(item) => {
            return item.id.toString();
          }}
          extraData={selectedId}
          ListFooterComponent={() => isGameAdmin && <AddAnother />}
        />
      </ScrollView>
    );
  }, [players, selectedId]);

  return memoizedPlayersComponent;
};

export default React.memo(Players);
