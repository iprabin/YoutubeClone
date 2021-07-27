import React from "react";
import { Dimensions, StyleSheet, TouchableOpacity } from "react-native";
import Animated, {
  useSharedValue,
  withSpring,
  useAnimatedStyle,
  useAnimatedGestureHandler,
} from "react-native-reanimated";
import { PanGestureHandler } from "react-native-gesture-handler";
import { Enums } from "./Cell";
import { DataContext } from "./DataContext";
import PlayerView from "./PlayerView";
import VideoBottom from "./VideoBottom";

const { height, width } = Dimensions.get("window");

const config = {
  damping: 20,
  mass: 1,
  stiffness: 150,
  overshootClamping: false,
};

const MoreModal = React.memo(() => {
  const bottom = useSharedValue(0);
  const top = useSharedValue(0);
  const ww = useSharedValue(width);
  const [isLoading, setIsLoading] = React.useState(false);
  const [data, setData] = React.useState([]);

  const { currVideo, types } = React.useContext(DataContext);

  React.useEffect(() => {
    async function getDeata() {
      if (isLoading) return;
      setIsLoading(true);
      const response = await fetch(`url`);
      const result = await response.json();
      setData(result);
      setIsLoading(false);
    }
    if (currVideo && types != Enums.Playlist) getDeata();
  }, [currVideo.id]);

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      ctx.top = top.value;
      ctx.bottom = bottom.value;
      ctx.ww = ww.value;
    },
    onActive: (event, ctx) => {
      if (top.value < 0 || top.value > height - 145) return;
      top.value = ctx.top + event.translationY;
      ww.value = ctx.ww - event.translationY / 3;
    },
    onEnd: (_) => {
      if (top.value < height / 2) {
        top.value = 0;
        bottom.value = 0;
        ww.value = width;
      } else {
        top.value = height - 145;
        bottom.value = 75;
        ww.value = 90;
      }
    },
  });
  const style = useAnimatedStyle(() => {
    return {
      top: withSpring(top.value, config),
      bottom: withSpring(bottom.value, config),
      paddingTop: top.value == 0 ? 40 : 0,
    };
  });

  return (
    <PanGestureHandler onGestureEvent={gestureHandler}>
      <Animated.View style={[style, styles.container]}>
        <TouchableOpacity
          onPress={() => {
            top.value = 0;
            bottom.value = 0;
            ww.value = width;
          }}
          activeOpacity={1}
        >
          <PlayerView top={top} ww={ww} />
          <VideoBottom top={top} data={data} />
        </TouchableOpacity>
      </Animated.View>
    </PanGestureHandler>
  );
});

export default MoreModal;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    right: 0,
    backgroundColor: "#fff",
  },
  rowView: {
    flexDirection: "row",
  },
  cross: { color: "#fff", top: 15, left: 10, fontSize: 17, fontWeight: "700" },
});
