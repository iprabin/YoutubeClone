import React from "react";
import {
  Dimensions,
  StyleSheet,
  View,
  TouchableOpacity,
  useWindowDimensions,
  Text,
  ActivityIndicator,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  Extrapolate,
  interpolate,
  withSequence,
  withTiming,
  useSharedValue,
} from "react-native-reanimated";
import { Video } from "expo-av";
import ytdl from "react-native-ytdl";
import { DataContext } from "./DataContext";
import { TapGestureHandler } from "react-native-gesture-handler";
import { MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import { Enums } from "./Cell";

const { height } = Dimensions.get("window");

const PlayerView = ({ top, ww }) => {
  const { width } = useWindowDimensions();
  const [playing, setPlaying] = React.useState(true);
  const playerRef = React.useRef(null);
  const [url, setUrl] = React.useState("");
  const [status, setStatus] = React.useState(null);
  const bOpacity = useSharedValue(0);
  const FOpacity = useSharedValue(0);
  const [load, setLoad] = React.useState(false);
  const { setCurrIndex, setCurrVideo, currVideo, currPlaylist, currIndex } =
    React.useContext(DataContext);

  React.useEffect(() => {
    const getVideoUrl = async () => {
      const youtubeURL = `http://www.youtube.com/watch?v=${currVideo.id}`;
      const urls = await ytdl(youtubeURL);
      setUrl(urls[0].url);
    };
    getVideoUrl();

    return async () => {
      setUrl("");
      setPlaying(false);
      await playerRef.current.unloadAsync();
    };
  }, [currVideo.id]);

  const innerView = useAnimatedStyle(() => {
    const h = interpolate(
      top.value,
      [0, height - 140],
      [210, 50],
      Extrapolate.CLAMP
    );
    return {
      width: ww.value,
      height: h,
    };
  });
  const iim = useAnimatedStyle(() => {
    const opacity = interpolate(
      top.value,
      [height - 200, height - 140],
      [0, 1],
      Extrapolate.CLAMP
    );
    return { opacity };
  });
  const inm = useAnimatedStyle(() => {
    const opacity = interpolate(
      top.value,
      [height - 200, height - 140],
      [1, -100],
      Extrapolate.CLAMP
    );
    const zIndex = interpolate(
      top.value,
      [height - 200, height - 140],
      [20, -20],
      Extrapolate.CLAMP
    );
    return { opacity, zIndex };
  });
  const imm = useAnimatedStyle(() => {
    const opacity = interpolate(
      top.value,
      [height - 200, height - 140],
      [1, -100],
      Extrapolate.CLAMP
    );
    const zIndex = interpolate(
      top.value,
      [height - 200, height - 140],
      [20, -20],
      Extrapolate.CLAMP
    );
    return { opacity, zIndex };
  });
  const playVideo = async () => {
    setPlaying(!playing);
    if (playing) {
      await playerRef.current.pauseAsync();
    } else {
      await playerRef.current.playAsync();
    }
  };

  const ShowBack = useAnimatedStyle(() => {
    return {
      opacity: withSequence(
        withTiming(bOpacity.value),
        withTiming(0, { duration: 500 }, () => {
          bOpacity.value = 0;
        })
      ),
    };
  });

  const ShowFore = useAnimatedStyle(() => {
    return {
      opacity: withSequence(
        withTiming(FOpacity.value),
        withTiming(0, { duration: 500 }, () => {
          FOpacity.value = 0;
        })
      ),
    };
  });

  return (
    <View style={styles.rowView}>
      <Animated.View style={innerView}>
        <Video
          style={{ height: "100%", width: "100%" }}
          source={{ uri: url }}
          resizeMode="contain"
          isMuted={false}
          shouldPlay
          ref={playerRef}
          onPlaybackStatusUpdate={(e) => {
            setStatus(e);
            setPlaying(e.isPlaying ? e.isPlaying : false);
            if (e.didJustFinish && Enums.Playlist) {
              setCurrVideo(currPlaylist[currIndex + 1]);
              setCurrIndex(currIndex + 1);
            }
          }}
          onLoad={() => setLoad(true)}
          onFullscreenUpdate={() => setPlaying(true)}
        />

        <View style={styles.overlay}>
          {!url && !load ? (
            <View
              style={{
                height: "100%",
                width: "100%",
                backgroundColor: "rgba(0,0,0,0.2)",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ActivityIndicator size="large" color="white" />
            </View>
          ) : (
            <>
              <Animated.View style={[inm, styles.threeBtn]}>
                <TapGestureHandler
                  numberOfTaps={2}
                  onActivated={() => {
                    playerRef.current.setPositionAsync(
                      status.positionMillis - 10000
                    );
                    bOpacity.value = 1;
                  }}
                >
                  <View
                    style={{
                      width: width / 3,
                      height: "100%",
                      alignItems: "center",
                    }}
                  >
                    <Animated.View style={ShowBack}>
                      <MaterialCommunityIcons
                        name="skip-backward-outline"
                        size={24}
                        color="white"
                      />
                      <Text style={{ color: "white" }}>Skip 10 sec</Text>
                    </Animated.View>
                  </View>
                </TapGestureHandler>

                <TouchableOpacity
                  onPress={async () => await playVideo()}
                  style={[styles.play, { width: width / 3 }]}
                >
                  <Feather
                    name={playing ? "pause" : "play"}
                    size={40}
                    color="white"
                  />
                </TouchableOpacity>
                <TapGestureHandler
                  numberOfTaps={2}
                  onActivated={() => {
                    playerRef.current.setPositionAsync(
                      status.positionMillis + 10000
                    );
                    FOpacity.value = 1;
                  }}
                >
                  <View
                    style={{
                      width: width / 3,
                      height: "100%",
                      alignItems: "center",
                    }}
                  >
                    <Animated.View style={ShowFore}>
                      <MaterialCommunityIcons
                        name="skip-forward-outline"
                        size={24}
                        color="white"
                      />
                      <Text style={{ color: "white" }}>Skip 10 sec</Text>
                    </Animated.View>
                  </View>
                </TapGestureHandler>
              </Animated.View>
              <Animated.View
                style={[imm, { position: "absolute", bottom: 10, right: 10 }]}
              >
                <TouchableOpacity
                  onPress={() => playerRef.current.presentFullscreenPlayer()}
                >
                  <MaterialCommunityIcons
                    name="fullscreen"
                    size={30}
                    color="white"
                  />
                </TouchableOpacity>
              </Animated.View>
              <TouchableOpacity
                activeOpacity={1}
                style={styles.seekExterior}
                onPress={(e) =>
                  playerRef.current.setPositionAsync(
                    status.durationMillis * (e.nativeEvent.locationX / width)
                  )
                }
              >
                {status && (
                  <View
                    style={[
                      styles.seekInterior,
                      {
                        width: `${
                          (status.positionMillis / status.durationMillis) * 100
                        }%`,
                      },
                    ]}
                  />
                )}
              </TouchableOpacity>
            </>
          )}
        </View>
      </Animated.View>
      <Animated.View
        style={[iim, { backgroundColor: "#000", flexDirection: "row" }]}
      >
        <Animated.Text
          style={[styles.cross, { width: "67%", fontWeight: "400" }]}
          numberOfLines={1}
          ellipsizeMode={"tail"}
        >
          {currVideo.title}
        </Animated.Text>
        <TouchableOpacity
          onPress={() => {
            setCurrVideo(null);
            setCurrIndex(0);
          }}
          style={{ padding: 5, marginTop: 8 }}
        >
          <MaterialCommunityIcons name="close" size={27} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={async () => await playVideo()}
          style={{ padding: 5, marginTop: 8 }}
        >
          <Feather name={playing ? "pause" : "play"} size={24} color="white" />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

export default PlayerView;

const styles = StyleSheet.create({
  rowView: {
    flexDirection: "row",
  },
  overlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  cross: { color: "#fff", top: 15, left: 10, fontSize: 17, fontWeight: "700" },
  threeBtn: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  seekExterior: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 5,
    backgroundColor: "gray",
  },
  seekInterior: {
    backgroundColor: "red",
    height: 5,
    justifyContent: "center",
  },
  play: { justifyContent: "center", alignItems: "center" },
});

{
  /* <YoutubePlayer
            height={"100%"}
            videoId={currVideo.id}
            play={playing}
            ref={playerRef}
            onReady={() => !playing && setPlaying(true)}
            onChangeState={(e) => {
              if (e == "ended" && types == Enums.Playlist) {
                setPlaying(false);
                setCurrVideo(currPlaylist[currIndex + 1]);
                setCurrIndex(currIndex + 1);
              } else if (e == "ended") {
                setPlaying(false);
              }
            }}
          /> */
}
