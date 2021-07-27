import React from "react";
import {
  FlatList,
  StyleSheet,
  View,
  Animated,
  TouchableOpacity,
  Text,
} from "react-native";
import Constants from "expo-constants";
import { removeItem } from "../playlistManager";
import { Cell, Enums } from "./Cell";
import { useNavigation } from "@react-navigation/native";
import { DataContext } from "./DataContext";
import Header from "./Header";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import _ from "lodash";

const Playlist = () => {
  const navigation = useNavigation();

  const {
    playlist,
    loadPlaylist,
    setCurrPlaylist,
    setCurrVideo,
    setTypes,
    setCurrIndex,
  } = React.useContext(DataContext);

  React.useState(() => {
    const focus = navigation.addListener("focus", () => {
      loadPlaylist();
    });
    return () => {
      focus;
    };
  }, [navigation]);

  const renderItem = React.useCallback(
    ({ item, index }) => (
      <Swipeable
        renderRightActions={(_, dragX) => <RightActions dragX={dragX} />}
        onSwipeableRightOpen={async () => {
          await removeItem(index);
          loadPlaylist();
        }}
      >
        <Cell item={item} type={Enums.Playlist} />
      </Swipeable>
    ),
    []
  );

  return (
    <View
      style={{
        paddingTop: Constants.statusBarHeight,
        flex: 1,
        backgroundColor: "#fff",
      }}
    >
      <Header text={"Playlist"} />

      <FlatList
        ListHeaderComponent={
          <View
            style={{
              flexDirection: "row",
              width: "100%",
              justifyContent: "space-around",
            }}
          >
            <TouchableOpacity
              style={styles.btn}
              onPress={() => {
                setCurrIndex(0);
                setCurrPlaylist(playlist);
                setCurrVideo(playlist[0]);
                setTypes(Enums.Playlist);
              }}
            >
              <AntDesign
                name="playcircleo"
                size={24}
                color="white"
                style={{ marginRight: 5 }}
              />
              <Text style={{ color: "white" }}>Play All</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.btn}
              onPress={() => {
                const data = _.shuffle(playlist);
                setCurrPlaylist(data);
                setCurrIndex(0);
                setCurrVideo(data[0]);
                setTypes(Enums.Playlist);
              }}
            >
              <Ionicons
                name="shuffle"
                size={24}
                color="white"
                style={{ marginRight: 5 }}
              />
              <Text style={{ color: "white" }}>Shuffle</Text>
            </TouchableOpacity>
          </View>
        }
        data={playlist}
        renderItem={renderItem}
        keyExtractor={(i) => i.id}
      />
    </View>
  );
};

export default Playlist;

export const RightActions = ({ dragX }) => {
  const scale = dragX.interpolate({
    inputRange: [-100, 0],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  return (
    <Animated.View
      //@ts-ignore
      style={[
        styles.rightAction,
        { opacity: scale, backgroundColor: "#E85D75" },
      ]}
    >
      <Animated.Text
        style={[styles.actionText, { transform: [{ scale }], opacity: scale }]}
      >
        Remove
      </Animated.Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  rightAction: {
    justifyContent: "center",
    alignItems: "flex-end",
    flex: 1,
  },
  actionText: {
    color: "#fff",
    fontWeight: "600",
    padding: 20,
  },
  btn: {
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 10,
    borderRadius: 15,
    alignItems: "center",
    flexDirection: "row",
  },
});
