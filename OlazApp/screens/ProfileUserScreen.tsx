import { RootRouteProps, RootStackScreenProps } from "../types";
import { useRoute } from "@react-navigation/native";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TouchableOpacity,
  Pressable,
  ActivityIndicator,
  Alert,
} from "react-native";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { Avatar } from "react-native-elements";
import { useAppDispatch, useAppSelector } from "../store";
import { useNavigation } from "@react-navigation/native";
import { meSelector } from "../store/reducers/meSlice";
import React, { useEffect, useState } from "react";
import userApi from "../service/userService";
import { SafeAreaView } from "react-native-safe-area-context";
import { acceptFriend, inviteFriend } from "../store/reducers/friendSlice";
import { getAcronym, getConversationByUserId } from "../utils/functionGlobal";
import {
  conversationSelector,
  setCurrentConversation,
} from "../store/reducers/conversationSlice";
import jwt from "../utils/jwt";
import { getMessages } from "../store/reducers/messageSlice";
import { ParamsApi } from "../components/ChatRoomItem/ChatRoomItem";

const ProfileUserScreen = () => {
  const dispatch = useAppDispatch();

  const paramsApi: ParamsApi = {
    page: 0,
    size: 20,
  };

  const meId = jwt.getUserId();
  const { conversations } = useAppSelector(conversationSelector);

  const navigation = useNavigation();
  const route = useRoute<RootRouteProps<"ProfileUser">>();
  const [user, setUser] = useState<any>(null);
  const [status, setStatus] = useState<string>("");
  const idUser = route.params.userId;

  useEffect(() => {
    userApi.fetchUserById(idUser).then((res) => {
      setUser(res.data), setStatus(res.data.status);
    });
  }, []);

  const onPress = () => {
    if (status === "FRIEND") {
      if (meId) {
        const conversation = getConversationByUserId(user._id, conversations);
        if (conversation) {
          const conversationId: string = conversation._id;
          dispatch(setCurrentConversation(conversation));
          dispatch(getMessages({ conversationId, paramsApi }));
          navigation.navigate("ChatRoom");
        }
      }
    } else if (status === "NOT_FRIEND") {
      dispatch(inviteFriend(user));
      setStatus("");
      Alert.alert("Yêu cầu kết bạn đã được gửi");
    }
  };

  const onPressAccept = () => {
    dispatch(acceptFriend(user._id));
    setStatus("");
  };

  const onPressNoAccept = () => {
    Alert.alert("No accept");
  };

  return (
    <>
      {user ? (
        <View style={styles.container}>
          <ImageBackground
            source={require("../assets/images/default-cover-image.jpg")}
            resizeMode="cover"
            style={styles.image}
          >
            <Pressable style={styles.btnHeader}>
              <Ionicons
                name="chevron-back"
                size={26}
                color="white"
                style={styles.btnBack}
                onPress={() => navigation.navigate("Root")}
              />
              <View style={styles.btnGroup}>
                <Ionicons name="call-outline" size={26} color="white" />
              </View>
            </Pressable>
          </ImageBackground>
          <View style={styles.Avatar}>
            {user.avatar.length ? (
              <Avatar
                rounded
                source={{
                  uri: user.avatar,
                }}
                size={120}
              />
            ) : (
              <Avatar
                rounded
                title={getAcronym(user.name)}
                overlayContainerStyle={{
                  backgroundColor: user.avatarColor,
                }}
                size={120}
              />
            )}
            <View style={{ flexDirection: "row" }}>
              <Text style={styles.textNameUser}>{user.name}</Text>
              <AntDesign
                name="edit"
                size={24}
                color="black"
                style={{ paddingLeft: 10 }}
              />
            </View>
          </View>
          <View
            style={{
              paddingTop: 80,
              flexDirection: "row",
              justifyContent: "center",
            }}
          >
            <View>
              {status === "FRIEND" && (
                <TouchableOpacity
                  onPress={onPress}
                  style={[styles.btnEdit, { opacity: 1 }]}
                >
                  <View style={styles.iconEdit}>
                    <AntDesign name="message1" size={24} color="#0099FF" />
                    <Text style={styles.textEdit}> Nhắn Tin</Text>
                  </View>
                </TouchableOpacity>
              )}
            </View>
            <View>
              {status === "NOT_FRIEND" ? (
                <TouchableOpacity
                  onPress={onPress}
                  style={[styles.btnAdd, { opacity: 1, width: 300 }]}
                >
                  <AntDesign name="adduser" size={24} color="black" />
                  <Text>Kêt bạn</Text>
                </TouchableOpacity>
              ) : (
                <View>
                  {status === "FOLLOWER" ? (
                    <View
                      style={{
                        flexDirection: "row",
                      }}
                    >
                      <TouchableOpacity
                        onPress={onPressNoAccept}
                        style={[
                          styles.btnAdd,
                          {
                            backgroundColor: "#dbdbdb",
                            marginRight: 8,
                          },
                        ]}
                      >
                        <Text>Từ chối</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={onPressAccept}
                        style={[
                          styles.btnAdd,
                          {
                            marginLeft: 8,
                          },
                        ]}
                      >
                        <Text style={{ color: "#0099FF" }}>Đồng ý</Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <></>
                  )}
                </View>
              )}
            </View>
          </View>
        </View>
      ) : (
        <ActivityIndicator />
      )}
    </>
  );
};

export default ProfileUserScreen;

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  image: {
    height: 290,
    width: "100%",
    flexDirection: "column",
  },
  textNameUser: {
    fontWeight: "600",
    fontSize: 25,
    paddingLeft: 10,
    color: "black",
  },
  Avatar: {
    flex: 1,
    height: "10%",
    alignItems: "center",
    marginTop: "50%",
    marginLeft: "28%",
    marginBottom: 0,
    position: "absolute",
    borderRadius: 50,
  },
  btnBack: {
    paddingTop: 45,
    paddingLeft: 10,
  },
  btnGroup: {
    flex: 1,
    paddingTop: 45,
    alignItems: "flex-end",
    marginEnd: 25,
  },
  btnHeader: {
    flexDirection: "row",
  },
  textEdit: {
    color: "#0099FF",
    fontWeight: "600",
    fontSize: 15,
  },
  btnEdit: {
    width: 300,
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    borderRadius: 30,
    backgroundColor: "#B0E2FF",
  },
  iconEdit: {
    flexDirection: "row",
  },
  btnAdd: {
    flexDirection: "row",
    backgroundColor: "#B0E2FF",
    height: 40,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    width: 100,
  },
});
