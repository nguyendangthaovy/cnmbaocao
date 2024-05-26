import { View, Text, Pressable, StyleSheet } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import SecurityScreen from "../screens/SecurityScreen";
import { LoginStackParamList } from "../types";
import ConfirmAccountScreen from "../screens/ConfirmAccountScreen";
import SettingAccountFirstScreen from "../screens/SettingAccountFirstScreen";

const Stack = createNativeStackNavigator<LoginStackParamList>();

const LoginNavigation = () => {
  const navigation = useNavigation();

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
      <Stack.Screen
        name="Security"
        component={SecurityScreen}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Group
        screenOptions={{
          presentation: "card",
        }}
      >
        <Stack.Screen
          name="LoginScreen"
          component={LoginScreen}
          options={{
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
                  Đăng nhập
                </Text>
              </View>
            ),
          }}
        />

        <Stack.Screen
          name="RegisterScreen"
          component={RegisterScreen}
          options={{
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
                  Tạo tài khoản
                </Text>
              </View>
            ),
          }}
        />

        <Stack.Screen
          name="ConfirmAccount"
          component={ConfirmAccountScreen}
          options={{
            headerBackground: () => headerGradient,
            headerTitle: "Xác thực tài khoản",
            headerTintColor: "white",
          }}
        />
        <Stack.Screen
          name="SettingAccountFirst"
          component={SettingAccountFirstScreen}
          options={{
            headerBackground: () => headerGradient,
            headerTitle: "Cài đặt tài khoản lần đầu",
            headerTintColor: "white",
          }}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
};

export default LoginNavigation;
