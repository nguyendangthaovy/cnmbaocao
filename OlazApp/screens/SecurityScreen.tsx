import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  TextInput,
  StatusBar,
  Image,
  Alert,
} from "react-native";
import React from "react";

import { useAppSelector } from "../store";
import { LoginStackScreenProps, RootStackScreenProps } from "../types";
import { useNavigation } from "@react-navigation/native";

const SecurityScreen = ({ navigation }: LoginStackScreenProps<"Security">) => {
  // const authData = useAppSelector(authSelector);

  // useEffect(() => {
  //   setIsAuthenticatied(authData.isLogin);
  //   if (authData.isLogin) {
  //     jwt.setToken(authData.token);
  //     navigation.navigate("Root");
  //   }
  // }, [authData]);

  // const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <StatusBar animated={true} barStyle="dark-content" />
      <View style={styles.containerTop}>
        <View style={styles.containerTop}>
          <Text style={styles.logo}>Olaz</Text>
        </View>
      </View>
      <View style={styles.containerBot}>
        <TouchableOpacity
          style={[styles.btnLogin, styles.btn]}
          onPress={() => {
            navigation.navigate("LoginScreen");
          }}
        >
          <Text style={[styles.btnText]}>Đăng nhập</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.btn, styles.btnRegister]}
          onPress={() => {
            navigation.navigate("RegisterScreen");
          }}
        >
          <Text>Đăng ký</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  containerTop: {
    height: "70%",
    justifyContent: "center",
    alignItems: "center",
  },
  containerBot: {
    height: "27%",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    fontSize: 90,
    fontWeight: "bold",
    color: "#007AFF",
  },
  btn: {
    width: 300,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    borderRadius: 30,
  },
  btnText: {
    color: "white",
  },
  btnLogin: {
    backgroundColor: "#0091ff",
  },
  btnRegister: {
    backgroundColor: "#EEEEEE",
  },
});

export default SecurityScreen;
