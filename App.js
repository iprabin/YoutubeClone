import React from "react";
import "react-native-gesture-handler";
import { DataProvider } from "./src/DataContext";
import Navigation from "./Navigation";

export default function App() {
  return (
    <DataProvider>
      <Navigation />
    </DataProvider>
  );
}
