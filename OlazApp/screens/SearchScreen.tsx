import React, { useCallback, useEffect, useRef, useState } from "react";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  Platform,
  BackHandler,
  KeyboardAvoidingView,
  ActivityIndicator,
} from "react-native";
import HistorySearchItem from "../components/HistorySearchItem/HistorySearchItem";

import SearchInput from "../components/SearchInput";
import { LinearGradient } from "expo-linear-gradient";

import { RootStackScreenProps } from "../types";
import {
  getUserById,
  getUserByUserName,
  resetUserSlice,
  userSelector,
} from "../store/reducers/userSlice";
import { useAppDispatch, useAppSelector } from "../store";
import UserSearchItem from "../components/UserSearchItem/UserSearchItem";
import JWTManager from "../utils/jwt";
import userApi from "../service/userService";
import { useNavigation } from "@react-navigation/native";

export default function ModalScreen({
  navigation,
}: RootStackScreenProps<"Search">) {
  // const navigation = useNavigation();
  const [user, setUser] = useState(null);

  const [search, setSearch] = useState("");

  const headerSearch = () => (
    <LinearGradient
      // Background Linear Gradient
      colors={["#257afe", "#00bafa"]}
      style={StyleSheet.absoluteFill}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
    >
      <View style={styles.header}>
        <Pressable
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Ionicons name="chevron-back" size={26} color="white" />
        </Pressable>
        <SearchInput search={search} setSearch={setSearch} />
        <Pressable
          onPress={() => {
            navigation.navigate("Root"), navigation.navigate("QRScreen");
          }}
        >
          <MaterialIcons name="qr-code-scanner" size={24} color="white" />
        </Pressable>
      </View>
    </LinearGradient>
  );

  useEffect(() => {
    navigation.setOptions({
      headerBackground: () => headerSearch(),
    });
  }, [search]);

  useCallback(() => {
    headerSearch();
  }, [search]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => true
    );
    return () => backHandler.remove();
  }, []);

  const checkPhone = (search: string) => {
    let phone_regex = /((09|03|07|08|05)+([0-9]{8})\b)/g;

    if (phone_regex.test(search) && search.length === 10) return true;
    else {
      return false;
    }
  };

  const findMenber = (search: string) => {
    if (checkPhone(search)) {
      userApi.fetchUsers(search).then((res) => setUser(res.data));
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    findMenber(search);
  }, [search]);

  return (
    <View style={styles.container}>
      {search ? (
        <View>
          <Text style={{ padding: 12 }}>Tìm bạn qua số điện thoại</Text>
          <View>{user ? <UserSearchItem props={user} /> : <></>}</View>
        </View>
      ) : (
        <View>
          <Text style={{ padding: 12 }}>Liên hệ đã tìm</Text>
          <HistorySearchItem />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    elevation: 4,
    paddingStart: 10,
    paddingEnd: 15,
    position: "absolute",
    bottom: Platform.OS === "ios" ? -4 : -4,
  },
});
