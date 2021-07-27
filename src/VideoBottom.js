import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Cell, Enums } from "./Cell";
import { DataContext } from "./DataContext";
import { addItem } from "../playlistManager";
import Animated, {
  interpolate,
  Extrapolate,
  useAnimatedStyle,
} from "react-native-reanimated";
const { height } = Dimensions.get("window");

const VideoBottom = ({ top, data }) => {
  const { currVideo, search, types, trending, loadPlaylist, currPlaylist } =
    React.useContext(DataContext);

  const iii = useAnimatedStyle(() => {
    const zIndex = interpolate(
      top.value,
      [0, height - 140],
      [20, -100],
      Extrapolate.CLAMP
    );
    const h = interpolate(
      top.value,
      [0, height - 140],
      [height - 250, 0],
      Extrapolate.CLAMP
    );
    const opacity = interpolate(
      top.value,
      [0, height - 140],
      [1, 0],
      Extrapolate.CLAMP
    );
    return { zIndex, height: h, opacity };
  });

  const dataToUse = () => {
    if (data.length > 0) return data;
    else {
      switch (types) {
        case Enums.Home:
          return search;
        case Enums.Playlist:
          return currPlaylist;
        default:
          return trending;
      }
    }
  };

  const renderItem = React.useCallback(
    ({ item, index }) => {
      if (currVideo.id == item.id && types != Enums.Playlist) return null;
      else
        return (
          <Cell
            index={types == Enums.Playlist ? index : null}
            type={types}
            item={{
              ...item,
              uploader: data.length > 0 ? currVideo.uploader : item.uploader,
              channelThumb:
                data.length > 0 ? currVideo.channelThumb : item.channelThumb,
              channelId: data.length > 0 ? currVideo.channelId : item.channelId,
            }}
          />
        );
    },
    [types, data, currVideo.id]
  );

  return (
    <Animated.View style={[iii, { backgroundColor: "#fff" }]}>
      <View style={{ marginHorizontal: 10 }}>
        <Text style={{ fontSize: 20, fontWeight: "600" }} numberOfLines={2}>
          {currVideo.title}
        </Text>
        <View style={[styles.smallContainer, { marginTop: 5 }]}>
          {currVideo.time ? (
            <>
              <Text>{currVideo.views}</Text>
              <View style={styles.dot} />
            </>
          ) : (
            <View style={styles.smallContainer}>
              <View style={styles.liveDot} />
              <Text style={{ fontSize: 14 }}>Live</Text>
            </View>
          )}
          <Text>{currVideo.time}</Text>
        </View>
        <View style={styles.bigContainer}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Image
              source={{ uri: currVideo.channelThumb }}
              style={{ height: 40, width: 40, borderRadius: 68 }}
            />
            <Text style={{ marginLeft: 10, fontSize: 17, fontWeight: "600" }}>
              {currVideo.uploader}
            </Text>
          </View>
          <View style={{ alignItems: "center" }}>
            <TouchableOpacity
              style={{ alignItems: "center" }}
              onPress={async () => {
                if (types != Enums.CurrPlay || types != Enums.Playlist) {
                  await addItem(currVideo);
                  loadPlaylist();
                }
              }}
            >
              <MaterialCommunityIcons
                name="playlist-plus"
                size={15}
                color="black"
              />
              <Text style={{ fontSize: 10 }}>Playlist</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <FlatList
        style={{ backgroundColor: "#fff" }}
        data={dataToUse()}
        keyExtractor={(i) => i.id}
        renderItem={renderItem}
      />
    </Animated.View>
  );
};

export default VideoBottom;

const styles = StyleSheet.create({
  dot: {
    height: 5,
    width: 5,
    borderRadius: 5,
    marginHorizontal: 5,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  liveDot: {
    height: 15,
    width: 15,
    backgroundColor: "red",
    borderRadius: 15,
    marginRight: 2,
  },
  smallContainer: { flexDirection: "row", alignItems: "center" },
  bigContainer: {
    flexDirection: "row",
    marginTop: 10,
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 10,
  },
});
