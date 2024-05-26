import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useRef } from "react";
import { useAppDispatch } from "../../store";
import { useNavigation } from "@react-navigation/native";
import { ParamsApi } from "../ChatRoomItem/ChatRoomItem";
import {
  leaveGroup,
  setCurrentConversation,
} from "../../store/reducers/conversationSlice";
import { getMessages } from "../../store/reducers/messageSlice";
import CustomAvatar from "../CustomAvatar/CustomAvatar";
import styles from "./styles";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Swipeable } from "react-native-gesture-handler";

const ItemGroup = (props: any) => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();

  const { chatRoom } = props;

  const paramsApi: ParamsApi = {
    page: 0,
    size: 20,
  };

  const onPress = (conversation: any) => {
    const conversationId: string = conversation._id;
    dispatch(setCurrentConversation(conversation));
    dispatch(getMessages({ conversationId, paramsApi }));
    navigation.navigate("ChatRoom");
  };

  const sipeRef: any = useRef();

  const onPressDelete = () => {
    sipeRef.current.close();
    dispatch(leaveGroup({ conversationId: chatRoom._id, _: null }));
  };

  const rightSipe = () => {
    return (
      <Pressable onPress={onPressDelete} style={styles.deleteGroup}>
        <Ionicons name="log-out-outline" size={24} color="white" />
        <Animated.Text style={{ color: "white" }}>Rời</Animated.Text>
      </Pressable>
    );
  };

  return (
    <Swipeable ref={sipeRef} renderRightActions={rightSipe}>
      <Pressable style={styles.container} onPress={() => onPress(chatRoom)}>
        <CustomAvatar props={chatRoom} />

        <View style={styles.rightContainer}>
          <View style={styles.row}>
            <Text numberOfLines={1} style={styles.name}>
              {chatRoom.name}
            </Text>
          </View>
          <View style={styles.content}>
            {chatRoom.numberUnread ? (
              <Text
                numberOfLines={1}
                style={[styles.textBold, { maxWidth: 280 }]}
              >
                {chatRoom.lastMessage.user.name +
                  ": " +
                  chatRoom.lastMessage.content}
              </Text>
            ) : (
              <Text numberOfLines={1} style={styles.text}>
                {chatRoom.lastMessage.user.name +
                  " :" +
                  chatRoom.lastMessage.content}
              </Text>
            )}
          </View>
        </View>
      </Pressable>
    </Swipeable>
  );
};

export default ItemGroup;
