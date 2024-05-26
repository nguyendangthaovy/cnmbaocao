import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  Pressable,
} from "react-native";
import React, { useEffect, useState } from "react";
import userApi from "../service/userService";
import { useNavigation } from "@react-navigation/native";

export default function AddFriendScreen() {
  const navigation = useNavigation();

  const [phone, setPhone] = useState("");
  const [disabled, setDisabled] = useState(true);

  const checkPhone = (search: string) => {
    let phone_regex = /((09|03|07|08|05)+([0-9]{8})\b)/g;
    if (phone_regex.test(search) && search.length === 10) setDisabled(false);
    else {
      setDisabled(true);
    }
  };

  useEffect(() => {
    checkPhone(phone);
  }, [phone]);

  const onPressSearch = () => {
    userApi.fetchUsers(phone).then((res) => {
      navigation.navigate("ProfileUser", { userId: res.data._id });
    });
  };

  return (
    <ScrollView style={styles.container}>
      <Text>Thêm bạn bằng số điện thoại</Text>
      <Text style={{ fontSize: 17, marginTop: 15, marginBottom: 15 }}>
        Vietnam (+84)
      </Text>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <TextInput
          placeholder="Nhập số điện thoại"
          placeholderTextColor="gray"
          style={styles.input}
          keyboardType="phone-pad"
          keyboardAppearance="light"
          onChangeText={(value) => setPhone(value)}
        />
        <Pressable
          onPress={onPressSearch}
          disabled={disabled}
          style={[styles.btn, { opacity: disabled ? 0.3 : 1 }]}
        >
          <Text style={{ color: "white" }}>Tìm</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 20,
  },
  input: {
    flex: 1,
    height: 50,
    borderColor: "#E6E6FA",
    borderTopWidth: 1,
  },
  btn: {
    width: 70,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    borderRadius: 30,
    backgroundColor: "#0091ff",
    marginTop: 20,
  },
});
