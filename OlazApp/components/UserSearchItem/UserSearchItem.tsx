import { StyleSheet, Text, View, Pressable, Alert } from "react-native";
import React, { useState } from "react";
import CustomAvatar from "../CustomAvatar/CustomAvatar";
import { useNavigation } from "@react-navigation/native";
import { useAppDispatch } from "../../store";
import { inviteFriend } from "../../store/reducers/friendSlice";

const UserSearchItem = ({ props }: any) => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();

  const { avatar, avatarColor, name, status, username, _id } = props;
  const totalMembers: number = 0;
  const dataAvatar = { avatar, name, totalMembers, avatarColor };

  const text: string =
    status === "NOT_FRIEND" ? "Kết bạn" : status === "FOLLOWER" ? "Đồng ý" : "";
  const [textStatus, setTextStatus] = useState(text);

  const onPress = () => {
    if (status === "NOT_FRIEND") {
      dispatch(inviteFriend(props));
      Alert.alert("Yêu cầu kết bạn đã được gửi");
      setTextStatus("");
    } else if (status === "FOLLOWER") {
      dispatch(inviteFriend(props));
      setTextStatus("");
    }
  };

  return (
    <Pressable
      style={styles.container}
      onPress={() => navigation.navigate("ProfileUser", { userId: _id })}
    >
      <CustomAvatar props={dataAvatar} />
      <View style={styles.rightContainer}>
        <View>
          <View>
            <Text style={styles.name}>{name}</Text>
          </View>
          <View style={styles.textContent}>
            <Text style={styles.text}>Số điện thoại : </Text>
            <Text style={{ color: "#0091ff" }}>{username}</Text>
          </View>
        </View>

        {textStatus && (
          <Pressable style={styles.btn} onPress={onPress}>
            <Text style={{ color: "#0091ff" }}>{textStatus}</Text>
          </Pressable>
        )}

        {/* {status === "NOT_FRIEND" ? (
          <Pressable
            style={styles.btn}
            onPress={() => setTextStatus("")}
          >
            <Text style={{ color: "#0091ff" }}></Text>
          </Pressable>
        ) : (
          <View>
            {status === "FOLLOWER" ? (
              <Pressable style={styles.btn}>
                <Text style={{ color: "#0091ff" }}>Đồng ý</Text>
              </Pressable>
            ) : (
              <></>
            )}
          </View>
        )} */}
      </View>
    </Pressable>
  );
};

export default UserSearchItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 10,
  },
  rightContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: 10,
  },
  name: {
    fontWeight: "bold",
    fontSize: 17,
    marginBottom: 2,
    maxWidth: 270,
  },
  textContent: {
    flexDirection: "row",
  },
  text: {
    color: "grey",
    maxWidth: 280,
  },
  btn: {
    height: 30,
    width: 80,
    backgroundColor: "#bedff7",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
  },
});
