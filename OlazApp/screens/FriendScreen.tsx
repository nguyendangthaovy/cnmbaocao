import {
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Pressable,
} from "react-native";
import FriendItem from "../components/FriendItem/FriendItem";
import { useAppSelector } from "../store";
import { friendSeletor } from "../store/reducers/friendSlice";
import { FontAwesome5 } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function FriendScreen() {
  const navigation = useNavigation();

  const { friends } = useAppSelector(friendSeletor);

  return (
    <View style={styles.container}>
      <Pressable
        style={styles.btnAddFriend}
        onPress={() => navigation.navigate("RequestAddFriend")}
      >
        <View style={styles.icon}>
          <FontAwesome5 name="user-friends" size={16} color="white" />
        </View>
        <Text style={styles.textAddFriend}>Lời mời kết bạn</Text>
      </Pressable>

      <FlatList
        data={friends}
        renderItem={({ item }) => <FriendItem friendItem={item} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  icon: {
    height: 35,
    width: 35,
    // flexDirection: "row",
    backgroundColor: "#0091ff",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  btnAddFriend: {
    padding: 10,
    paddingBottom: 20,
    paddingTop: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  textAddFriend: {
    paddingLeft: 10,
    fontSize: 17,
  },
});
