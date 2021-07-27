import React from "react";
import { getData } from "../playlistManager";
import { Audio } from "expo-av";

export const DataContext = React.createContext({
  search: [],
  currVideo: null,
  playlist: [],
  setSearch: () => null,
  setPlaylist: () => null,
  setCurrVideo: () => null,
  trending: [],
  setTrending: () => null,
  types: 0,
  setTypes: () => null,
  loadPlaylist: () => null,
  currPlaylist: [],
  setCurrPlaylist: () => null,
  currIndex: 0,
  setCurrIndex: () => null,
});

export const DataProvider = ({ children }) => {
  const [search, setSearch] = React.useState([]);
  const [trending, setTrending] = React.useState([]);
  const [playlist, setPlaylist] = React.useState([]);
  const [currVideo, setCurrVideo] = React.useState(null);
  const [types, setTypes] = React.useState(0);
  const [currPlaylist, setCurrPlaylist] = React.useState([]);
  const [currIndex, setCurrIndex] = React.useState(0);
  const loadPlaylist = async () => {
    const data = await getData();
    setPlaylist(data);
  };

  React.useEffect(() => {
    loadPlaylist();
  }, []);
  return (
    <DataContext.Provider
      value={{
        search,
        playlist,
        currVideo,
        setSearch,
        setPlaylist,
        setCurrVideo,
        trending,
        setTrending,
        types,
        setTypes,
        loadPlaylist,
        currPlaylist,
        setCurrPlaylist,
        currIndex,
        setCurrIndex,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

(async () => {
  await Audio.setAudioModeAsync({
    staysActiveInBackground: false,
    playsInSilentModeIOS: true,
  });
})();
