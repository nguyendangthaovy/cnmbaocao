import { AntDesign, FontAwesome5 } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { FlatList } from "react-native-gesture-handler";
import ImageView from "react-native-image-viewing";
import { useAppSelector } from "../store";
import { conversationSelector } from "../store/reducers/conversationSlice";
import ChatRoomItem from "../components/ChatRoomItem";
import { apiConversations } from "../service/conversationService";
import { SafeAreaView } from "react-native-safe-area-context";
import ItemGroup from "../components/ItemGroup/ItemGroup";

export default function () {
  const navigation = useNavigation();

  const [groups, setGroups] = useState([]);

  useEffect(() => {
    apiConversations.getConversations("", 2).then((res) => setGroups(res.data));
  }, []);

  return (
    <View style={styles.container}>
      <Pressable
        style={styles.btnGroupFriend}
        onPress={() => navigation.navigate("AddGroupScreen")}
      >
        <View style={styles.icon}>
          <AntDesign name="addusergroup" size={24} color="white" />
        </View>
        <Text style={styles.textGroupFriend}>Tạo nhóm mới</Text>
      </Pressable>
      {groups ? (
        <FlatList
          data={groups}
          renderItem={({ item }) => <ItemGroup chatRoom={item} />}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <ActivityIndicator />
      )}
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
  btnGroupFriend: {
    padding: 10,
    paddingBottom: 20,
    paddingTop: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  textGroupFriend: {
    paddingLeft: 10,
    fontSize: 17,
  },
});
