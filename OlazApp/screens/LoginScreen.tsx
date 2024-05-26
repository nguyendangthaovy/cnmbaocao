import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  TextInput,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ScrollView,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useTogglePasswordVisibility } from "../hooks/useTogglePasswordVisibility";
import { useAuthContext } from "../contexts/AuthContext";

import { login } from "../service/authService";
import jwt from "../utils/jwt";
import { setLogin } from "../store/reducers/authSlice";
import { useAppDispatch } from "../store";
import { configAxios } from "../utils/httpRequest";
import { getConversations } from "../store/reducers/conversationSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRoute } from "@react-navigation/native";
import { LoginRouteProps } from "../types";

const LoginScreen = () => {
  const { setIsAuthenticatied } = useAuthContext();
  const dispatch = useAppDispatch();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [disabled, setDisabled] = useState(true);

  const route = useRoute<LoginRouteProps<"LoginScreen">>();
  const usernameRoute: string | undefined = route.params?.username;
  useEffect(() => {
    setUsername(usernameRoute as string);
  }, []);

  const { passwordVisibility, rightIcon, handlePasswordVisibility } =
    useTogglePasswordVisibility("HIỆN", "ẨN");

  const onPress = async () => {
    try {
      const result = await login(username, password);
      // await AsyncStorage.setItem("refreshToken", result.refreshToken);
      jwt.setToken(result?.data.token);
      configAxios();
      dispatch(setLogin(true));
    } catch (error) {
      Alert.alert("Số điện thoại hoặc mật khẩu không đúng");
    }
  };

  const checkInput = (textUserName: string, textPass: string) => {
    if (textUserName && textPass) setDisabled(false);
    else setDisabled(true);
  };

  useEffect(() => {
    checkInput(username, password);
  }, [username, password]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar animated={true} barStyle="default" backgroundColor="#3399FF" />
      <ScrollView keyboardShouldPersistTaps="handled">
        <Text style={styles.textContent}>
          Vui lòng nhập tài khoản và mật khẩu để đăng nhập
        </Text>
        <View style={styles.parent}>
          <TextInput
            style={styles.textInput}
            value={username}
            placeholder="Số điện thoại đăng nhập"
            placeholderTextColor="#717070"
            autoFocus={true}
            onChangeText={(value) => {
              setUsername(value);
            }}
          />
          {username && (
            <TouchableOpacity
              style={styles.closeButtonParent}
              onPress={() => setUsername("")}
            >
              <Image
                style={styles.closeButton}
                source={require("../assets/images/close.png")}
              />
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.parent}>
          <TextInput
            style={styles.textInput}
            value={password}
            placeholder="Mật khẩu"
            placeholderTextColor="#717070"
            secureTextEntry={passwordVisibility}
            onChangeText={(value) => {
              setPassword(value);
            }}
          />

          {password && (
            <TouchableOpacity
              style={styles.closeButtonParent}
              onPress={() => setPassword("")}
            >
              <Image
                style={styles.closeButton}
                source={require("../assets/images/close.png")}
              />
            </TouchableOpacity>
          )}
          <Pressable
            style={[styles.closeButtonParent]}
            onPress={handlePasswordVisibility}
          >
            <Text style={styles.showPass}>{rightIcon}</Text>
          </Pressable>
        </View>
        <View style={{ alignItems: "center" }}>
          <TouchableOpacity
            disabled={disabled}
            onPress={onPress}
            style={[styles.btnLogin, { opacity: disabled ? 0.3 : 1 }]}
          >
            <View>
              <Text style={{ color: "white" }}>Đăng nhập</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    backgroundColor: "white",
  },
  textContent: {
    margin: 12,
    opacity: 0.8,
    marginBottom: 24,
  },

  text: {
    fontWeight: "bold",
    marginTop: 20,
    marginLeft: 12,
    fontSize: 16,
  },
  parent: {
    margin: 10,
    borderColor: "gray",
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  textInput: {
    height: 40,
    width: "82%",
  },
  closeButton: {
    height: 10,
    width: 10,
  },
  closeButtonParent: {
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  showPass: {
    fontSize: 15,
    opacity: 0.7,
    marginLeft: 8,
  },
  btnLogin: {
    width: 250,
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    borderRadius: 30,
    backgroundColor: "#0091ff",
    marginTop: 20,
  },
});
