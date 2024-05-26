import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  ImageBackground,
} from "react-native";
import React, { useEffect } from "react";

import { useNavigation } from "@react-navigation/native";
import { useAuthContext } from "../contexts/AuthContext";
import { StatusBar } from "expo-status-bar";

const SplashScreen = () => {
  const navigation = useNavigation();
  const { isAuthenticated } = useAuthContext();
  // useEffect(() => {
  //   if (isAuthenticated) {
  //     navigation.navigate("Root");
  //   } else {
  //     navigation.navigate("Security");
  //   }
  // }, []);

  return (
    <ImageBackground
      style={styles.background}
      source={require("../assets/images/splash.png")}
      resizeMode="cover"
    ></ImageBackground>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0068FF",
    resizeMode: "cover",
  },
});
