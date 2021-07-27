import React from "react";
import Home from "./src/Home";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import Playlist from "./src/Playlist";
import MoreModal from "./src/MoreModal";
import { DataContext } from "./src/DataContext";
import Trending from "./src/Trending";

const Tab = createBottomTabNavigator();
const Navigation = () => {
  const { currVideo } = React.useContext(DataContext);
  return (
    <NavigationContainer>
      <StatusBar style={"dark"} />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            if (route.name === "Search") {
              return <AntDesign name="search1" size={size} color={color} />;
            } else if (route.name === "Trending") {
              return <AntDesign name="linechart" size={size} color={color} />;
            } else {
              return (
                <MaterialCommunityIcons
                  name="playlist-music"
                  size={size}
                  color={color}
                />
              );
            }
          },
        })}
      >
        <Tab.Screen name="Search" component={Home} />
        <Tab.Screen name="Trending" component={Trending} />
        <Tab.Screen name="Playlist" component={Playlist} />
      </Tab.Navigator>
      {currVideo && <MoreModal />}
    </NavigationContainer>
  );
};

export default Navigation;
