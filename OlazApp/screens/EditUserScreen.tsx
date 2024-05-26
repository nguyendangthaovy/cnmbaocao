import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TouchableOpacity,
  Pressable,
} from "react-native";
import React from "react";
import { Avatar } from "react-native-elements";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { useAppSelector } from "../store";
import { userSelector } from "../store/reducers/userSlice";
import { meSelector } from "../store/reducers/meSlice";
import { useNavigation } from "@react-navigation/native";

export default function EditUserScreen() {
  const navigation = useNavigation();
  const { userProfile } = useAppSelector(meSelector);

  return (
    <>
      <ImageBackground
        source={require("../assets/images/default-cover-image.jpg")}
        resizeMode="cover"
        style={styles.image}
      >
        <Pressable style={styles.btnBack} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={26} color="white" />
        </Pressable>
        <View style={styles.Avatar}>
          {userProfile.avatar.length ? (
            <Avatar
              rounded
              overlayContainerStyle={{
                backgroundColor: userProfile.avatarColor,
              }}
              source={{
                uri: userProfile.avatar,
              }}
              size="medium"
            />
          ) : (
            <Avatar
              rounded
              title={userProfile.name[0]}
              overlayContainerStyle={{
                backgroundColor: userProfile.avatarColor,
              }}
              size="medium"
            />
          )}
          <Text style={styles.textNameUser}>{userProfile.name}</Text>
        </View>
      </ImageBackground>

      <View>
        <Text style={styles.textTitle}>Thông tin cá nhân</Text>
      </View>
      <View style={styles.container}>
        <Text style={styles.textInfo}>Giới Tính</Text>
        <Text style={styles.textInfoUser}>
          {userProfile.gender ? "Nam" : "Nữ"}
        </Text>
      </View>
      <View style={styles.container}>
        <Text style={styles.textInfo}>Ngày sinh</Text>
        <Text
          style={styles.textInfoUser}
        >{`${userProfile.birthDay.day}/${userProfile.birthDay.month}/${userProfile.birthDay.year}`}</Text>
      </View>
      <View style={styles.container}>
        <Text style={styles.textInfo}>Điện thoại</Text>
        <Text style={styles.textInfoUser}>{`+84 ${userProfile.username.slice(
          1,
          10
        )}`}</Text>
      </View>

      <View style={{ alignItems: "center" }}>
        <TouchableOpacity
          onPress={() => navigation.navigate("EditProFileScreen")}
          style={[styles.btnEdit, { opacity: 1 }]}
        >
          <View style={styles.iconEdit}>
            <AntDesign name="edit" size={20} color="black" />
            <Text style={styles.textEdit}> Chỉnh sửa</Text>
          </View>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  btnBack: {
    paddingTop: 35,
    paddingLeft: 10,
  },
  Avatar: {
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  image: {
    height: 250,
    flexDirection: "column",
    justifyContent: "space-between",
  },
  text: {
    paddingBottom: 10,
  },
  textNameUser: {
    fontWeight: "600",
    fontSize: 20,
    paddingLeft: 10,
    color: "white",
  },
  textTitle: {
    paddingTop: 20,
    paddingLeft: 15,
    fontWeight: "700",
    fontSize: 15,
    backgroundColor: "white",
  },
  container: {
    padding: 17,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderBottomWidth: 0.7,
    borderColor: "#B5B5B5",
  },
  textInfo: {
    fontSize: 16,
    paddingTop: 10,
    paddingBottom: 8,
  },
  textInfoUser: {
    fontSize: 16,
    paddingTop: 10,
    paddingBottom: 8,
    paddingLeft: 60,
    fontWeight: "600",
  },
  btnEdit: {
    width: 400,
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    borderRadius: 30,
    backgroundColor: "#CDC9C9",
    margin: 20,
  },
  textEdit: {
    color: "black",
    fontWeight: "600",
    fontSize: 15,
  },
  iconEdit: {
    flexDirection: "row",
  },
});
