import React from "react";
import { StyleSheet, View, FlatList } from "react-native";
import { Cell, Enums } from "./Cell";
import Constants from "expo-constants";
import { DataContext } from "./DataContext";
import LoadingView from "./LoadingView";
import Header from "./Header";

const Trending = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const { trending, setTrending } = React.useContext(DataContext);

  React.useEffect(() => {
    async function getInitialData() {
      if (isLoading) return;
      setIsLoading(true);
      const response = await fetch(`url`);
      const result = await response.json();
      setTrending(result);
      setIsLoading(false);
    }
    getInitialData();
  }, []);

  const renderItem = React.useCallback(
    ({ item }) => <Cell item={item} type={Enums.Trend} />,
    []
  );

  return (
    <View
      style={{
        paddingTop: Constants.statusBarHeight,
        backgroundColor: "#fff",
        flex: 1,
      }}
    >
      <Header text={"Trending"} />
      <LoadingView loading={isLoading} />
      <FlatList
        data={trending}
        keyExtractor={(_, index) => `video-${index}`}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 60 }}
      />
    </View>
  );
};

export default Trending;

const styles = StyleSheet.create({});
