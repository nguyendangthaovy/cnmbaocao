import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { Avatar } from "react-native-elements";
import { getAcronym } from "../../utils/functionGlobal";
import { useAppDispatch } from "../../store";
import { acceptFriend, deleteInvive } from "../../store/reducers/friendSlice";
import { useNavigation } from "@react-navigation/native";

const ItemInvite = ({ friendInvite }: any) => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const onPressAcceptFriend = () => {
    dispatch(acceptFriend(friendInvite._id));
  };

  const onPressNoAcceptFriend = () => {
    dispatch(deleteInvive(friendInvite._id));
  };

  return (
    <Pressable
      style={styles.container}
      onPress={() =>
        navigation.navigate("ProfileUser", { userId: friendInvite._id })
      }
    >
      <View style={styles.item}>
        <Avatar
          rounded
          title={getAcronym(friendInvite.name)}
          overlayContainerStyle={{
            backgroundColor: friendInvite.avatarColor,
          }}
          source={
            friendInvite.avatar.length > 0
              ? {
                  uri: friendInvite.avatar,
                }
              : {}
          }
          size={45}
        />
        <View style={styles.containerRight}>
          <Text style={styles.text}>{friendInvite.name}</Text>
          <View style={styles.btnContainer}>
            <View style={{ paddingRight: 20 }}>
              <Pressable
                onPress={onPressNoAcceptFriend}
                style={[styles.btn, { backgroundColor: "#dbdbdb" }]}
              >
                <Text>Từ chối</Text>
              </Pressable>
            </View>
            <View>
              <Pressable style={styles.btn} onPress={onPressAcceptFriend}>
                <Text style={{ color: "#0091ff" }}>Đồng ý</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </Pressable>
  );
};

export default ItemInvite;

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#dbdbdb",
  },
  item: {
    flexDirection: "row",
    // alignItems: "center",
  },
  containerRight: {
    paddingLeft: 20,
    flexDirection: "column",
  },
  text: {
    fontWeight: "bold",
    fontSize: 17,
    padding: 5,
    // height: 35,
  },
  btnContainer: {
    flexDirection: "row",
    paddingBottom: 2,
  },
  btn: {
    height: 35,
    width: 120,
    backgroundColor: "#d6efff",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
  },
});
