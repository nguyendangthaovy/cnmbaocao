import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import QRScanerScreen from "./QRScanerScreen";
import MyQRScrenn from "./MyQRScrenn";

const Tab = createBottomTabNavigator();

const QRScreen = () => {
  return (
    <Tab.Navigator initialRouteName="QRScanerScreen">
      <Tab.Screen
        name="Quét QR"
        component={QRScanerScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="QR của tôi"
        component={MyQRScrenn}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
};

export default QRScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "while",
  },
});
