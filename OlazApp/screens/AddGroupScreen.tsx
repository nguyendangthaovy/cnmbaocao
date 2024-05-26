import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import { FlatList, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { Avatar, Button, Icon, Input, ListItem } from "react-native-elements";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { ParamsApi } from "../components/ChatRoomItem/ChatRoomItem";
import FriendItem from "../components/FriendItem/FriendItem";
import { apiConversations } from "../service/conversationService";
import { useAppDispatch, useAppSelector } from "../store";
import {
  conversationSelector,
  getConversations,
  setCurrentConversation,
} from "../store/reducers/conversationSlice";
import { friendSeletor } from "../store/reducers/friendSlice";
import { getMessages } from "../store/reducers/messageSlice";
import { getAcronym, getGroupConversationById } from "../utils/functionGlobal";

export default function AddGroupScreen() {
  const paramsApi: ParamsApi = {
    page: 0,
    size: 20,
  };

  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const { conversations } = useAppSelector(conversationSelector);

  const { friends } = useAppSelector(friendSeletor);
  const [listAddToGroup, setListAddToGroup] = useState<any>([]);
  const [errorText, setErrorText] = useState("");
  const [friendList, setFriendList] = useState(friends);

  const nameRef = useRef("");
  const inputRef = useRef("");

  const handleSearchFriendChange = (userName: string) => {
    inputRef.current = userName;
    const friendSearchs = friends.filter((ele: any) =>
      ele.name.toLowerCase().includes(userName.toLowerCase())
    );
    setFriendList(friendSearchs);
  };

  const handleAddToGroup = (item: any) => {
    const listAddToGroupNew = [...listAddToGroup, item];
    setListAddToGroup(listAddToGroupNew);
  };
  const handleRemoveFromGroup = (itemId: string) => {
    const listAddToGroupNew = listAddToGroup.filter(
      (ele: any) => ele._id !== itemId
    );
    setListAddToGroup(listAddToGroupNew);
  };

  const handleOnchangeText = (value: string) => {
    nameRef.current = value.trim();

    if (/^(?!\s+$).+/.test(value.trim())) {
      errorText.length > 0 && setErrorText("");
    } else {
      setErrorText("Tên nhóm không hợp lệ");
    }
  };

  const handleCreateGroup = async () => {
    const name = nameRef.current;

    if (typeof name !== "string") {
      setErrorText("Tên nhóm không hợp lệ");
      return;
    }

    if (name.length <= 0) {
      setErrorText("Tên nhóm không hợp lệ");
      return;
    }
    if (!/^(?!\s+$).+/.test(name)) {
      setErrorText("Tên nhóm không hợp lệ");
      return;
    }

    if (listAddToGroup.length === 0) {
      setErrorText("Nhóm chưa có thành viên");
      return;
    }

    const userIds = listAddToGroup.map((ele: any) => ele._id);
    try {
      const response = await apiConversations.createGroup({ name, userIds });
      const res = await apiConversations.getConversationById(response.data._id);
      const conversation = res.data;
      if (conversation) {
        const conversationId = conversation._id;
        dispatch(setCurrentConversation(conversation));
        dispatch(getMessages({ conversationId, paramsApi }));
        navigation.navigate("ChatRoom");
      }
    } catch (error) {
      // commonFuc.notifyMessage(ERROR_MESSAGE);
      console.error("Create group: ", error);
    }
  };

  return (
    <View style={styles.container}>
      <ListItem
        containerStyle={{
          padding: 0,
        }}
      >
        <Input
          ref={nameRef}
          renderErrorMessage={false}
          inputContainerStyle={{
            width: "100%",
            borderBottomWidth: 0,
            borderRadius: 50,
          }}
          placeholder="Đặt tên nhóm"
          onChangeText={(value) => handleOnchangeText(value)}
        />
      </ListItem>

      <View
        style={{
          backgroundColor: "#fff",
          paddingHorizontal: 15,
          paddingVertical: 8,
        }}
      >
        {errorText.length > 0 && (
          <Text style={{ color: "red", marginBottom: 8 }}>{errorText}</Text>
        )}
        <ScrollView>
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "space-between",
              alignContent: "center",
              alignItems: "center",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center",
              }}
            >
              {listAddToGroup.length > 0 &&
                listAddToGroup.map((item: any) => (
                  <TouchableOpacity
                    key={item._id}
                    style={{ marginRight: 8 }}
                    onPress={() => handleRemoveFromGroup(item._id)}
                  >
                    <Avatar
                      rounded
                      title={getAcronym(item.name)}
                      overlayContainerStyle={{
                        backgroundColor: item?.avatarColor,
                      }}
                      source={
                        item?.avatar?.length > 0
                          ? {
                              uri: item.avatar,
                            }
                          : {}
                      }
                      size="medium"
                    >
                      <Avatar.Accessory name="x" type="feather" />
                    </Avatar>
                  </TouchableOpacity>
                ))}
            </View>

            {listAddToGroup.length > 0 && (
              <Button
                icon={
                  <Icon
                    type="antdesign"
                    name="arrowright"
                    color="#fff"
                    // size={15}
                  />
                }
                containerStyle={{ borderRadius: 50 }}
                buttonStyle={{ borderRadius: 50 }}
                onPress={handleCreateGroup}
              />
            )}
          </View>
        </ScrollView>
      </View>

      <ListItem
        containerStyle={{
          paddingHorizontal: 0,
        }}
      >
        <Input
          ref={inputRef}
          leftIcon={{ type: "ionicon", name: "search", color: "#889197" }}
          renderErrorMessage={false}
          inputContainerStyle={{
            width: "100%",
            borderBottomWidth: 0,
            borderRadius: 5,
            backgroundColor: "#d9dfeb",
            paddingHorizontal: 10,
            paddingVertical: 0,
            marginHorizontal: 0,
          }}
          inputStyle={{ marginHorizontal: 0, padding: 0 }}
          placeholder="Tìm kiếm theo tên"
          onChangeText={(value) => handleSearchFriendChange(value)}
        />
      </ListItem>

      <FlatList
        data={friendList}
        keyExtractor={(item, index) => item._id}
        initialNumToRender={12}
        renderItem={({ item }) => {
          const isExists = listAddToGroup.some(
            (ele: any) => ele._id === item._id
          );

          return (
            <View style={{ backgroundColor: "#fff" }}>
              <FriendItem
                friendItem={item}
                handleGroup={
                  () => !isExists && handleAddToGroup(item)
                  // ? handleRemoveFromGroup(item._id)
                  // : handleAddToGroup(item)
                }
                isShowButton={true}
              />
              <View
                style={{
                  width: "100%",
                  backgroundColor: "#E5E6E8",
                  height: 1,
                  marginLeft: 82,
                }}
              ></View>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#fff",
    // alignItems: "center",
    // justifyContent: "center",
  },
  badgeElement: { color: "white", fontSize: 10 },
  iconBadge: {
    color: "white",
    fontSize: 10,
    width: 15,
    height: 15,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FF5B05",
    marginTop: -26,
    marginLeft: 14,
  },
  overlay: {
    backgroundColor: "red",
  },
});
