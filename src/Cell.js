import React from "react";
import { Text, TouchableOpacity, View, Image, Dimensions } from "react-native";
import { DataContext } from "./DataContext";
import { Feather } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

const image = require("../assets/yt.png");

export const Enums = {
  Home: 1,
  Trend: 2,
  Playlist: 3,
};

export const Cell = ({ item, type, index }) => {
  const { setCurrVideo, setTypes, currIndex } = React.useContext(DataContext);

  return (
    <TouchableOpacity
      onPress={() => {
        type && setTypes(type);
        setCurrVideo(item);
      }}
      style={{ marginVertical: 10, backgroundColor: "#fff" }}
      activeOpacity={1}
    >
      <View>
        <Image
          style={{ width: "100%", aspectRatio: 1.8 }}
          source={{
            uri: item.thumbnail,
          }}
        />
        <View
          style={{
            position: "absolute",
            backgroundColor: "rgba(0,0,0,0.5)",
            padding: 5,
            right: 0,
            bottom: 0,
          }}
        >
          <Text style={{ color: "white" }}>{item.length}</Text>
        </View>
        {index == currIndex && (
          <View
            style={{
              position: "absolute",
              right: 0,
              left: 0,
              top: 0,
              bottom: 0,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(0,0,0,0.5)",
            }}
          >
            <Feather name="play" size={60} color="white" />
          </View>
        )}
      </View>
      <View style={{ flexDirection: "row", marginHorizontal: 10 }}>
        <View style={{ marginTop: 5, marginRight: 10 }}>
          <Image
            source={item.channelThumb ? { uri: item.channelThumb } : image}
            style={{ height: 40, width: 40, borderRadius: 40 }}
          />
        </View>
        <View>
          <Text
            style={{ marginVertical: 5, fontSize: 17, width: width - 65 }}
            ellipsizeMode="tail"
            numberOfLines={2}
          >
            {item.title}
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text numberOfLines={1} style={{ fontSize: 12 }}>
              {item.uploader}
            </Text>
            {item.time ? (
              <View
                style={{
                  height: 5,
                  width: 5,
                  borderRadius: 5,
                  marginHorizontal: 5,
                  backgroundColor: "rgba(0,0,0,0.4)",
                }}
              />
            ) : null}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              {item.time ? (
                <>
                  <Text style={{ fontSize: 12 }}>{item.views}</Text>
                  <View
                    style={{
                      height: 5,
                      width: 5,
                      borderRadius: 5,
                      marginHorizontal: 5,
                      backgroundColor: "rgba(0,0,0,0.4)",
                    }}
                  />
                </>
              ) : (
                <View
                  style={{
                    marginLeft: 10,
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      height: 5,
                      width: 5,
                      backgroundColor: "red",
                      borderRadius: 5,
                      marginRight: 2,
                    }}
                  />
                  <Text style={{ fontSize: 12 }}>Live</Text>
                </View>
              )}
              <Text style={{ fontSize: 12 }}>{item.time}</Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};
