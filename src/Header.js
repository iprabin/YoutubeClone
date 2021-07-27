import React from "react";
import { Text } from "react-native";

const Header = ({ text }) => {
  return (
    <Text
      style={{
        marginHorizontal: 10,
        fontSize: 25,
        fontWeight: "800",
        marginBottom: 10,
      }}
    >
      {text}
    </Text>
  );
};

export default Header;
