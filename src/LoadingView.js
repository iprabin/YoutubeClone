import React from "react";
import { StyleSheet, View, Modal, ActivityIndicator } from "react-native";

const LoadingView = ({ loading }) => {
  return (
    <Modal visible={loading} transparent>
      <View style={styles.loadingIndicator}>
        <ActivityIndicator size="large" color="white" />
      </View>
    </Modal>
  );
};

export default LoadingView;

const styles = StyleSheet.create({
  loadingIndicator: {
    position: "absolute",
    alignSelf: "center",
    justifyContent: "center",
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.7)",
  },
});
