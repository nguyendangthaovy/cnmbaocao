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
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { useTogglePasswordVisibility } from "../hooks/useTogglePasswordVisibility";
import { useNavigation } from "@react-navigation/native";
import { getUser, registry } from "../service/authService";
import { LoginStackScreenProps } from "../types";

const RegisterScreen = ({
  navigation,
}: LoginStackScreenProps<"RegisterScreen">) => {
  // const navigation = useNavigation();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [checkValidName, setcheckValidName] = useState(false);
  const [checkValidSDT, setcheckValidSDT] = useState(false);
  const [checkValidPassword, setcheckValidPassword] = useState(false);

  const { passwordVisibility, rightIcon, handlePasswordVisibility } =
    useTogglePasswordVisibility("HIỆN", "ẨN");
  const [disabled, setDisabled] = useState(true);

  const onSubmit = async (user: { username: string; password: string }) => {
    if (!checkValidName && !checkValidSDT && !checkValidPassword) {
      try {
        await registry(name, username, password);
        navigation.navigate("ConfirmAccount", { user: user });
      } catch (error) {
        console.log(error);

        const account = await getUser(username);

        if (account.isActived) {
          Alert.alert("Số điện thoại đã đăng ký, xin mời đăng mập");
          navigation.navigate("LoginScreen", { username: username });
        } else {
          navigation.navigate("ConfirmAccount", { user: account });
        }
      }
    }
  };

  const checkInput = () => {
    if (
      !checkValidName &&
      !checkValidSDT &&
      !checkValidPassword &&
      name &&
      username &&
      password
    )
      setDisabled(false);
    else setDisabled(true);
  };

  const handleVailName = (value: string) => {
    setName(value);
    if (value.length >= 2) {
      setcheckValidName(false);
    } else setcheckValidName(true);
  };

  const handleVailSDT = (value: string) => {
    let re = /^(0[3|5|7|8|9])+([0-9]{8})\b/;

    setUsername(value);
    if (re.test(value)) {
      setcheckValidSDT(false);
    } else setcheckValidSDT(true);
  };

  const handleVailPassword = (value: string) => {
    let rege = /^(?=.*[!@#$&*%^&().?<>'])(?=.*[0-9]).{1,}$/;
    setPassword(value);
    if (rege.test(value)) {
      setcheckValidPassword(false);
    } else setcheckValidPassword(true);
  };

  useEffect(() => {
    checkInput();
  }, [name, username, password]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar animated={true} barStyle="default" backgroundColor="#3399FF" />
      <ScrollView keyboardShouldPersistTaps="handled">
        <Text style={styles.text}>Tên Olaz</Text>
        <View style={styles.parent}>
          <TextInput
            style={styles.textInput}
            value={name}
            placeholder="Gồm 2-40 ký tự"
            placeholderTextColor="#717070"
            autoFocus={true}
            onChangeText={(value) => handleVailName(value)}
          />
          {name && (
            <TouchableOpacity
              style={styles.closeButtonParent}
              onPress={() => setName("")}
            >
              <Image
                style={styles.closeButton}
                source={require("../assets/images/close.png")}
              />
            </TouchableOpacity>
          )}
        </View>
        <Text style={styles.text}>Số điện thoại</Text>
        <View style={styles.parent}>
          <TextInput
            style={styles.textInput}
            value={username}
            placeholder="....."
            placeholderTextColor="#717070"
            onChangeText={(value) => handleVailSDT(value)}
            // (value) => setUsername(value)
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

        <Text style={styles.text}>Mật Khẩu</Text>
        <View style={styles.parent}>
          <TextInput
            style={styles.textInput}
            value={password}
            placeholder="Gồm 8-16 ký tự"
            placeholderTextColor="#717070"
            secureTextEntry={passwordVisibility}
            onChangeText={(value) => handleVailPassword(value)}
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
            onPress={() => onSubmit({ username: username, password: password })}
            disabled={disabled}
            style={[styles.btn, { opacity: disabled ? 0.3 : 1 }]}
          >
            <Text style={{ color: "white" }}>Đăng Ký</Text>
          </TouchableOpacity>
        </View>
        {checkValidName ? (
          <Text style={{ color: "red", marginLeft: 10 }}>
            Tên có độ dài lơn hơn 2.
          </Text>
        ) : (
          <></>
        )}
        {checkValidSDT ? (
          <Text style={{ color: "red", marginLeft: 10 }}>
            Số điện thoại không tồn tại hoặc số điện thoại không đủ 10 chữ số.
          </Text>
        ) : (
          <></>
        )}
        {checkValidPassword ? (
          <Text style={{ color: "red", marginLeft: 10 }}>
            Mật khẩu có độ dài ít nhất 8-16 ký tự trong đó có chứa chữ hoa ,chữ
            thường, chữ số, chữ cái đặt biệt.
          </Text>
        ) : (
          <></>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
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
    width: "85%",
  },
  closeButton: {
    height: 12,
    width: 12,
  },
  closeButtonParent: {
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  btn: {
    width: 250,
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    borderRadius: 30,
    backgroundColor: "#0091ff",
    marginTop: 20,
  },
  showPass: {
    fontSize: 15,
    opacity: 0.7,
  },
  checkregex: {
    fontSize: 12,
  },
});
