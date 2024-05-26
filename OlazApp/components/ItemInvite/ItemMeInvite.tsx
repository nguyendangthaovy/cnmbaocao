import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { Avatar } from "react-native-elements";
import { getAcronym } from "../../utils/functionGlobal";
import { useAppDispatch } from "../../store";
import { deleteMeInvive } from "../../store/reducers/friendSlice";
import { useNavigation } from "@react-navigation/native";

const ItemMeInvite = (props: any) => {
  const { friendMeInvite } = props;
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  // console.log(friendMeInvite);

  const onPress = () => {
    dispatch(deleteMeInvive(friendMeInvite._id));
  };

  return (
    <Pressable
      style={styles.container}
      onPress={() =>
        navigation.navigate("ProfileUser", { userId: friendMeInvite._id })
      }
    >
      <View style={styles.item}>
        <Avatar
          rounded
          title={getAcronym(friendMeInvite.name)}
          overlayContainerStyle={{
            backgroundColor: friendMeInvite.avatarColor,
          }}
          source={
            friendMeInvite.avatar.length
              ? {
                  uri: friendMeInvite.avatar,
                }
              : {}
          }
          size={45}
        />

        <View style={styles.containerRight}>
          <Text style={styles.text}>{friendMeInvite.name}</Text>
          <View>
            <Pressable onPress={onPress} style={styles.btn}>
              <Text>Thu hồi</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Pressable>
  );
};

export default ItemMeInvite;

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#dbdbdb",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
  },
  containerRight: {
    flex: 1,
    paddingLeft: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  text: {
    fontWeight: "bold",
    fontSize: 17,
    padding: 5,
  },
  btn: {
    height: 35,
    width: 120,
    backgroundColor: "#dbdbdb",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
  },
});
