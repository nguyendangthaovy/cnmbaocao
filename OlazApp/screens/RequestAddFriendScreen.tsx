import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import ListInviteScreen from "./ListInviteScreen";
import ListMeInviteScreen from "./ListMeInviteScreen";

const RequestAddFriend = () => {
  const TabTop = createMaterialTopTabNavigator();

  return (
    <TabTop.Navigator
      initialRouteName="ListInvite"
      screenOptions={{
        tabBarActiveTintColor: "black",
        tabBarStyle: {
          backgroundColor: "white",
        },
        swipeEnabled: false,
      }}
    >
      <TabTop.Screen
        name="ListInvite"
        component={ListInviteScreen}
        options={{ title: "ĐÃ NHẬN" }}
      />
      <TabTop.Screen
        name="ListMeInvite"
        component={ListMeInviteScreen}
        options={{ title: "ĐÃ GỬI" }}
      />
    </TabTop.Navigator>
  );
};

export default RequestAddFriend;

const styles = StyleSheet.create({});
