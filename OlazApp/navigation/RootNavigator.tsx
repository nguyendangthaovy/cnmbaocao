import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useRef } from "react";
import {
  Pressable,
  Text,
  View,
  useWindowDimensions,
  StyleSheet,
  Platform,
} from "react-native";
import TabNavigator from "./MainTabNavigator";
import SearchScreen from "../screens/SearchScreen";
import NotFoundScreen from "../screens/NotFoundScreen";
import { RootStackParamList, RootStackScreenProps } from "../types";
import AddFriendScreen from "../screens/AddFriendScreen";
import AddGroupScreen from "../screens/AddGroupScreen";
import ChatRoomScreen from "../screens/ChatRoomScreen";
import {
  Ionicons,
  Feather,
  AntDesign,
  MaterialIcons,
} from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import SearchInput from "../components/SearchInput";
import QRScreen from "../screens/QRScreen";
import RequestAddFriend from "../screens/RequestAddFriendScreen";
import ProfileUserScreen from "../screens/ProfileUserScreen";
import EditUserScreen from "../screens/EditUserScreen";
import EditProFileScreen from "../screens/EditProFileScreen";
import { useAppDispatch } from "../store";
import { resetMessageSlice } from "../store/reducers/messageSlice";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const dispatch = useAppDispatch();

  const headerGradient = (
    <LinearGradient
      // Background Linear Gradient
      colors={["#257afe", "#00bafa"]}
      style={StyleSheet.absoluteFill}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
    />
  );
  return (
    <Stack.Navigator>
      <Stack.Group screenOptions={{}}>
        <Stack.Screen
          name="Root"
          component={TabNavigator}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Group>

      <Stack.Screen
        name="ChatRoom"
        component={ChatRoomScreen}
        options={({ navigation }: RootStackScreenProps<"ChatRoom">) => ({
          headerTintColor: "white",
          headerTitle: ChatRoomHeader,
          headerBackground: () => headerGradient,
          // headerStyle: {
          //   backgroundColor: "#0091ff",
          // },
          headerBackTitleVisible: false,
          title: "Username",
          headerBackVisible: false,
          headerLeft: () => (
            <Pressable
              onPress={() => {
                dispatch(resetMessageSlice(null)), navigation.navigate("Root");
              }}
            >
              <Ionicons name="chevron-back" size={26} color="white" />
            </Pressable>
          ),
        })}
      />

      <Stack.Screen
        name="EditUser"
        component={EditUserScreen}
        options={{ headerShown: false }}
      />

      <Stack.Group
        screenOptions={{
          presentation: "fullScreenModal",
        }}
      >
        <Stack.Screen
          name="QRScreen"
          component={QRScreen}
          options={{
            headerShown: false,
            presentation: "fullScreenModal",
          }}
        />

        <Stack.Screen
          name="EditProFileScreen"
          component={EditProFileScreen}
          options={({
            navigation,
          }: RootStackScreenProps<"EditProFileScreen">) => ({
            headerTitle: "Chỉnh sửa thông tin cá nhân",
            headerStyle: {
              backgroundColor: "#EEEEEE",
            },
            animation: "slide_from_bottom",
            headerLeft: () => (
              <Pressable onPress={() => navigation.goBack()}>
                <AntDesign name="close" size={24} color="black" />
              </Pressable>
            ),
          })}
        />
      </Stack.Group>

      <Stack.Group
        screenOptions={{
          presentation: "card",
        }}
      >
        <Stack.Screen
          name="AddGroupScreen"
          component={AddGroupScreen}
          options={({
            navigation,
          }: RootStackScreenProps<"AddGroupScreen">) => ({
            headerTitle: "Nhóm mới",
            headerStyle: {
              backgroundColor: "#EEEEEE",
            },
            animation: "slide_from_bottom",
            headerLeft: () => (
              <Pressable onPress={() => navigation.goBack()}>
                <Text>Hủy</Text>
              </Pressable>
            ),
          })}
        />

        <Stack.Screen
          name="Search"
          component={SearchScreen}
          options={{
            headerShown: false,
            headerBackground: () => <></>,
            animation: "none",
          }}
        />

        <Stack.Screen
          name="AddFriendScreen"
          component={AddFriendScreen}
          options={({
            navigation,
          }: RootStackScreenProps<"AddFriendScreen">) => ({
            headerBackVisible: false,
            headerTitle: "",
            headerStyle: {
              backgroundColor: "#0091ff",
            },
            headerLeft: () => (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Pressable onPress={() => navigation.goBack()}>
                  <Ionicons name="chevron-back" size={26} color="white" />
                </Pressable>
                <Text
                  style={{
                    marginLeft: 10,
                    fontSize: 18,
                    fontWeight: "bold",
                    color: "white",
                  }}
                >
                  Thêm bạn
                </Text>
              </View>
            ),
          })}
        />

        <Stack.Screen
          name="RequestAddFriend"
          component={RequestAddFriend}
          options={({
            navigation,
          }: RootStackScreenProps<"RequestAddFriend">) => ({
            headerBackVisible: false,
            headerTitle: "",
            headerBackground: () => headerGradient,
            headerLeft: () => (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Pressable onPress={() => navigation.goBack()}>
                  <Ionicons name="chevron-back" size={26} color="white" />
                </Pressable>
                <Text
                  style={{
                    marginLeft: 10,
                    fontSize: 18,
                    fontWeight: "bold",
                    color: "white",
                  }}
                >
                  Lời mời kết bạn
                </Text>
              </View>
            ),
          })}
        />

        <Stack.Screen
          name="ProfileUser"
          component={ProfileUserScreen}
          options={({ navigation }: RootStackScreenProps<"ProfileUser">) => ({
            headerBackTitle: "",
            headerTitle: "",
            headerShown: false,
          })}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
}

const ChatRoomHeader = (props: {
  children: string;
  tintColor?: string | undefined;
}) => {
  const { width } = useWindowDimensions();

  // console.log(props);

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        width: width - 50,
        paddingLeft: 10,
        paddingRight: 10,
        alignItems: "center",
      }}
    >
      <View>
        <Text style={{ color: "white", fontSize: 17 }}>{props.children}</Text>
        <Text style={{ color: "white", fontSize: 11 }}>
          Truy cập 52 phút trước
        </Text>
      </View>
      <View style={{ flexDirection: "row" }}>
        <Feather name="phone" size={24} color="white" />
        <AntDesign
          name="videocamera"
          size={24}
          color="white"
          style={{ marginLeft: 16, marginRight: 16 }}
        />
        <Ionicons name="menu" size={28} color="white" />
      </View>
    </View>
  );
};
