import { StyleSheet, Text, View, TouchableOpacity, Modal } from "react-native";
import React from "react";
import { AntDesign, Ionicons, MaterialIcons } from "@expo/vector-icons";
import styles from "./styles";

export default function MenuPopup({
  navigation,
  setTip,
}: {
  navigation: any;
  setTip: any;
}) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.buttonContainer}
        onPress={() => {
          setTip(false);
          navigation.navigate("AddFriendScreen");
        }}
      >
        <AntDesign name="adduser" size={24} color="black" style={styles.icon} />
        <Text style={styles.text}>Thêm bạn</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.buttonContainer}
        onPress={() => {
          setTip(false);
          navigation.navigate("AddGroupScreen");
        }}
      >
        <AntDesign
          name="addusergroup"
          size={24}
          color="black"
          style={styles.icon}
        />
        <Text style={styles.text}>Tạo nhóm</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.buttonContainer}>
        <AntDesign
          name="calendar"
          size={24}
          color="black"
          style={styles.icon}
        />
        <Text style={styles.text}>Lịch Zalo</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.buttonContainer}>
        <MaterialIcons
          name="computer"
          size={24}
          color="black"
          style={styles.icon}
        />
        <Text style={styles.text}>Lịch sử đăng nhập</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.buttonContainer}>
        <AntDesign name="cloudo" size={24} color="black" style={styles.icon} />
        <Text style={styles.text}>Cloud của tôi</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.buttonContainer}>
        <AntDesign
          name="videocamera"
          size={24}
          color="black"
          style={styles.icon}
        />
        <Text style={styles.text}>Tạo cuộc gọi nhóm</Text>
      </TouchableOpacity>
    </View>
  );
}
