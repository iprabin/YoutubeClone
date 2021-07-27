import React from "react";
import { FlatList, Dimensions, TextInput, View, Keyboard } from "react-native";
import { Cell, Enums } from "./Cell";
import Constants from "expo-constants";
import { DataContext } from "./DataContext";
import LoadingView from "./LoadingView";
import Header from "./Header";

const { width } = Dimensions.get("window");

const Home = () => {
  const [search, setSearch] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const { search: searchData, setSearch: setSearchData } =
    React.useContext(DataContext);

  async function getDeata() {
    if (isLoading) return;
    setIsLoading(true);
    const response = await fetch("url");
    const result = await response.json();
    setSearchData(result);
    setIsLoading(false);
  }

  React.useEffect(() => {
    async function getInitialData() {
      if (isLoading) return;
      setIsLoading(true);
      const response = await fetch(`url`);
      const result = await response.json();
      setSearchData(result);
      setIsLoading(false);
    }
    if (search.length < 1) getInitialData();
  }, [search]);

  const renderItem = React.useCallback(
    ({ item }) => <Cell item={item} type={Enums.Home} />,
    []
  );

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#fff",
        paddingTop: Constants.statusBarHeight,
      }}
    >
      <LoadingView loading={isLoading} />
      <Header text={"Home"} />
      <TextInput
        onChangeText={(txt) => {
          setSearch(txt);
          if (txt.length == 0) {
            setSearchData([]);
          }
        }}
        value={search}
        style={{
          height: 40,
          width: width - 20,
          marginHorizontal: 10,
          backgroundColor: "#f5f5f5",
          paddingHorizontal: 10,
          borderRadius: 10,
        }}
        placeholder={"Search Here"}
        clearButtonMode={"always"}
        onSubmitEditing={async () => {
          Keyboard.dismiss();
          await getDeata();
        }}
        autoCorrect={false}
      />
      <FlatList
        data={searchData}
        keyExtractor={(_, index) => `video-${index}`}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 60 }}
        style={{ marginTop: 5 }}
      />
    </View>
  );
};

export default Home;
