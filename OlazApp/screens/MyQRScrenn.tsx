import { StyleSheet, Text, View, Pressable } from "react-native";
import React from "react";
import QRCode from "react-native-qrcode-svg";
import { useAppDispatch, useAppSelector } from "../store";
import { getUserById, userSelector } from "../store/reducers/userSlice";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import CustomAvatar from "../components/CustomAvatar/CustomAvatar";

const MyQRScrenn = () => {
  const navigation = useNavigation();

  const user = useAppSelector(userSelector);

  const { avatar, avatarColor, name } = user;

  const totalMembers: number = 0;

  const dataAvatar = { avatar, name, totalMembers, avatarColor };

  let logoFromFile = require("../assets/images/qr.png");
  return (
    <View style={styles.container}>
      <View style={styles.containerTop}>
        <Pressable
          style={styles.headBtn}
          onPress={() => navigation.navigate("Root")}
        >
          <AntDesign name="closecircle" size={24} color="black" />
        </Pressable>
      </View>
      <View style={styles.myqr}>
        <View style={styles.infor}>
          <CustomAvatar props={dataAvatar} />
          <Text style={{ paddingTop: 10 }}>{user.name}</Text>
        </View>
        <QRCode
          value={user.id}
          logo={logoFromFile}
          logoSize={43}
          logoBackgroundColor="transparent"
          size={180}
        />
      </View>
    </View>
  );
};

export default MyQRScrenn;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerTop: {
    // height: "20%",
  },
  infor: {
    padding: 30,
    alignItems: "center",
    zIndex: 999,
  },
  myqr: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 90,
  },
  headBtn: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 30,
  },
});
